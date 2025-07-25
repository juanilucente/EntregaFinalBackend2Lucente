import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from '../utils/bcrypt.js'
import UserModel from '../models/User.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    try {
      const { first_name, last_name, age } = req.body
      const userExists = await UserModel.findOne({ email: username })
      if (userExists) return done(null, false)
      const hash = createHash(password)
      const newUser = await UserModel.create({
        first_name,
        last_name,
        age,
        email: username,
        password: hash
      })
      return done(null, newUser)
    } catch (err) {
      return done(err)
    }
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ email: username })
      if (!user || !isValidPassword(user, password)) return done(null, false)
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
  })
}

export default initializePassport