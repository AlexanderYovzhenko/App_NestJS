import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../guards/role-auth.decorator';
import { RoleGuard } from '../guards/role.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { AuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Создать роль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('roles')
  create(@Body() createRole: CreateRoleDto) {
    return this.rolesService.createRole(createRole);
  }

  @ApiOperation({ summary: 'Получить все роли' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('roles')
  getAll() {
    return this.rolesService.getAllRole();
  }

  @ApiOperation({ summary: 'Получить роль' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('roles/:value')
  getByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }

  @ApiOperation({ summary: 'Обновить роль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put('roles/:value')
  update(@Param('value') value: string, @Body() updateRole: UpdateRoleDto) {
    return this.rolesService.updateRole(value, updateRole);
  }

  @ApiOperation({ summary: 'Удалить роль' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('roles/:value')
  remove(@Param('value') value: string) {
    return this.rolesService.removeRole(value);
  }

  // set role to user
  @ApiOperation({ summary: 'Выдать роль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('/user/add-role')
  addRole(@Body() addRole: AddRoleDto) {
    return this.rolesService.addRoleToUser(addRole);
  }

  // delete role to user
  @ApiOperation({ summary: 'Забрать роль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('/user/remove-role')
  removeRole(@Body() removeRole: RemoveRoleDto) {
    return this.rolesService.removeRoleToUser(removeRole);
  }
}
