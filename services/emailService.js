import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Class-based smtp service. Predevined only for Gmail email service.
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // ✅ Method for sending emails
  async sendMail({ to, subject, text, html }) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      });

      console.log(`✅ Email sent to ${to}: ${info.messageId}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Email sending failed:`, error.message);
      return { success: false, error: error.message };
    }
  }
}

export default EmailService;
