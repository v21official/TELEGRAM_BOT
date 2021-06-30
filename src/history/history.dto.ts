import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoryDto {
    @IsString()
    @IsNotEmpty()
    readonly partner: string;

    @IsString()
    @IsNotEmpty()
    readonly type: string;

    @IsInt()
    @IsNotEmpty()
    readonly money: number;

    // @IsNotEmpty()
    // readonly payDate: Date;

    readonly note: string;
}

export class GetListHistoryDto {
    @IsString()
    @IsNotEmpty()
    readonly type: string;

    readonly text: string;
}

export class UpdateHistoryDto {
    @IsString()
    @IsNotEmpty()
    readonly _id: string;

    // @IsString()
    // @IsNotEmpty()
    // readonly partner: string;
    //
    // @IsString()
    // @IsNotEmpty()
    // readonly type: string;
    //
    // @IsInt()
    // @IsNotEmpty()
    // readonly money: number;

    readonly completed: boolean;

    readonly isActive: boolean;

    readonly note: string;
}