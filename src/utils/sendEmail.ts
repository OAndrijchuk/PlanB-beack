// import * as dotenv from 'dotenv';
// import nodemailer from 'nodemailer';

// dotenv.config();

// const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

// interface MailOpyions {
//   userEmail: string;
//   title: string;
//   bodyContent: string;
// }

// const sendEmail = ({ userEmail, title, bodyContent }: MailOpyions) => {
//   const nodemailerConfig = {
//     host: 'smtp.ukr.net',
//     port: 465,
//     secure: true,
//     auth: {
//       user: UKR_NET_EMAIL,
//       pass: UKR_NET_PASSWORD,
//     },
//   };

//   const transport = nodemailer.createTransport(nodemailerConfig);

//   const email = {
//     from: UKR_NET_EMAIL,
//     to: userEmail,
//     subject: title,
//     html: bodyContent,
//   };

//   transport
//     .sendMail(email)
//     .then(() => console.log('Email send success!'))
//     .catch(err => console.log(err.massage));
// };

// export default sendEmail;
