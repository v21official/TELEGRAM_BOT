import { BadRequestException, Body, Controller, Get, Ip, Param, Post, Query, Redirect, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './link.dto';

@Controller('link')
export class LinkController {
    constructor(private readonly linkService: LinkService) { }

    @Post('create')
    async create(@Request() req, @Body() createLinkDto: CreateLinkDto) {
        return await this.linkService.create(req, createLinkDto);
    }

    @Get('getMyLinks')
    async getMyLinks(@Request() req) {
        return await this.linkService.findAllByUsername(req.user.username);
    }

    @Post('delete')
    async delete(@Request() req, @Body('alias') alias: string) {
        return await this.linkService.delete(req, alias);
    }
}

