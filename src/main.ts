import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Telegraf, Markup } from 'telegraf';
import { CONSTANTS, getFullName, validateDomain } from './util/constants';
import { whoisDomain } from './api/inet';
import { addMonitor } from './api/monitor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT || 8888);
    console.log(`Application is running on: ${await app.getUrl()}`);

    const botToken = process.env.TOKEN_BOT;
    const botId = botToken.split(':')[0];
    const bot = new Telegraf(botToken);

    const state: any = {};
    const optionHTML: any = { parse_mode: 'HTML' };
    const removeKeyboard: any = Markup.removeKeyboard();

    bot.start((ctx) => ctx.reply(CONSTANTS.BOT_INTRO));
    bot.help((ctx) => ctx.reply(CONSTANTS.BOT_INTRO));
    bot.hears('hello', (ctx) => ctx.reply('Xin chào ' + getFullName(ctx.message.from)));

    bot.command(CONSTANTS.COMMAND.CANCEL, (ctx) => {
        state[ctx.message.from.id] = {};
        return ctx.reply(`Clean`, removeKeyboard);
    });

    bot.command(CONSTANTS.COMMAND.MONITOR_ADD, (ctx) => {
        state[ctx.message.from.id] = {
            monitor_add: {
                type: [],
            },
        };
        return ctx.reply(
            `Chọn dịch vụ theo dõi (hoặc bấm /cancel để hủy)`,
            Markup.keyboard([['HTTP', 'WHOIS', 'SSL']]).oneTime(),
        );
    });

    bot.command(CONSTANTS.COMMAND.WHOIS, (ctx) => {
        state[ctx.message.from.id] = { whois: true };
        return ctx.reply(`Nhập tên miền muốn kiểm tra`);
    });

    bot.on('text', async (ctx) => {
        const userId = ctx.message.from.id;

        if (state[userId]?.whois) {
            const domainDetail = await whoisDomain(ctx.message.text);
            if (domainDetail.code == '0') {
                if (domainDetail.message != 'Đã được đăng ký') {
                    return ctx.reply(domainDetail.message);
                }
                state[userId] = '';
                return ctx.reply(
                    `Tên miền: ${domainDetail.domainName}
Nhà đăng ký: <code>${domainDetail.registrar}</code>
Ngày đăng ký: <code>${domainDetail.creationDate.replace(/-/g, '/')}</code>
Ngày hết hạn: <code>${domainDetail.expirationDate.replace(/-/g, '/')}</code>`,
                    optionHTML,
                );
            }
            return ctx.reply('Tên miền chưa được đăng ký');
        }

        if (state[userId]?.monitor_add) {
            if (state[userId].monitor_add.type.length == 0) {
                state[userId].monitor_add.type.push(ctx.message.text);
                return ctx.reply(
                    `Nhập tên miền muốn theo dõi (hoặc bấm /cancel để hủy)`,
                    removeKeyboard,
                );
            }
            if (!validateDomain(ctx.message.text)) {
                return ctx.reply(CONSTANTS.TEXT.INVALID_DOMAIN);
            }
            ctx.reply(CONSTANTS.TEXT.PROCESSING);
            const data = await addMonitor({
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
                return ctx.reply(CONSTANTS.TEXT.SUCCESS);
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
Nhập tên miền khác hoặc bấm /cancel để hủy`);
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
            if (msg.left_chat_member.id == botId) return;
            return ctx.reply(
                `Tạm biệt <code>${getFullName(msg.left_chat_member)}</code>`,
                optionHTML,
            );
        }

        if (msg.new_chat_member) {
            if (msg.new_chat_member.id == botId) return;
            return ctx.reply(
                `Chào mừng thành viên mới <code>${getFullName(msg.new_chat_member)}</code>`,
                optionHTML,
            );
        }

        console.log('============= on message =============', ctx.message);
    });

    await bot.launch();
}
bootstrap();
