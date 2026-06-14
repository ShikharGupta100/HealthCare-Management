

const transporter = require("../config/nodemailer")

const sendEmail = async(to,subject,text)=>{
    const mailOptions = {
        from:process.env.EMAIL_USER,
        to:to,
        subject: subject,
        text: text
    }
    
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
