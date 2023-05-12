import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAdminInvite(user: User, token: string): Promise<void> {
    const url = `${process.env.APP_URL}/auth/complete-registration?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'You was invited to Healthy Nutrition',
      template: './invite',
      context: { url },
    });
  }
}
