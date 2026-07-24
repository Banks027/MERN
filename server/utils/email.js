const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail({
    to,
    displayName,
    verificationCode,
}) {

    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Verify your KnightMarketplace account",

        html: `
        <div style="font-family:Arial,sans-serif;padding:30px">
            <h2>Welcome to KnightMarketplace!</h2>

            <p>Hello ${displayName},</p>

            <p>Your verification code is:</p>

            <h1
                style="
                    letter-spacing:8px;
                    font-size:40px;
                    color:#6b46c1;
                "
            >
                ${verificationCode}
            </h1>

            <p>
                This code expires in 10 minutes.
            </p>

            <p>
                If you didn't create this account,
                you can safely ignore this email.
            </p>
        </div>
        `
    });

    if (error) {
        throw error;
    }

    return data;
}

module.exports = {
    sendVerificationEmail,
};