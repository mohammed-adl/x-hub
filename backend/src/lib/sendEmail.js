import nodemailer from "nodemailer";

let transporter;

async function getTransporter() {
  if (!transporter) {
    if (process.env.NODE_ENV === "development") {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  return transporter;
}

export async function sendEmailPasscode({ email, passcode }) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: `"X" <${process.env.EMAIL_USER || "no-reply@x.com"}>`,
    to: email,
    subject: "Your X Password Reset Code",
    html: `
      <p>Hello,</p>
      <p>Here is your password reset code:</p>
      <h2 style="color: #1d9bf0;">${passcode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
      <br />
      <p>— X Team</p>
    `,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } else {
    console.log("Message sent:", info.messageId);
  }
}
