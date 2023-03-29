import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeBanUserDto {
  @ApiProperty({ example: '1', description: 'Id пользователя' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'user_id: должен быть номером' })
  readonly user_id: number;
}
