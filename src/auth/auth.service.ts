import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, passwordInput: string): Promise<any> {
        const user = await this.userService.findByUsername({ username })
        if (user) {
            const passwordDecrypted = await this.userService.decrypt(user.password)
            if (passwordInput !== passwordDecrypted) return null
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user._doc.username, id: user._doc._id, name: user._doc.name }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
