const nodemailer = require ('nodemailer');
const pug = require ('pug');
const juice = require ('juice');
const htmlToText = require ('html-to-text');
const util = require ('util');
const emailConfig = require ('../config/email');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, 
      pass: emailConfig.pass 
    }
});

const generateHTML = (file, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${file}.pug`, options);
    return juice(html);  
}

exports.send = async (options) => {
    const html = generateHTML(options.file, options);
    const text = htmlToText.fromString(html);
    let info = await transporter.sendMail({
        from: 'Uptask <no-reply@uptask.com>', // sender address
        to: options.user.email, // list of receivers
        subject: options.subject, // Subject line
        text,
        html  // html body
    }); 

    const sendEmail = util.promisify(info, transporter);
    return sendEmail.call(transporter)
}
