import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTextBlockDto {
  @ApiProperty({ example: 'News IT', description: 'Название' })
  @IsNotEmpty()
  @IsString({ message: 'name: должен быть строкой' })
  @Length(2, 64, { message: 'Не меньше 2 и не больше 64' })
  readonly name: string;

  @ApiProperty({
    example: 'Текст рыба текст рыба текст рыба',
    description: 'Текст',
  })
  @IsNotEmpty()
  @IsString({ message: 'text: должен быть строкой' })
  readonly text: string;

  @ApiProperty({ example: 'main-page', description: 'Группа' })
  @IsNotEmpty()
  @IsString({ message: 'group: должен быть строкой' })
  readonly group: string;
}
