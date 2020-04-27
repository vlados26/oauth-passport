import passport from 'passport';
import { google } from './keys';
import User from '../models/user-model';
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: google.clientID,
        clientSecret: google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, async (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        const currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            try {
                const newUserModel = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture
                });
                const newUser = await newUserModel.save();
                done(null, newUser);
            } catch (err) {
                console.log("Error while saving user in db with err: " + err);
            }

        }
    })
);