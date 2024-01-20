const express = require("express")
const server = express()
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const cors = require("cors")

server.use(express.json())  // to parse req.body

const productsRouter = require("./routes/Products")
const categoriesRouter = require("./routes/Categories")
const brandsRouter = require("./routes/Brands")
const usersRouter = require("./routes/Users")
const authRouter = require("./routes/Auth")
const cartRouter = require("./routes/Cart")
const orderRouter = require("./routes/Order")
const session = require('express-session')
const passport = require('passport')
const { User } = require("./model/User")
const SQLiteStore = require('connect-sqlite3')(session)
const LocalStrategy = require('passport-local').Strategy
const crypto = require("crypto")
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const cookieParser = require("cookie-parser");
const SECRET_KEY = "SECRET_KEY"
const token = jwt.sign({ foo: 'bar' }, SECRET_KEY);

//Passport jwt
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY

// middleware
server.use(express.static('build'))
server.use(cookieParser())
server.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
}))
server.use(passport.authenticate('session'))
server.use(cors({
  exposedHeaders: ['X-Total-Count']
}))
server.use('/products', isAuth(), productsRouter.router)   //isAuth is a middleware which check is req.user exist or not
server.use('/categories', isAuth(), categoriesRouter.router)
server.use('/brands', isAuth(), brandsRouter.router)
server.use("/users", isAuth(), usersRouter.router)
server.use("/auth", authRouter.router)
server.use("/cart", isAuth(), cartRouter.router)
server.use("/orders", isAuth(), orderRouter.router)

// passport Strategies
passport.use('local', new LocalStrategy({usernameField: 'email'}, async function (email, password, done) {
  try {
    const user = await User.findOne({ email: email }).exec()
    if (!user) {
      done(null, false, { message: "no such user with this email" })
    }
    crypto.pbkdf2(
      password,
      user.salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false, { message: "Invalid Credentials" })
        }
        const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
        done(null, {id:user.id, role:user.role})   //this line call the serialization function
      })

  } catch (err) {
    done(err)
  }
}
))
// jwt
passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
  console.log({jwt_payload})
  try {
    const user = await User.findById(jwt_payload.id)
    if (user) {
      return done(null, sanitizeUser(user));
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false)
  }
}));
// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});

// this creates session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//connection for database
main().catch(err => console.error(err))
async function main() {
  await mongoose.connect("mongodb://localhost:27017/ecommerce");
  console.log("Connected to the database");
}

server.get("/", (req, res) => {
  res.json({ status: "success" })
})



server.listen(8080, () => {
  console.log("server stated on port 8080")
})
