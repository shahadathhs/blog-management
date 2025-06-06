import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ENVEnum } from 'src/common/enum/env.enum';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      // auth: {
      //   type: 'OAuth2',
      //   user: this.configService.get<string>(ENVEnum.MAIL_USER),
      //   clientId: this.configService.get<string>(ENVEnum.MAIL_CLIENT_ID),
      //   clientSecret: this.configService.get<string>(
      //     ENVEnum.MAIL_CLIENT_SECRET,
      //   ),
      //   refreshToken: this.configService.get<string>(
      //     ENVEnum.MAIL_REFRESH_TOKEN,
      //   ),
      // },
      auth: {
        user: this.configService.get<string>(ENVEnum.MAIL_USER),
        pass: this.configService.get<string>(ENVEnum.MAIL_APP_PASSWORD),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const verificationLink = `${this.configService.get<string>(ENVEnum.FRONTEND_EMAIL_VERIFY_URL)}?token=${token}`;

    const mailOptions = {
      from: `"No Reply" <${this.configService.get<string>(ENVEnum.MAIL_USER)}>`,
      to: email,
      subject: 'Email Verification',
      html: `
        <h3>Welcome!</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const resetLink = `${this.configService.get<string>(ENVEnum.FRONTEND_PASSWORD_RESET_URL)}?token=${token}`;

    const mailOptions = {
      from: `"No Reply" <${this.configService.get<string>(ENVEnum.MAIL_USER)}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <h3>Welcome!</h3>
        <p>Please reset your password by visiting the link below:</p>
        <a href="${resetLink}">Reset password</a>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
