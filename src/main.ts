import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as TelegramBot from 'node-telegram-bot-api';
import { request } from 'https';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.listen(9496);
    console.log(`Application is running on: ${await app.getUrl()}`);

    const myId = 1851862079;
    const myUsername = 'v21official_bot';
    const myToken = '1851862079:AAH3yPiqUD4kDCrMET-bPB25Th07G1ToPQI';
    const bot = new TelegramBot(myToken, { polling: true });

    // Matches /echo [whatever]
    bot.onText(/\/echo (.+)/, (msg, match) => {
        console.log(match);
        const chatId = msg.chat.id;
        const whatever = match[1];
        bot.sendMessage(chatId, whatever);
    });

    // Matches /photo
    bot.onText(/\/photo/, (msg) => {
        // From file path
        const photo = `/public/hagiang.jpg`;
        console.log(photo);
        bot.sendPhoto(msg.chat.id, photo, {
            caption: "I'm a bot!",
        });
    });

    // Matches /audio
    bot.onText(/\/audio/, (msg) => {
        console.log(__dirname);
        const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
        bot.sendAudio(msg.chat.id, url);
    });

    // Matches /love
    bot.onText(/\/bot_ask/, (msg) => {
        const opts = {
            // parse_mode: "HTML",
            // reply_to_message_id: msg.message_id,
            reply_markup: {
                remove_keyboard: true,
                resize_keyboard: true,
                one_time_keyboard: true,
                keyboard: [
                    ['Yes, you are the bot of my life ❤'],
                    ['No :)', 'still NO but uppercase'],
                ],
            },
        };
        bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
    });

    bot.onText(/\/tha_tim/, (msg) => {
        bot.sendMessage(msg.chat.id, '❤', {
            reply_markup: {
                remove_keyboard: true,
                keyboard: [],
            },
        });
    });

    bot.onText(/\/send_html/, (msg) => {
        bot.sendMessage(
            msg.chat.id,
            `<a href="fb.com/v21official">open facebook</a>
<b>in đậm</b>
<i>in nghiêng</i>
<code>thẻ code</code>
`,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    remove_keyboard: true,
                    keyboard: [],
                },
            },
        );
    });

    // Matches /editable
    bot.onText(/\/do_vui/, (msg) => {
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Xem kết quả',
                            // we shall check for this value when we listen
                            // for "callback_query"
                            callback_data: 'viewResult',
                        },
                    ],
                ],
            },
        };
        bot.sendMessage(msg.chat.id, 'Điền vào chỗ trống: iNET S_ _ _w_ _ _', opts);
    });

    // Handle callback queries
    bot.on('callback_query', (callbackQuery) => {
        const action = callbackQuery.data;
        const msg = callbackQuery.message;
        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
        };
        let text = '';
        if (action === 'viewResult') {
            text = 'Cú lừa hihi: iNET Sssswwww';
        }
        // if (text) bot.editMessageText(text, opts);
        if (text){
            bot.editMessageText(msg.text, opts);
            bot.sendMessage(msg.chat.id, 'Cú lừa hihi: iNET Sssswwww');
        }
    });

    // Handle receive message
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        console.log('=========================================================');
        console.log(msg);

        if (msg.left_chat_member) {
            if (msg.left_chat_member.id == myId) {
                console.log('Bot da bi xoa khoi group');
                return;
            }
            const memberName = (
                (msg.left_chat_member.first_name ? msg.left_chat_member.first_name : '') +
                ' ' +
                (msg.left_chat_member.last_name ? msg.left_chat_member.last_name : '')
            ).trim();
            bot.sendMessage(chatId, `Tạm biệt ${memberName}`);
            return;
        }

        if (msg.new_chat_member) {
            const memberName = (
                (msg.new_chat_member.first_name ? msg.new_chat_member.first_name : '') +
                ' ' +
                (msg.new_chat_member.last_name ? msg.new_chat_member.last_name : '')
            ).trim();
            bot.sendMessage(chatId, `Chào mừng thành viên mới: ${memberName}`);
            return;
        }

        if (msg.text) {
            // bot.sendMessage(
            //     chatId,
            //     `${(
            //         (msg.from.first_name ? msg.from.first_name : '') +
            //         ' ' +
            //         (msg.from.last_name ? msg.from.last_name : '')
            //     ).trim()} nói "${msg.text}"`,
            // );
            return;
        }
    });

    bot.on('polling_error', (error) => {
        console.log(error);
    });
}
bootstrap();
