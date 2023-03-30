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
  UseFilters,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from './role-auth.decorator';
import { RoleGuard } from './role.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { AllExceptionsFilter } from 'src/exception-filters/all-exceptions.filter';
import { RemoveRoleDto } from './dto/remove-role.dto';
import { AuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Role')
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard)
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Создать роль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('roles')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
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
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Put('roles/:value')
  update(@Param('value') value: string, @Body() updateRole: UpdateRoleDto) {
    return this.rolesService.updateRole(value, updateRole);
  }

  @ApiOperation({ summary: 'Удалить роль' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Delete('roles/:value')
  remove(@Param('value') value: string) {
    return this.rolesService.removeRole(value);
  }

  @ApiOperation({ summary: 'Выдать роль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('/user/role')
  addRole(@Body() addRole: AddRoleDto) {
    return this.rolesService.addRoleToUser(addRole);
  }

  @ApiOperation({ summary: 'Забрать роль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('/user/de-role')
  removeRole(@Body() removeRole: RemoveRoleDto) {
    return this.rolesService.removeRoleToUser(removeRole);
  }
}