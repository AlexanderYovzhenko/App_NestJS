import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TextBlockService } from './text-block.service';
import { CreateTextBlockDto } from './dto/create-text-block.dto';
import { UpdateTextBlockDto } from './dto/update-text-block.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/guards/role-auth.decorator';
import { RoleGuard } from 'src/guards/role.guard';

@ApiTags('Text Block')
@ApiBearerAuth()
@Controller('text-block')
export class TextBlockController {
  constructor(private readonly textBlockService: TextBlockService) {}

  @ApiOperation({ summary: 'Добавить текстовый блок' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() createTextBlockDto: CreateTextBlockDto) {
    return this.textBlockService.create(createTextBlockDto);
  }

  @ApiOperation({ summary: 'Получить все текстовые блоки' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  findAll() {
    return this.textBlockService.findAll();
  }

  @ApiOperation({ summary: 'Получить текстовый блок' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get(':uniqueName')
  findOne(@Param('uniqueName') uniqueName: string) {
    return this.textBlockService.findOne(uniqueName);
  }

  @ApiOperation({ summary: 'Получить текстовые блоки по группе' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('group/:group')
  findByGroup(@Param('group') group: string) {
    return this.textBlockService.findByGroup(group);
  }

  @ApiOperation({ summary: 'Обновить текстовый блок' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put(':uniqueName')
  update(
    @Param('uniqueName') uniqueName: string,
    @Body() updateTextBlockDto: UpdateTextBlockDto,
  ) {
    return this.textBlockService.update(uniqueName, updateTextBlockDto);
  }

  @ApiOperation({ summary: 'Удалить текстовый блок' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':uniqueName')
  remove(@Param('uniqueName') uniqueName: string) {
    return this.textBlockService.remove(uniqueName);
  }
}
