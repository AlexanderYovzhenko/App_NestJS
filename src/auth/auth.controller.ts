import { Controller, Post, Body, UseFilters, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/exception-filters/all-exceptions.filter';
import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';

@ApiTags('Login')
@UseFilters(AllExceptionsFilter)
@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Получить токен' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post()
  async checkAuthUser(@Body() checkUser: CheckUserDto) {
    const token = await this.authService.checkAuthUser(checkUser);

    return { token };
  }
}
