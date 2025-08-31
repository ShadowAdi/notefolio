import nodemailer from "nodemailer";
const GOOGLE_PASS = process.env.GOOGLE_PASS;
if (!GOOGLE_PASS) {
  console.error(`Failed to get google pass for sening mail`);
  throw new Error(`Failed to get google pass for sening mail`);
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shadowshukla76@gmail.com",
    pass: GOOGLE_PASS,
  },
});

export const sendVerificationEmail = async (
  to: string,
  verificationCode: string
) => {
  await transporter.sendMail({
    from: '"Aditya Shukla" <shadowshukla76@gmail.com>',
    to: to,
    subject: "Verify your email",
    html: `
    <h1>Email Verification</h1>
    <p>Copy the code below to verify your email:</p>
    <strong>Code: ${verificationCode}</strong>
  `,
  });
};
