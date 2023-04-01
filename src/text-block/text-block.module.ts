import { Module } from '@nestjs/common';
import { TextBlockService } from './text-block.service';
import { TextBlockController } from './text-block.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TextBlock } from './entities/text-block.entity';
import { JwtModule } from '@nestjs/jwt';
import { File } from 'src/file/entities/file.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    FileModule,
    SequelizeModule.forFeature([TextBlock, File]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secret_key',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [TextBlockController],
  providers: [TextBlockService],
})
export class TextBlockModule {}
