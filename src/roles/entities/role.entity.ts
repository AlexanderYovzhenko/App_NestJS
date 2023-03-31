import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from './user-role.entity';

interface RoleCreationAttrs {
  value: string;
  description: string;
}

@Table({ tableName: 'role', updatedAt: false })
export class Role extends Model<Role, RoleCreationAttrs> {
  // @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  role_id: number;

  // @ApiProperty({ example: 'ADMIN', description: 'Уникальное Значение роли ' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  // @ApiProperty({ example: 'Администратор', description: 'Описание роли' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
