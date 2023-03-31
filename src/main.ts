import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/env-variables';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from './docs/doc-config';
import { ValidationPipe } from '@nestjs/common/pipes';
import { loggerWinston } from './utils/logger-winston.config';
import { LoggingInterceptor } from './utils/logger.middleware';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: loggerWinston,
    });

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.enableCors();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        // forbidNonWhitelisted: true,
        // forbidUnknownValues: true,
      }),
    );

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(PORT, '0.0.0.0', () => {
      console.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('\n', error.message, '\n\n', error);
  }
}

bootstrap();
