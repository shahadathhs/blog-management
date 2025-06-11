import { Injectable, NestMiddleware } from "@nestjs/common";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "[Unable to stringify]";
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // * Capture request details
    const { method, originalUrl, headers } = req;
    const body = req.body as unknown;
    const cookies = req.cookies as unknown;

    const ip = req.ip || req.socket?.remoteAddress || "unknown";

    console.group(chalk.bgGreen.black.bold("📥 Incoming Request"));

    console.log(`${chalk.cyan("🔗 URL:")} ${chalk.white(originalUrl)}`);
    console.log(`${chalk.yellow("📬 Method:")} ${chalk.white(method)}`);
    console.log(`${chalk.magenta("🌐 IP:")} ${chalk.white(ip)}`);
    console.log(
      `${chalk.green("🎯 Headers:")} ${chalk.gray(safeStringify(headers))}`,
    );
    console.log(`${chalk.blue("📦 Body:")} ${chalk.gray(safeStringify(body))}`);
    console.log(
      `${chalk.red("🍪 Cookies:")} ${chalk.gray(safeStringify(cookies))}`,
    );

    console.groupEnd();

    // * Capture response body
    const oldJson = res.json.bind(res);
    res.json = (data: any) => {
      const duration = Date.now() - startTime;

      console.group(chalk.bgCyan.white.bold("📤 Outgoing Response"));
      console.log(`${chalk.green("📨 Status Code:")} ${res.statusCode}`);
      console.log(`${chalk.blue("🕒 Response Time:")} ${duration} ms`);
      console.log(
        `${chalk.cyan("📦 Response Body:")} ${chalk.gray(JSON.stringify(data, null, 2))}`,
      );
      console.groupEnd();
      console.log(chalk.gray("-".repeat(60)));

      return oldJson(data);
    };

    next();
  }
}
