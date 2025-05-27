import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ENVEnum } from 'src/common/enum/env.enum';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        JwtService,
        PrismaService,
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: ENVEnum) => {
              if (key === ENVEnum.JWT_SECRET) return 'test-secret';
              if (key === ENVEnum.JWT_EXPIRES_IN) return '3600s';
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
