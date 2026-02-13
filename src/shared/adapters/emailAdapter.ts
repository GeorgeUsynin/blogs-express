import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_BLOG_PLATFORM,
        pass: process.env.EMAIL_BLOG_PLATFORM_PASSWORD,
    },
});

export const emailAdapter = {
    sendEmail(email: string, subject: string, message: string) {
        transporter
            .sendMail({
                from: `Blog Platform <${process.env.EMAIL_BLOG_PLATFORM}>`,
                to: email,
                subject: subject,
                html: message,
            })
            .catch(err => {
                console.error(err);
                throw new Error('Email adapter send error');
            });
    },
};
