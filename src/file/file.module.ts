import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './entities/file.entity';
import { TextBlock } from 'src/text-block/entities/text-block.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([File, TextBlock]),
    MulterModule.register({
      dest: path.join(__dirname, '../..', 'static'),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secret_key',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
