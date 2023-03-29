import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/roles/entities/user-role.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole]),
    ConfigModule.forRoot({}),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secret_key',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
