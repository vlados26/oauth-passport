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
3. auth-routes.js `router.get('/google', ...`
4. passport-setup.js `passport.use(new GoogleStrategy...`
5. auth-routes.js router.get('/google/redirect'
6. profile-routes.js `router.get('/', ...`
7. Logged In
