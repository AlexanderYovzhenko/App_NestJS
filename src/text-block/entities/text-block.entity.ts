import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { File } from 'src/file/entities/file.entity';

interface TextBlockCreationAttrs {
  uniqueName: string;
  name: string;
  text: string;
  group: string;
}

@Table({ tableName: 'text_block', timestamps: false })
export class TextBlock extends Model<TextBlock, TextBlockCreationAttrs> {
  @Column({ type: DataType.STRING, unique: true, primaryKey: true })
  uniqueName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.STRING, allowNull: false })
  group: string;

  @HasMany(() => File, { onUpdate: 'CASCADE' })
  images: File[];
}
