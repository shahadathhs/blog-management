import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { ENVEnum } from 'src/common/enum/env.enum';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtStrategy,
        JwtService,
        MailService,
        PrismaService,
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
