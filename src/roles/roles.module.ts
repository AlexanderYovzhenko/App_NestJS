import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, UserRole]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
