import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';

interface ProfileCreationAttrs {
  firstName: string;
  lastName: string;
  phone: number;
  city: string;
  user_id: number;
}

@Table({ tableName: 'profile' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  readonly profile_id: number;

  @ApiProperty({ example: 'Александр', description: 'Имя' })
  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @ApiProperty({ example: 'Александров', description: 'Фамилия' })
  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @ApiProperty({ example: '375259339393', description: 'Номер телефона' })
  @Column({ type: DataType.BIGINT, unique: true, allowNull: false })
  phone: number;

  @ApiProperty({ example: 'Минск', description: 'Город' })
  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @ApiProperty({ example: 'true', description: 'Забанен или нет' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({ example: 'Хулиганство', description: 'Причина блокировки' })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  @ForeignKey(() => User)
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
