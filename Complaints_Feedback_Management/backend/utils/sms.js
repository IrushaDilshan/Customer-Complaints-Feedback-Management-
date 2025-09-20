let client = null;
try {
    const twilio = require("twilio");
    if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
        client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }
} catch { }

async function sendSMS(to, body) {
    if (!client || !to) return;
    await client.messages.create({
        to,
        from: process.env.TWILIO_FROM || "+15005550006",
        body,
    });
}

module.exports = { sendSMS };
