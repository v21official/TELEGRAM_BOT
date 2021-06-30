import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, ChangePasswordDto } from './user.dto';
import { User, UserDocument } from '../user/user.schema';
import * as crypto from 'crypto-js';
import { CONSTANTS } from '../util/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
    ) {}

    async findAll(): Promise<User[]> {
        const data = await this.userModel.find({ isActive: false }).exec();
        return data;
    }

    async findByUsername({ username }): Promise<User> {
        return await this.userModel.findOne({ username, isActive: true });
    }

    async register(dto: CreateUserDto): Promise<User> {
        const checkUsername = await this.userModel.findOne({
            username: dto.username,
            isActive: true,
        });
        if (checkUsername)
            // throw new HttpException('username already', HttpStatus.BAD_REQUEST)
            throw new BadRequestException(CONSTANTS.ERROR.USERNAME_EXISTS);
        const passwordHash = await this.encrypt(dto.password);
        const createdUser = new this.userModel({
            username: dto.username,
            password: passwordHash,
            name: dto.name,
        });
        return await createdUser.save();
    }

    async changePassword(user: any, changePasswordDto: ChangePasswordDto): Promise<any> {
        const findUser = await this.userModel.findOne({
            username: user.username,
            isActive: true,
        });
        const passwordDecrypted = await this.decrypt(findUser.password);
        if (changePasswordDto.password !== passwordDecrypted)
            throw new BadRequestException('Mật khẩu không chính xác');
        const passwordHash = await this.encrypt(changePasswordDto.newPassword);
        await this.userModel
            .updateOne(
                { _id: findUser._id },
                {
                    password: passwordHash,
                },
                {},
            )
            .exec();
        return 'Đổi mật khẩu thành công';
    }

    async encrypt(text: string): Promise<string> {
        let secretKey = this.configService.get<string>('SECRET_KEY');
        if (!secretKey) {
            secretKey = CONSTANTS.SECRET_KEY;
        }
        return crypto.AES.encrypt(text, secretKey).toString();
    }

    async decrypt(text: string): Promise<string> {
        let secretKey = this.configService.get<string>('SECRET_KEY');
        if (!secretKey) {
            secretKey = CONSTANTS.SECRET_KEY;
        }
        const bytes = await crypto.AES.decrypt(text, secretKey);
        return bytes.toString(crypto.enc.Utf8);
    }

    // async isOwner(owner: string, username: string): Promise<boolean> {
    //     return this.accountModel.exists({ username, owner: owner })
    // }
}
