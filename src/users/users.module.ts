import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './controllers/users.controller';
import { User } from './user.entity';
import {AuthService} from "../auth/auth.service";
import {JwtModule, JwtService} from '@nestjs/jwt';
import {jwtConstants} from "../auth/constants";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}