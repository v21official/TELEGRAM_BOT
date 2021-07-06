import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as TelegramBot from 'node-telegram-bot-api';
import { Telegraf } from 'telegraf';
// const { Markup } = Telegraf;
import { get, post } from './api';
import { CONSTANTS, validateDomain } from './util/constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT || 9496);
    console.log(`Application is running on: ${await app.getUrl()}`);

    const bot = new Telegraf(process.env.TOKEN_BOT);
    const botId = process.env.ID_BOT;
    const command: any = {};

    bot.start((ctx) => ctx.reply(CONSTANTS.BOT_INTRO));
    bot.help((ctx) => ctx.reply(CONSTANTS.BOT_INTRO));
    bot.on('photo', (ctx) => ctx.reply('👍 🤣 🤯 🥳 🥰'));
    bot.hears('hi', (ctx) => ctx.reply('Hi ' + ctx.from.username));

    bot.command('tha_tim', (ctx) => {
        command[ctx.message.from.id] = '';
        return ctx.reply(`❤`);
    });

    bot.command(CONSTANTS.COMMAND.CANCEL, (ctx) => {
        command[ctx.message.from.id] = '';
        return ctx.reply(`Clean!`);
    });

    bot.command(CONSTANTS.COMMAND.MONITOR_ADD, (ctx) => {
        command[ctx.message.from.id] = CONSTANTS.COMMAND.MONITOR_ADD;
        // const inlineKeyboard = Markup.inlineKeyboard([
        //     Markup.callbackButton('👍', 'like'),
        //     Markup.callbackButton('👎', 'dislike'),
        // ]).extra();
        return ctx.replyWithMarkdown(`Nhập tên miền muốn theo dõi`);
    });

    bot.command(CONSTANTS.COMMAND.WHOIS, (ctx) => {
        command[ctx.message.from.id] = CONSTANTS.COMMAND.WHOIS;
        return ctx.reply(`Nhập tên miền muốn kiểm tra`);
    });

    bot.on('text', async (ctx) => {
        const userId = ctx.message.from.id;
        console.log('state', command);

        if (command[userId] == CONSTANTS.COMMAND.WHOIS) {
            const whois = await get(
                `https://whois.inet.vn/api/whois/domainspecify/${ctx.message.text}`,
            );
            if (whois.code == '0') {
                command[userId] = '';
                ctx.reply(
                    `Tên miền: ${whois.domainName}
Nhà đăng ký: <code>${whois.registrar}</code>
Ngày đăng ký: <code>${whois.creationDate.replace(/-/g, '/')}</code>
Ngày hết hạn: <code>${whois.expirationDate.replace(/-/g, '/')}</code>`,
                    { parse_mode: 'HTML' },
                );
                return;
            }
            ctx.reply('Tên miền chưa được đăng ký');
            return;
        }

        if (command[userId] == CONSTANTS.COMMAND.MONITOR_ADD) {
            if (!validateDomain(ctx.message.text)) {
                ctx.reply('Tên miền sai định dạng');
                return;
            }
            const data = await post(`http://103.57.222.93:8082/api/service/create_update`, {
                serviceCreateUpdateDtoList: [
                    {
                        name: ctx.message.text,
                        description: '',
                        type: ['HTTP'],
                    },
                ],
            });
            if (data.status == CONSTANTS.STATUS.SUCCESS) {
                command[userId] = '';
                ctx.reply('Tên miền đã được theo dõi');
            } else {
                ctx.reply(`${data.message}
Thử lại với tên miền khác`);
            }
            return;
        }

        if (ctx.message.chat.type == 'private') {
            ctx.reply(CONSTANTS.BOT_INTRO);
        }

        console.log('============= on text =============', ctx);
    });

    bot.on('message', async (ctx) => {
        const msg: any = ctx.message;
        if (msg.left_chat_member) {
            if (msg.left_chat_member.id == botId) {
                console.log('Bot da bi xoa khoi group');
                return;
            }
            const memberName = (
                (msg.left_chat_member.first_name ? msg.left_chat_member.first_name : '') +
                ' ' +
                (msg.left_chat_member.last_name ? msg.left_chat_member.last_name : '')
            ).trim();
            ctx.reply(`Tạm biệt ${memberName}`);
            return;
        }

        if (msg.new_chat_member) {
            const memberName = (
                (msg.new_chat_member.first_name ? msg.new_chat_member.first_name : '') +
                ' ' +
                (msg.new_chat_member.last_name ? msg.new_chat_member.last_name : '')
            ).trim();
            ctx.reply(`Chào mừng thành viên mới: ${memberName}`);
            return;
        }

        console.log('============= on message =============', ctx);
    });

    await bot.launch();

    // const botId = 1851862079;
    // const myToken = process.env.TOKEN_BOT;
    // const bot = new TelegramBot(myToken, { polling: true });
    //
    // // Matches /echo [whatever]
    // bot.onText(/\/echo (.+)/, (msg, match) => {
    //     console.log(match);
    //     const chatId = msg.chat.id;
    //     const whatever = match[1];
    //     bot.sendMessage(chatId, whatever);
    // });
    //
    // bot.onText(/\/monitor_add/, async (msg) => {
    //     bot.sendMessage(msg.chat.id, '👍');
    // });
    //
    // // Matches /photo
    // bot.onText(/\/photo/, async (msg) => {
    //     // From file path
    //     const photo = 'http://inet.vn/public/img/banners/email-theo-ten-mien-featured.png';
    //     bot.sendPhoto(msg.chat.id, photo, { caption: "I'm a bot!" });
    // });
    //
    // // Matches /audio
    // bot.onText(/\/audio/, (msg) => {
    //     const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
    //     bot.sendAudio(msg.chat.id, url);
    // });
    //
    // // Matches /love
    // bot.onText(/\/bot_ask/, (msg) => {
    //     const opts = {
    //         // parse_mode: "HTML",
    //         // reply_to_message_id: msg.message_id,
    //         reply_markup: {
    //             remove_keyboard: true,
    //             resize_keyboard: true,
    //             one_time_keyboard: true,
    //             keyboard: [
    //                 ['Yes, you are the bot of my life ❤'],
    //                 ['No :)', 'still NO but uppercase'],
    //             ],
    //         },
    //     };
    //     bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
    // });
    //
    // bot.onText(/\/tha_tim/, (msg) => {
    //     bot.sendMessage(msg.chat.id, '❤', {
    //         reply_markup: {
    //             remove_keyboard: true,
    //             keyboard: [],
    //         },
    //     });
    // });
    //
    // bot.onText(/\/remove_keyboard/, (msg) => {
    //     bot.sendMessage(msg.chat.id, 'Success! Keyboard removed', {
    //         reply_markup: {
    //             remove_keyboard: true,
    //             keyboard: [],
    //         },
    //     });
    // });
    //
    // bot.onText(/\/send_html/, (msg) => {
    //     bot.sendMessage(
    //         msg.chat.id,
    //         `<a href="fb.com/v21official">open facebook</a>
    // <b>in đậm</b>
    // <i>in nghiêng</i>
    // <code>thẻ code</code>
    // thả tim luôn /tha_tim
    // `,
    //         {
    //             parse_mode: 'HTML',
    //             reply_markup: {
    //                 remove_keyboard: true,
    //                 keyboard: [],
    //             },
    //         },
    //     );
    // });
    //
    // // Matches /editable
    // bot.onText(/\/do_vui/, (msg) => {
    //     const opts = {
    //         reply_markup: {
    //             inline_keyboard: [
    //                 [
    //                     {
    //                         text: 'Xem kết quả',
    //                         // we shall check for this value when we listen
    //                         // for "callback_query"
    //                         callback_data: 'viewResult',
    //                     },
    //                 ],
    //             ],
    //         },
    //     };
    //     bot.sendMessage(msg.chat.id, 'Điền vào chỗ trống: iNET S_ _ _w_ _ _', opts);
    // });
    //
    // // Handle callback queries
    // bot.on('callback_query', (callbackQuery) => {
    //     // callback_query use with inline_keyboard
    //     const action = callbackQuery.data;
    //     const msg = callbackQuery.message;
    //     const opts = {
    //         chat_id: msg.chat.id,
    //         message_id: msg.message_id,
    //     };
    //     let text;
    //     if (action === 'viewResult') {
    //         bot.editMessageText(
    //             `${msg.text}
    // Bất ngờ chưa haha: iNET Sssswwww`,
    //             opts,
    //         );
    //     }
    // });
    //
    // // Handle receive message
    // bot.on('message', (msg) => {
    //     const chatId = msg.chat.id;
    //     console.log('=========================================================');
    //     console.log(msg);
    //
    //     if (msg.left_chat_member) {
    //         if (msg.left_chat_member.id == botId) {
    //             console.log('Bot da bi xoa khoi group');
    //             return;
    //         }
    //         const memberName = (
    //             (msg.left_chat_member.first_name ? msg.left_chat_member.first_name : '') +
    //             ' ' +
    //             (msg.left_chat_member.last_name ? msg.left_chat_member.last_name : '')
    //         ).trim();
    //         bot.sendMessage(chatId, `Tạm biệt ${memberName}`);
    //         return;
    //     }
    //
    //     if (msg.new_chat_member) {
    //         const memberName = (
    //             (msg.new_chat_member.first_name ? msg.new_chat_member.first_name : '') +
    //             ' ' +
    //             (msg.new_chat_member.last_name ? msg.new_chat_member.last_name : '')
    //         ).trim();
    //         bot.sendMessage(chatId, `Chào mừng thành viên mới: ${memberName}`);
    //         return;
    //     }
    //
    //     if (msg.text) {
    //         // bot.sendMessage(
    //         //     chatId,
    //         //     `${(
    //         //         (msg.from.first_name ? msg.from.first_name : '') +
    //         //         ' ' +
    //         //         (msg.from.last_name ? msg.from.last_name : '')
    //         //     ).trim()} nói "${msg.text}"`,
    //         // );
    //         return;
    //     }
    // });
    //
    // bot.on('polling_error', (error) => {
    //     console.log(error);
    // });
}
bootstrap();
