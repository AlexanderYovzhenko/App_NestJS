import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AllExceptionsFilter } from 'src/exception-filters/all-exceptions.filter';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/role-auth.decorator';
import { RoleGuard } from 'src/roles/role.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { DeBanUserDto } from './dto/de-ban-user.dto';

@ApiTags('Profile')
@UseFilters(AllExceptionsFilter)
@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('registration')
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile(createProfileDto);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: HttpStatus.OK })
  // @Roles('ADMIN')
  // @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('profile')
  getAll() {
    return this.profileService.getAll();
  }

  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiResponse({ status: HttpStatus.OK })
  // @Roles('ADMIN')
  // @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('profile/:id')
  getOne(@Param('id') id: string) {
    return this.profileService.getOne(+id);
  }

  @ApiOperation({ summary: 'Обновить профиль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Put('profile/:id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @ApiOperation({ summary: 'Удалить профиль' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete('profile/:id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @ApiOperation({ summary: 'Забанить пользователя' })
  @ApiResponse({ status: 201 })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('profile/ban')
  ban(@Body() banUser: BanUserDto) {
    return this.profileService.banToUser(banUser);
  }

  @ApiOperation({ summary: 'Разбанить пользователя' })
  @ApiResponse({ status: 201 })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('profile/de-ban')
  deBan(@Body() deBanUser: DeBanUserDto) {
    return this.profileService.deBanToUser(deBanUser);
  }
}
