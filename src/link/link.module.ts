import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { Link, LinkSchema } from './schema/link.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }])],
    controllers: [LinkController],
    providers: [LinkService],
    exports: [LinkService],
})
export class LinkModule {}
