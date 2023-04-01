import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateTextBlockDto } from './dto/create-text-block.dto';
import { UpdateTextBlockDto } from './dto/update-text-block.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TextBlock } from './entities/text-block.entity';
import { Repository } from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';
import { FileService } from 'src/file/file.service';

@Injectable()
export class TextBlockService {
  constructor(
    @InjectModel(TextBlock) private textBlockRepository: Repository<TextBlock>,
    private fileService: FileService,
  ) {}

  async create(
    createTextBlockDto: CreateTextBlockDto,
    file: { originalname: string; filename: string },
  ) {
    const uniqueName: string = uuid();

    const newTextBlock = await this.textBlockRepository.create({
      uniqueName,
      ...createTextBlockDto,
    });

    await this.fileService.createFile(
      file,
      'textBlock',
      newTextBlock.uniqueName,
    );

    const textBlock = await this.textBlockRepository.findOne({
      where: { uniqueName },
      include: { all: true },
    });

    return textBlock;
  }

  async findAll() {
    const textBlocks = await this.textBlockRepository.findAll({
      include: { all: true },
    });

    return textBlocks;
  }

  async findOne(uniqueName: string) {
    const textBlock = await this.textBlockRepository.findOne({
      where: { uniqueName },
      include: { all: true },
    });

    if (!textBlock) {
      throw new HttpException('Text block not found', HttpStatus.NOT_FOUND);
    }

    return textBlock;
  }

  async findByGroup(group: string) {
    const textBlocks = await this.textBlockRepository.findAll({
      where: { group },
      include: { all: true },
    });

    return textBlocks;
  }

  async update(
    uniqueName: string,
    updateTextBlockDto: UpdateTextBlockDto,
    file: { originalname: string; filename: string },
  ) {
    const isTextBlock = await this.textBlockRepository.findOne({
      where: { uniqueName },
    });

    if (!isTextBlock) {
      throw new HttpException('Text block not found', HttpStatus.NOT_FOUND);
    }

    const updateTextBlock = await this.textBlockRepository.update(
      { uniqueName, ...updateTextBlockDto },
      { where: { uniqueName } },
    );

    if (!updateTextBlock) {
      throw new HttpException(
        'Text block is not updated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (file) {
      await this.fileService.updateFile(file, 'textBlock', uniqueName);
    }

    const textBlock = await this.textBlockRepository.findOne({
      where: { uniqueName },
      include: { all: true },
    });

    return textBlock;
  }

  async remove(uniqueName: string) {
    const isTextBlock = await this.textBlockRepository.findOne({
      where: { uniqueName },
    });

    if (!isTextBlock) {
      throw new HttpException('Text block not found', HttpStatus.NOT_FOUND);
    }

    await this.fileService.deleteFile(uniqueName);

    await this.textBlockRepository.destroy({
      where: { uniqueName },
      force: true,
    });

    return;
  }
}
