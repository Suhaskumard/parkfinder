import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const getTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS (or EMAIL_*).",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: Boolean(process.env.SMTP_SECURE) || port === 465,
    auth: { user, pass },
  });
};

export const sendPasswordResetEmail = async ({ to, resetToken }) => {
  const transporter = getTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  await transporter.verify();
  await transporter.sendMail({
    from:
      process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER,
    to,
    subject: "Reset your SmartPark password",
    html: `
      <p>Hello,</p>
      <p>We received a request to reset your SmartPark password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });

  return resetLink;
};
