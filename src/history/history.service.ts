import { BadRequestException, Injectable } from '@nestjs/common';
import { History, HistoryDocument } from '../history/history.schema';
import { CONSTANTS } from '../util/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateHistoryDto, GetListHistoryDto, UpdateHistoryDto } from './history.dto';

@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(History.name) private readonly historyModel: Model<HistoryDocument>,
        private readonly configService: ConfigService,
    ) {}
    async create(username: string, dto: CreateHistoryDto): Promise<History> {
        const created = new this.historyModel({
            username,
            partner: dto.partner,
            money: dto.money,
            type: dto.type,
            note: dto.note,
        });
        return await created.save();
    }

    async getList(username: string, dto: GetListHistoryDto): Promise<History[]> {
        const filters: any = {
            type: dto.type,
            username,
            isActive: true,
        };
        const data = await this.historyModel.find(filters).sort({ completed: 1, money: -1 }).exec();
        return data;
    }

    async getTotal(username: string, dto: GetListHistoryDto): Promise<History[]> {
        const filters: any = {
            type: dto.type,
            completed: false,
            isActive: true,
            username,
        };
        const data = await this.historyModel.find(filters).exec();
        return data.reduce((sum, element) => sum + element.money, 0);
    }

    async update(username: string, dto: UpdateHistoryDto): Promise<any> {
        return await this.historyModel
            .updateOne(
                { _id: dto._id },
                {
                    isActive: dto.isActive,
                    completed: dto.completed,
                },
                {},
            )
            .exec();
    }
}
