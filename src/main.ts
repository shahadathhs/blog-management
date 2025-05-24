import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // * Swagger config
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API docs for your blog backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = parseInt(configService.get<string>('PORT') ?? '3000', 10);
  await app.listen(port);
}

void bootstrap();
