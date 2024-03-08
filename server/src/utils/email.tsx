import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import VerifyEmail from './email-templates/VerifyEmail';
import nodemailer from 'nodemailer';

export type EmailContent = {
  subject: string;
  body: string;
};

const transporter = nodemailer.createTransport({
  pool: true,
  service: 'hotmail',
  port: 2525,
  auth: {
    user: process.env.EMAIL_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1
})

export const sendEmail = async (emailContent: EmailContent, sendTo: string[], verificationCode: string) => {
  const renderedEmail = renderToStaticMarkup(<VerifyEmail verificationCode={verificationCode} />);

  const mailOptions = {
    from: `"TechnoTrades" <${process.env.EMAIL_EMAIL}>`,
    to: sendTo,
    html: renderedEmail,
    subject: emailContent.subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log('Email sent: ', info);
  });
};