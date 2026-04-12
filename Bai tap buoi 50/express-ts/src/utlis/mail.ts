import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

let mailTransposter = null;
if (!mailTransposter) {
  mailTransposter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT!,
    secure: +process.env.SMTP_PORT! === 465, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}
// Create a transporter using SMTP

export const sendMail = async (
  to: string,
  subject: string,
  message: string,
) => {
  try {
    const info = await mailTransposter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html: message,
    });
    return info;
  } catch (error) {
    console.error("MAIL ERROR:", error);
    throw error;
  }
};

export const sendMailTemplate = async (
  to: string,
  subject: string,
  template: string,
  context = {},
) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "mail",
    `${template}.ejs`,
  );
  const html = await ejs.renderFile(templatePath, context);
  return sendMail(to, subject, html);
};
