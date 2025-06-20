import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // e.g., your Gmail
      pass: process.env.EMAIL_PASS, // App password or real password (use .env)
    },
  });

  await transporter.sendMail({
    from: `"HospitalHub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
