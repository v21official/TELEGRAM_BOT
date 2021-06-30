import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryDocument = History & Document;

@Schema({ timestamps: true })
export class History {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    partner: string;

    @Prop({ required: true })
    money: number;

    // @Prop({ required: true })
    // payDate: Date;

    @Prop()
    note: string;

    @Prop({ required: true })
    type: string;

    @Prop({ default: false })
    completed: boolean;

    @Prop({ default: true })
    isActive: boolean;
}

export const HistorySchema = SchemaFactory.createForClass(History);
