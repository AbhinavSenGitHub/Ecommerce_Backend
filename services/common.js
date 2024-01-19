const passport = require("passport")

exports.isAuth = (req, res, done) => {   //this is function middleware which check is req.user exist or not
   return passport.authenticate("jwt")
  }

exports.sanitizeUser = (user) => {
    return {id: user.id, role:user.role}
  }