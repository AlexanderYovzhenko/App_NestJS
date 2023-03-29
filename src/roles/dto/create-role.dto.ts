import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Уникальное значение роли' })
  @IsNotEmpty()
  @IsString({ message: 'value: должен быть строкой' })
  readonly value: string;

  @ApiProperty({ example: 'Администратор', description: 'Администратор сайта' })
  @IsNotEmpty()
  @IsString({ message: 'description: должен быть строкой' })
  readonly description: string;
}
