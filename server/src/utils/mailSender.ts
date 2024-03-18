import nodemailer from 'nodemailer';
import { renderToStaticMarkup } from 'react-dom/server';

interface EmailProps {
    to: string;
    subject: string;
    template: React.ReactNode;
    data?: any;
}

const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
        user: process.env.EMAIL_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1,
});

export const sendEmail = async ({ to, subject, template, data }: EmailProps) => {
    const renderedEmail = renderToStaticMarkup(template, data);

    const mailOptions = {
        from: `"TechnoTrades" <${process.env.EMAIL_EMAIL}>`,
        to,
        html: renderedEmail,
        subject,
    };

    return transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.log(error);
            return;
        }

        console.log('Email sent: ', info);
    });
};