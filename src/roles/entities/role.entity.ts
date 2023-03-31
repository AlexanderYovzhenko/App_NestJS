import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from './user-role.entity';

interface RoleCreationAttrs {
  value: string;
  description: string;
}

@Table({ tableName: 'role', updatedAt: false })
export class Role extends Model<Role, RoleCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  role_id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
