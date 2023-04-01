import { Module } from '@nestjs/common';
import { TextBlockService } from './text-block.service';
import { TextBlockController } from './text-block.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TextBlock } from './entities/text-block.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([TextBlock]),
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
