import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty({ example: '1', description: 'Id пользователя' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'user_id: должен быть номером' })
  readonly user_id: number;

  @ApiProperty({ example: 'Хулиганство', description: 'Причина блокировки' })
  @IsNotEmpty()
  @IsString({ message: 'banReason: должен быть строкой' })
  readonly banReason: string;
}
