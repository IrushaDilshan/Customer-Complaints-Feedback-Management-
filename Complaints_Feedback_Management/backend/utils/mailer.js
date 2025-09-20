const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.SMTP_PORT || 2525),
    auth: {
        user: process.env.SMTP_USER || "user",
        pass: process.env.SMTP_PASS || "pass",
    },
});

async function sendMail({ to, subject, html }) {
    if (!to) return;
    await transporter.sendMail({ from: process.env.MAIL_FROM || "no-reply@nitf.lk", to, subject, html });
}

module.exports = { sendMail };
