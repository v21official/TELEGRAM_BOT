import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Request,
    SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ChangePasswordDto } from './user.dto';

export const Public = () => SetMetadata('isPublic', true);

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.userService.register(createUserDto);
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('changePassword')
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
      return await this.userService.changePassword(req.user, changePasswordDto);
    }
}
