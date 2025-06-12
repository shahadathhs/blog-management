import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import chalk from 'chalk';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  // * Expose Prisma utils (enums, filters, etc.)
  readonly utils = Prisma;

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
      ],
    });

    this.$on('query', (e: Prisma.QueryEvent) => {
      console.group(chalk.bgBlue.white.bold('📦 Prisma Query info'));
      console.info(
        `${chalk.yellow('🕒 Timestamp:')} ${chalk.white(e.timestamp)}`,
      );
      console.info(`${chalk.green('📜 Query:')} ${chalk.white(e.query)}`);
      console.info(`${chalk.magenta('📦 Params:')} ${chalk.white(e.params)}`);
      console.info(
        `${chalk.cyan('⚡ Duration:')} ${chalk.white(`${e.duration} ms`)}`,
      );
      console.groupEnd();
      console.info(chalk.gray('-'.repeat(60)));
    });

    this.$on('error', (e: Prisma.LogEvent) => {
      console.group(chalk.bgRed.white.bold('❌ Prisma Error'));
      console.error(e);
      console.groupEnd();
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
