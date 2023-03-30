import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('App_NestJS')
  .setDescription('Api for texts')
  .setVersion('1.0.0')
  .addBearerAuth()
  .addTag('Server NestJS')
  .build();
