import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { BlogModule } from '../blog/blog.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { TagModule } from '@project/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    MailModule,
    BlogModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
