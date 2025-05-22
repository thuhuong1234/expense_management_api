const nodemailer = require("nodemailer");

const sendEmail = async (email, html) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false, // ⚠️ Chỉ dùng để test trong môi trường không tin cậy
    },
  });
  return transporter.sendMail({
    from: "'RoomPay' <no-relply@quanlychitieu.com>",
    to: email,
    subject: "Forgot password",
    html: html,
  });
};

module.exports = sendEmail;
