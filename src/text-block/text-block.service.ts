import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateTextBlockDto } from './dto/create-text-block.dto';
import { UpdateTextBlockDto } from './dto/update-text-block.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TextBlock } from './entities/text-block.entity';
import { Repository } from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TextBlockService {
  constructor(
    @InjectModel(TextBlock) private textBlockRepository: Repository<TextBlock>,
  ) {}

  async create(createTextBlockDto: CreateTextBlockDto) {
    const uniqueName: string = uuid();

    const newTextBlock = await this.textBlockRepository.create({
      uniqueName,
      ...createTextBlockDto,
    });

    return newTextBlock;
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

  async update(uniqueName: string, updateTextBlockDto: UpdateTextBlockDto) {
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

    await this.textBlockRepository.destroy({
      where: { uniqueName },
      force: true,
    });

    return;
  }
}
