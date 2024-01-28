const passport = require("passport")
const nodemailer = require("nodemailer");

//email
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "senabhinav542@gmail.com", // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

exports.isAuth = (req, res, done) => {   //this is function middleware which check is req.user exist or not
  return passport.authenticate("jwt")
}

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role }
}

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWQ3MzAyMTM5ODQxOTM4MWUwNTFkOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1OTM1MDUwfQ.4zovWoWSn5HATGkebI67uAfYhy_gvwpMSiUhZI0R5X4; Path=/; Expires=Mon, 22 Jan 2024 15:50:50 GMT; HttpOnly"
  return token;
};

exports.sendMail = async function ({ to, subject, text, html }) {
  
  console.log("to:-  ", { to });
  let info = await transporter.sendMail({
    from: '"E-commerce" <senabhinav542@gmail.com>', // sender address
    to,
    subject,
    text,
    html,
  })
  console.log("info:- ", info)
}  