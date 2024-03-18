import React from 'react';
import VerifyEmail from './email-templates/VerifyEmail';
import { sendEmail } from './mailSender';
import EmailChangeVerification from './email-templates/EmailChangeVerification';
import ForgotPasswordVerification from './email-templates/ForgotPasswordVerification';
import { MagicSignIn } from './email-templates/MagicLinkSignIn';


export const sendEmailVerificationMail = async ({ to, verificationCode }: { to: string; verificationCode: string }) => {
    await sendEmail({
        to,
        subject: 'Email Verification',
        template: <VerifyEmail verificationCode={verificationCode} />,
    });
};

export const sendEmailChangeVerificationMail = async ({ to, verificationCode }: { to: string; verificationCode: string }) => {
    await sendEmail({
        to,
        subject: 'Email Change Verification',
        template: <EmailChangeVerification verificationCode={verificationCode} />,
    });
};

export const sendForgotPasswordVerificationMail = async ({ to, verificationCode }: { to: string; verificationCode: string }) => {
    await sendEmail({
        to,
        subject: 'Reset your TechnoTrades password',
        template: <ForgotPasswordVerification verificationCode={verificationCode} />,
    });
};

export const sendMagicSignInLinkMail = async ({ to, magicLink }: { to: string; magicLink: string }) => {
    await sendEmail({
        to,
        subject: 'Magic SignIn Link',
        template: <MagicSignIn magicLink={magicLink} />,
    });
};