import { Body, Controller, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { CreateHistoryDto, GetListHistoryDto, UpdateHistoryDto } from './history.dto';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Post()
    async create(@Request() req, @Body() dto: CreateHistoryDto) {
        return await this.historyService.create(req.user.username, dto);
    }

    @Post('getList')
    async getList(@Request() req, @Body() dto: GetListHistoryDto) {
        return await this.historyService.getList(req.user.username, dto);
    }

    @Post('getTotal')
    async getTotal(@Request() req, @Body() dto: GetListHistoryDto) {
        return await this.historyService.getTotal(req.user.username, dto);
    }

    @Post('update')
    async update(@Request() req, @Body() dto: UpdateHistoryDto) {
        return await this.historyService.update(req.user.username, dto);
    }
}
