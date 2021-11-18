import nodemailer from "nodemailer";
import fs from "fs";
import * as path from 'path';
import handlebars from 'handlebars'

// async..await is not allowed in global scope, must use a wrapper
// create reusable transporter object using the default SMTP transport
const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendMailWithHtml = async (subject: string, receiver: string, html: string) => {
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: receiver,
        subject,
        html
    };
    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
    });
};

export const prepareHtmlContent = (viewName: string, data: any) => {
    const filePath = path.join(__dirname, `../views/${viewName}.handlebars`)
    const html = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(html);
    return template(data);
}
