import nodemailer from 'nodemailer'

export const sendEmail = async (options: { email: any; subject: any; message: any; }) => {
    // 1) Create a transporter
    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "3f21625661d2b3",
          pass: "afffe85516b58d"
        }
      });

    // 2) Define the email options
    const mailOptions = {
        from: 'FirstName LastName <test@test.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};