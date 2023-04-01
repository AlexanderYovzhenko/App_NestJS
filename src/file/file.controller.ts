import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  HttpStatus,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/guards/role-auth.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @ApiOperation({ summary: 'Получить файл' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get(':fileName')
  async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    return await this.fileService.getFile(res, fileName);
  }

  @ApiOperation({ summary: 'Удалить неиспользуемые файлы' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteUnusedFiles() {
    return await this.fileService.deleteUnusedFiles();
  }
}
