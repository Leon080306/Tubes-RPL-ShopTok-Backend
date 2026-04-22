import nodemailer from "nodemailer";

export async function createTransporter() {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    return { transporter, previewUser: testAccount.user };
}