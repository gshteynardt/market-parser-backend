import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            // Кастомное название полей
            usernameField: 'email',
            passwordField: 'password',
            fullNameField: 'full_name',
        });
    }

    async validate(email: string, password: string, full_name: string): Promise<any> {
        const user = await this.authService.validateUser(email, password, full_name);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user
    }
}