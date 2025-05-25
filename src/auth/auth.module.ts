import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
