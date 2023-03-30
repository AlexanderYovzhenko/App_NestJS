import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { AuthService } from 'src/auth/auth.service';
import { RemoveRoleDto } from './dto/remove-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: Repository<Role>,
    private authService: AuthService,
  ) {}

  async createRole(createRole: CreateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { value: createRole.value.toLocaleLowerCase() },
    });

    if (role) {
      throw new HttpException('Role already exists!', HttpStatus.BAD_REQUEST);
    }

    const { value, description } = createRole;

    const newRole = await this.roleRepository.create({
      value: value.toLocaleLowerCase(),
      description,
    });

    return newRole;
  }

  async getAllRole() {
    const roles = await this.roleRepository.findAll();

    if (!roles.length) {
      throw new HttpException('Роли не найдены', HttpStatus.NOT_FOUND);
    }

    return roles;
  }

  async getRoleByValue(value: string) {
    value = value.toLocaleLowerCase();

    const role = await this.roleRepository.findOne({ where: { value } });

    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async updateRole(valueRole: string, updateRole: UpdateRoleDto) {
    valueRole = valueRole.toLocaleLowerCase();

    const role = await this.roleRepository.findOne({
      where: { value: valueRole },
    });

    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
    }

    const isRole = await this.roleRepository.findOne({
      where: { value: updateRole.value.toLocaleLowerCase() },
    });

    if (isRole) {
      throw new HttpException('Роль уже существует', HttpStatus.BAD_REQUEST);
    }

    const { value, description } = updateRole;

    await this.roleRepository.update(
      { value: value.toLocaleLowerCase(), description },
      {
        where: { value: valueRole },
      },
    );

    const roleUpd = await this.roleRepository.findOne({
      where: { value: value.toLocaleLowerCase() },
    });

    return roleUpd;
  }

  async removeRole(value: string) {
    value = value.toLocaleLowerCase();

    const role = await this.roleRepository.findOne({ where: { value } });

    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
    }

    await this.roleRepository.destroy({
      where: {
        value,
      },
      force: true,
    });

    return;
  }

  async addRoleToUser(addRole: AddRoleDto) {
    const role = await this.getRoleByValue(addRole.value);

    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
    }

    const user = await this.authService.getOneUser(addRole.user_id);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await user.$add('role', role.role_id);
    await user.save();

    const userRoles = await this.authService.getOneUser(addRole.user_id);

    return userRoles;
  }

  async removeRoleToUser(removeRole: RemoveRoleDto) {
    const role = await this.getRoleByValue(removeRole.value);

    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
    }

    const user = await this.authService.getOneUser(removeRole.user_id);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    await user.$remove('role', role.role_id);
    await user.save();

    const userRoles = await this.authService.getOneUser(removeRole.user_id);

    return userRoles;
  }
}