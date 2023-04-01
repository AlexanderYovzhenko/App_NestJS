import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { File } from './entities/file.entity';
import { unlink } from 'fs/promises';

@Injectable()
export class FileService {
  constructor(@InjectModel(File) private fileRepository: Repository<File>) {}

  async getFile(res: Response, fileName: string) {
    const filePath = path.join(__dirname, '../..', 'static', fileName);

    const isFile = fs.existsSync(filePath);

    if (!isFile) {
      throw new NotFoundException('File not found');
    }

    return res.download(filePath);
  }

  async deleteUnusedFiles() {
    const timeHourAgo = new Date().getTime() - 1000 * 60 * 60;

    const unusedFiles = await this.fileRepository.findAll({
      where: {
        [Op.or]: [
          { essenceId: null, essenceTable: null },
          { createdAt: { [Op.lt]: timeHourAgo } },
        ],
      },
    });

    unusedFiles.forEach(async (file) => {
      await unlink(
        path.join(__dirname, '../..', 'static', file.dataValues.fileName),
      );
    });

    await this.fileRepository.destroy({
      where: {
        [Op.or]: [
          { essenceId: null, essenceTable: null },
          { createdAt: { [Op.lt]: timeHourAgo } },
        ],
      },
      force: true,
    });

    return;
  }

  async createFile(
    { originalname, filename },
    essenceTable: string,
    uniqueName: string | number,
  ) {
    await this.fileRepository.create({
      originalName: originalname,
      fileName: filename,
      essenceTable: essenceTable,
      essenceId: uniqueName.toString(),
      createdAt: new Date().getTime(),
    });
  }

  async updateFile(
    { originalname, filename },
    essenceTable: string,
    uniqueName: string | number,
  ) {
    await this.fileRepository.update(
      {
        essenceTable: null,
        essenceId: null,
      },
      { where: { essenceId: uniqueName } },
    );

    await this.fileRepository.create({
      originalName: originalname,
      fileName: filename,
      essenceTable: essenceTable,
      essenceId: uniqueName.toString(),
      createdAt: new Date().getTime(),
    });
  }

  async deleteFile(uniqueName: string | number) {
    uniqueName = uniqueName.toString();

    await this.fileRepository.update(
      {
        essenceTable: null,
        essenceId: null,
      },
      { where: { essenceId: uniqueName } },
    );
  }
}
