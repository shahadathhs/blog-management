import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a welcome JSON with message, description, docs, author, and timestamp', () => {
      const result = appController.getWelcome();

      expect(result).toHaveProperty(
        'message',
        '👋 Welcome to the Blog Management API!',
      );
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty(
        'docs',
        'Visit /docs for Swagger API documentation.',
      );
      expect(result).toHaveProperty('author', 'https://github.com/shahadathhs');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });
});
