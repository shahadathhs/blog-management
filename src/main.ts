import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { ENVEnum } from './common/enum/env.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // * Swagger config
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API docs for blog management backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(configService.get<string>(ENVEnum.PORT) ?? '3000', 10);
  await app.listen(port);
}

void bootstrap();
