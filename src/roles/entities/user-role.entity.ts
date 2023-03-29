import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { User } from 'src/auth/entities/user.entity';

@Table({ tableName: 'user_role', createdAt: false, updatedAt: false })
export class UserRole extends Model<UserRole> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  user_role_id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  role_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id: number;
}
