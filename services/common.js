const passport = require("passport")

exports.isAuth = (req, res, done) => {   //this is function middleware which check is req.user exist or not
   return passport.authenticate("jwt")
  }

exports.sanitizeUser = (user) => {
    return {id: user.id, role:user.role}
  }

exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies)
    {
    token = req.cookies['jwt'];
    }
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWQ3MzAyMTM5ODQxOTM4MWUwNTFkOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1OTM1MDUwfQ.4zovWoWSn5HATGkebI67uAfYhy_gvwpMSiUhZI0R5X4; Path=/; Expires=Mon, 22 Jan 2024 15:50:50 GMT; HttpOnly"
    return token;
    };