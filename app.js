import express from 'express';
import cookieSession from 'cookie-session';
import passport from 'passport';
import authRoutes from './routes/auth-routes';
import profileRoutes from './routes/profile-routes';
import { session } from './config/keys';
import './config/passport-setup';
import './config/mongoose';

const app = express();

// set view engine
app.use(express.static(`${__dirname}/views`));
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});