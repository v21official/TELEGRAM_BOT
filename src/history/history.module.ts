import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from '../history/history.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
        ConfigModule,
    ],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule {}
