import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as TelegramBot from 'node-telegram-bot-api';
import { Telegraf, Markup } from 'telegraf';
import { get, post } from './api';
import { CONSTANTS, getFullName, validateDomain } from './util/constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT || 9496);
    console.log(`Application is running on: ${await app.getUrl()}`);

    const bot = new Telegraf(process.env.TOKEN_BOT);
    const botId = process.env.ID_BOT;
    const state: any = {};

    bot.start((ctx) => ctx.reply(CONSTANTS.BOT_INTRO));
    bot.help((ctx) => ctx.reply(CONSTANTS.BOT_INTRO));
    bot.on('photo', (ctx) => ctx.reply('👍 🤣 🤯 🥳 🥰 wow ảnh đẹp ghê ^^'));
    bot.hears('hi', (ctx) => ctx.reply('Hi ' + getFullName(ctx.message.from)));

    bot.command('tha_tim', (ctx) => {
        state[ctx.message.from.id] = '';
        return ctx.reply(`❤`);
    });

    bot.command(CONSTANTS.COMMAND.CANCEL, (ctx) => {
        state[ctx.message.from.id] = {};
        return ctx.reply(`Clean!`, Markup.removeKeyboard());
    });

    bot.command(CONSTANTS.COMMAND.MONITOR_ADD, (ctx) => {
        state[ctx.message.from.id] = {
            monitor_add: {
                type: [],
            },
        };
        const inlineKeyboard = Markup.inlineKeyboard([
            Markup.button.callback('HTTP', 'HTTP'),
            Markup.button.callback('WHOIS', 'WHOIS'),
            Markup.button.callback('SSL', 'SSL'),
        ]);
        // return ctx.replyWithMarkdown(`Nhập tên miền muốn theo dõi`, inlineKeyboard);
        return ctx.reply(
            `Chọn dịch vụ theo dõi hoặc bấm /cancel để hủy`,
            Markup.keyboard([['HTTP', 'WHOIS', 'SSL']]).oneTime(),
        );
    });

    bot.action('HTTP', (ctx) => {
        return ctx.reply('🙂');
    });

    bot.command(CONSTANTS.COMMAND.WHOIS, (ctx) => {
        state[ctx.message.from.id] = { whois: true };
        return ctx.reply(`Nhập tên miền muốn kiểm tra`);
    });

    bot.on('text', async (ctx) => {
        const userId = ctx.message.from.id;
        console.log('state', state);

        if (state[userId]?.whois) {
            const whois = await get(
                `https://whois.inet.vn/api/whois/domainspecify/${ctx.message.text}`,
            );
            if (whois.code == '0') {
                if (whois.message != 'Đã được đăng ký') {
                    return ctx.reply(whois.message);
                }
                state[userId] = '';
                return ctx.reply(
                    `Tên miền: ${whois.domainName}
Nhà đăng ký: <code>${whois.registrar}</code>
Ngày đăng ký: <code>${whois.creationDate.replace(/-/g, '/')}</code>
Ngày hết hạn: <code>${whois.expirationDate.replace(/-/g, '/')}</code>`,
                    { parse_mode: 'HTML' },
                );
            }
            return ctx.reply('Tên miền chưa được đăng ký');
        }

        if (state[userId]?.monitor_add) {
            if (state[userId].monitor_add.type.length == 0) {
                state[userId].monitor_add.type.push(ctx.message.text);
                return ctx.reply(`Nhập tên miền muốn theo dõi`);
            }
            if (!validateDomain(ctx.message.text)) {
                return ctx.reply('Tên miền sai định dạng');
            }
            const data = await post(`http://103.57.222.93:8082/api/service/create_update`, {
                serviceCreateUpdateDtoList: [
                    {
                        name: ctx.message.text,
                        description: '',
                        type: state[userId].monitor_add.type,
                    },
                ],
            });
            if (data.status == CONSTANTS.STATUS.SUCCESS) {
                state[userId] = '';
                return ctx.reply('Tên miền đã được theo dõi');
            } else {
                if (data.message == 'Dịch vụ theo dõi không hợp lệ') {
                    ctx.reply(data.message);
                    state[userId].monitor_add.type = [];
                    return ctx.reply(
                        `Chọn dịch vụ theo dõi hoặc bấm /cancel để hủy`,
                        Markup.keyboard([['HTTP', 'WHOIS', 'SSL']]).oneTime(),
                    );
                }
                return ctx.reply(`${data.message}
Thử lại với tên miền khác hoặc bấm /cancel để hủy`);
            }
        }

        if (ctx.message.chat.type == 'private') {
            ctx.reply(CONSTANTS.BOT_INTRO);
        }

        console.log('============= on text =============', ctx.message);
    });

    bot.on('message', async (ctx) => {
        const msg: any = ctx.message;
        if (msg.left_chat_member) {
            if (msg.left_chat_member.id == botId) {
                console.log('Bot da bi xoa khoi group');
                return;
            }
            return ctx.reply(`Tạm biệt ${getFullName(msg.left_chat_member)}`);
        }

        if (msg.new_chat_member) {
            return ctx.reply(`Chào mừng thành viên mới ${getFullName(msg.new_chat_member)}`);
        }

        console.log('============= on message =============', ctx);
    });

    await bot.launch();
}
bootstrap();
