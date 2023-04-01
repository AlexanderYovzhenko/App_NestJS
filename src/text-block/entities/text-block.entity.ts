import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface TextBlockCreationAttrs {
  uniqueName: string;
  name: string;
  image?: string;
  text: string;
  group: string;
}

@Table({ tableName: 'text_block' })
export class TextBlock extends Model<TextBlock, TextBlockCreationAttrs> {
  @Column({ type: DataType.STRING, unique: true, primaryKey: true })
  uniqueName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.STRING, allowNull: false })
  group: string;
}
