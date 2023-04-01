import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { TextBlock } from 'src/text-block/entities/text-block.entity';

interface FileCreationAttrs {
  createdAt: number;
  originalName: string;
  fileName: string;
  essenceTable: string;
  essenceId: string;
}

@Table({ tableName: 'file', updatedAt: false })
export class File extends Model<File, FileCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  readonly file_id: number;

  @ApiProperty({ example: '1680377545049', description: 'Отметка времени' })
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  createdAt: number;

  @ApiProperty({
    example: 'FlexPanelGallery.jpg',
    description: 'Оригинальное название файла',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  originalName: string;

  @ApiProperty({
    example: 'FlexPanelGallery-4e6a.jpg',
    description: 'Название файла',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  fileName: string;

  @ApiProperty({ example: 'textBlock', description: 'Название таблицы' })
  @Column({ type: DataType.STRING, allowNull: true })
  essenceTable: string;

  @ApiProperty({
    example: '6d336dff-53fd-4e88-96f8-c11169e3879f',
    description: 'Id сущности',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  @ForeignKey(() => TextBlock)
  essenceId: string;

  @BelongsTo(() => TextBlock)
  textBlock: TextBlock;
}
