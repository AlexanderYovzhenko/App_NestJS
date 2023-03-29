import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RemoveRoleDto {
  @ApiProperty({ example: '1', description: 'Id пользователя' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'user_id: должен быть номером' })
  readonly user_id: number;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Удалить эту роль для пользователя',
  })
  @IsNotEmpty()
  @IsString({ message: 'value: должен быть строкой' })
  readonly value: string;
}
