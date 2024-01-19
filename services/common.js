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
    token = req. cookies ['jwt'];
    }
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWFiODY1YjZkYjNhYTk1MjlmZTZlZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1Njg3MTY3fQ.XcwJcdliTcfHKkgSZDKlSxAJSwRimYZF8hcd_TaawxQ"
    return token;
    };