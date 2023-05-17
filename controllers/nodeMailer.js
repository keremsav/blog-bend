let nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');


module.exports.SendVerificationMail = async (Email,verificationToken) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'krmsv516@gmail.com',
                pass: 'erwyvzgaqwupiqij'
            }
        });

        let mailOptions = {
            from: 'krmsv516@gmail.com',
            to: Email,
            subject: 'Email Verification',
            text: `Please click on the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
            html: `<p>Please click on the following link to verify your email: <a href="http://localhost:8000/verify/${verificationToken}">Verify Email</a></p>`,

        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
    } catch (err) {
        console.error('Error sending verification email:', err);

    }
}




module.exports.generateVerificationToken = () => {
    return uuidv4();
};



