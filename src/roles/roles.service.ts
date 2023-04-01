import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { AuthService } from 'src/auth/auth.service';
import { RemoveRoleDto } from './dto/remove-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: Repository<Role>,
    private authService: AuthService,
  ) {}

  // create role to table role
  async createRole(createRole: CreateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { value: createRole.value.toLocaleLowerCase() },
    });

    if (role) {
      throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
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

    return roles;
  }

  async getRoleByValue(value: string) {
    value = value.toLocaleLowerCase();

    const role = await this.roleRepository.findOne({ where: { value } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async updateRole(valueRole: string, updateRole: UpdateRoleDto) {
    valueRole = valueRole.toLocaleLowerCase();

    const role = await this.roleRepository.findOne({
      where: { value: valueRole },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const isRole = await this.roleRepository.findOne({
      where: { value: updateRole.value.toLocaleLowerCase() },
    });

    if (isRole) {
      throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
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
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.destroy({
      where: {
        value,
      },
      force: true,
    });

    return;
  }

  // set role and user to table UserRole
  async addRoleToUser(addRole: AddRoleDto) {
    const role = await this.getRoleByValue(addRole.value);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = await this.authService.getOneUser(addRole.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.$add('role', role.role_id);
    await user.save();

    const userRoles = await this.authService.getOneUser(addRole.user_id);

    return userRoles;
  }

  // delete role and user to table UserRole
  async removeRoleToUser(removeRole: RemoveRoleDto) {
    const role = await this.getRoleByValue(removeRole.value);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = await this.authService.getOneUser(removeRole.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.$remove('role', role.role_id);
    await user.save();

    const userRoles = await this.authService.getOneUser(removeRole.user_id);

    return userRoles;
  }
}
