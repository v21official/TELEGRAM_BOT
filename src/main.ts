import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as TelegramBot from 'node-telegram-bot-api';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.listen(9496);
    console.log(`Application is running on: ${await app.getUrl()}`);

    const myId = 1851862079;
    const myUsername = 'v21official_bot';
    const myToken = '1851862079:AAH3yPiqUD4kDCrMET-bPB25Th07G1ToPQI';
    const bot = new TelegramBot(myToken, { polling: true });

    bot.onText(/\/echo (.+)/, (msg, match) => {
        console.log('======================');
        const chatId = msg.chat.id;
        const resp = match[1];
        bot.sendMessage(chatId, resp);
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        console.log(msg);

        if (msg.left_chat_member) {
            if (msg.left_chat_member.id == myId) {
                console.log('Bot da bi xoa khoi group');
                return;
            }
            bot.sendMessage(
                chatId,
                `Xin chia buồn với thành viên: ${(
                    (msg.left_chat_member.first_name ? msg.left_chat_member.first_name : '') +
                    ' ' +
                    (msg.left_chat_member.last_name ? msg.left_chat_member.last_name : '')
                ).trim()}`,
            );
            return;
        }

        if (msg.new_chat_members) {
            const listNameAdded: string[] = [];
            msg.new_chat_members.map((newMember: any) => {
                listNameAdded.push(
                    (
                        (newMember.first_name ? newMember.first_name : '') +
                        ' ' +
                        (newMember.last_name ? newMember.last_name : '')
                    ).trim(),
                );
                if (newMember.id == myId) {
                    console.log('Da luu thong tin group');
                }
            });
            bot.sendMessage(chatId, `Chào mừng thành viên mới: ${listNameAdded.join(', ')}`);
            return;
        }

        if (msg.text) {
            bot.sendMessage(chatId, `${msg.from.first_name}  "${msg.text}"`);
            return;
        }
    });
}
bootstrap();
