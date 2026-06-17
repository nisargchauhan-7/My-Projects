const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: "sbdehas@gmail.com",
        pass: "wuir tgiy fncz wesb"
    }

});

function sendEmail(to, subject, text)
{
    transporter.sendMail(
    {
        from: "sbdehas@gmail.com",
        to,
        subject,
        text
    },
    (err, info) => {

        if(err)
        {
            console.log("EMAIL ERROR:", err);
        }
        else
        {
            console.log("EMAIL SENT:", info.response);
        }

    });
}

module.exports = sendEmail;