import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { APP_CONFIG, IConfig } from '@/config/types';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const config = app.get<IConfig>(APP_CONFIG);
  if (config.logs) {
    app.useLogger(config.logs);
  }

  logger.log(`Ready`);
}
bootstrap();
