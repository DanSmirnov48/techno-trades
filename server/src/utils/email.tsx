import React from 'react';
import nodemailer from 'nodemailer';
import { renderToStaticMarkup } from 'react-dom/server';
import VerifyEmail from './email-templates/VerifyEmail';
import EmailChangeVerification from './email-templates/EmailChangeVerification';
import ForgotPasswordVerification from './email-templates/ForgotPasswordVerification';
import MagicSignIn from './email-templates/MagicLinkSignIn';

export type EmailVerificationContentProps = {
  subject: string;
  sendTo: string;
  verificationCode: string;
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

export const sendEmailVerificationMail = async ({ subject, sendTo, verificationCode }: EmailVerificationContentProps) => {
  const renderedEmail = renderToStaticMarkup(<VerifyEmail verificationCode={verificationCode} />);

  const mailOptions = {
    from: `"TechnoTrades" <${process.env.EMAIL_EMAIL}>`,
    to: sendTo,
    html: renderedEmail,
    subject: subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log('Email sent: ', info);
  });
};

export const sendEmailChangeVerificationMail = async ({ subject, sendTo, verificationCode }: EmailVerificationContentProps) => {
  const renderedEmail = renderToStaticMarkup(<EmailChangeVerification verificationCode={verificationCode} />);

  const mailOptions = {
    from: `"TechnoTrades" <${process.env.EMAIL_EMAIL}>`,
    to: sendTo,
    html: renderedEmail,
    subject: subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log('Email sent: ', info);
  });
};

export const sendForgotPasswordVerificationMail = async ({ subject, sendTo, verificationCode }: EmailVerificationContentProps) => {
  const renderedEmail = renderToStaticMarkup(<ForgotPasswordVerification verificationCode={verificationCode} />);

  const mailOptions = {
    from: `"TechnoTrades" <${process.env.EMAIL_EMAIL}>`,
    to: sendTo,
    html: renderedEmail,
    subject: subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log('Email sent: ', info);
  });
};

export const sendMagicSignInLinkMail = async ({ subject, sendTo, verificationCode }: EmailVerificationContentProps) => {
  const renderedEmail = renderToStaticMarkup(<MagicSignIn magicLink={verificationCode} />);

  const mailOptions = {
    from: `"TechnoTrades" <${process.env.EMAIL_EMAIL}>`,
    to: sendTo,
    html: renderedEmail,
    subject: subject,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);

    console.log('Email sent: ', info);
  });
};