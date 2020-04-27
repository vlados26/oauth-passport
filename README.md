# Oauth with Passport GoogleStrategy Oauth2.0

Create db in:
https://mlab.com/databases/oauth/collections/users
Create Google+ OAuth 2.0 key
http://www.passportjs.org/packages/passport-google-oauth2/
Implement Passport.js GoogleStrategy:
http://www.passportjs.org/packages/passport-google-oauth2/

Loggin flow in current app:
1. Press Gooogle+ button
2. 
```js 
// app.js
app.use('/auth', authRoutes);
```
3. 
```js
// auth-routes.js
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));
```
4. 
```js
// passport-setup.js 
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
```
5. 
```
// auth-routes.js
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});
```
6. 
```
// profile-routes.js
router.get('/', authCheck, (req, res) => {
    res.render('profile', {
        user: req.user
    })
});
```
7. Logged In
