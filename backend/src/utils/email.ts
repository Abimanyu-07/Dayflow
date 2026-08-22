import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_PORT === 465,
    auth: ENV.EMAIL_USER
      ? {
          user: ENV.EMAIL_USER,
          pass: ENV.EMAIL_PASSWORD,
        }
      : undefined,
  });

  static async sendEmail(to: string, subject: string, html: string) {
    if (!ENV.EMAIL_USER) {
      console.log(`[EMAIL STUB] To: ${to} | Subject: ${subject}`);
      return { success: true, mocked: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `Dayflow HRMS <${ENV.EMAIL_FROM}>`,
        to,
        subject,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('[EMAIL ERROR]', error);
      return { success: false, error };
    }
  }

  static async sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `${ENV.FRONTEND_URL}/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to Dayflow HRMS</h2>
        <p>Please verify your email address to activate your employee account.</p>
        <a href="${verifyUrl}" style="display:inline-block; padding:10px 20px; background:#4F46E5; color:#fff; text-decoration:none; border-radius:5px;">Verify Email</a>
        <p style="margin-top:20px; font-size:12px; color:#666;">Or copy this URL: ${verifyUrl}</p>
      </div>
    `;
    return this.sendEmail(to, 'Verify your Dayflow Account', html);
  }

  static async sendLeaveStatusEmail(to: string, status: string, remarks?: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Leave Application Update</h2>
        <p>Your leave request has been <strong>${status}</strong> by HR/Admin.</p>
        ${remarks ? `<p><strong>Comments:</strong> ${remarks}</p>` : ''}
        <p>Log in to Dayflow portal to view details.</p>
      </div>
    `;
    return this.sendEmail(to, `Dayflow: Leave Request ${status}`, html);
  }
}
