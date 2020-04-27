# Oauth with Passport GoogleStrategy Oauth2.0

Create db in: https://mlab.com/databases/oauth/collections/users <br>
Create Google+ OAuth 2.0 key: http://www.passportjs.org/packages/passport-google-oauth2/ <br>
Implement Passport.js GoogleStrategy: http://www.passportjs.org/packages/passport-google-oauth2/ <br>

Loggin flow in current app:
1. Press Gooogle+ button
2. Google button goes to "auth/google", '/auth' handles it
```js 
// app.js
app.use('/auth', authRoutes);
```
3. '/google' handles next routing step
```js
// auth-routes.js
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));
```
4. new GoogleStrategy take cares about saving cookie, saving new user or proceed with existing ones
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
5. Came here because 'callbackURL' is '/google/redirect' and redirecting to '/profile'
```
// auth-routes.js
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});
```
6. Send info to browser about user
```
// profile-routes.js
router.get('/', authCheck, (req, res) => {
    res.render('profile', {
        user: req.user
    })
});
```
7. Logged In
