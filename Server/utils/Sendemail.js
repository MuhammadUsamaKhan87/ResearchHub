import nodemailer from 'nodemailer';

// Send verification email
const sendVerificationEmail = async (email, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #064E3B;">Welcome to Our Platform!</h2>
                <p style="font-size: 16px; color: #333;">
                    Thank you for signing up! Please verify your email address to activate your account.
                </p>
                <h3 style="color: #064E3B;">Your Verification Code:</h3>
                <h2 style="font-size: 24px; color: #064E3B; font-weight: bold;">${verificationCode}</h2>
                <p style="font-size: 16px; color: #333;">
                    If you did not sign up for this account, you can safely ignore this email.
                </p>
                <p style="font-size: 16px; color: #333;">Best Regards,<br>Your Company Team</p>
            </div>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (email, userId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetLink = `http://localhost:3000/reset-password/${userId}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #064E3B;">Password Reset Request</h2>
                <p style="font-size: 16px; color: #333;">
                    You have requested to reset your password. Please click the link below to reset your password:
                </p>
                <p style="font-size: 16px; color: #064E3B;">
                    <a href="${resetLink}" style="text-decoration: none; color: #ffffff; background-color: #064E3B; padding: 10px 15px; border-radius: 5px;">Reset Password</a>
                </p>
                <p style="font-size: 16px; color: #333;">
                    If you did not request this, please ignore this email.
                </p>
                <p style="font-size: 16px; color: #333;">Best Regards,<br>Your Company Team</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export { sendVerificationEmail, sendResetPasswordEmail };
