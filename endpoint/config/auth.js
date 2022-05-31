// Require passport
const passport = require('passport');
// Require GoogleStrategy
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// Use the GoogleStrategy within Passport
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        function (request, accessToken, refreshToken, profile, done) {
            // Check if the user is already logged in
            if (request.user) {
                return done(null);
            }

            // Create the user
            const user = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
            };

            // Add the user to the request
            request.user = user;

            // Call the next middleware
            return done(null, user);
        }
    )
);

// Serialize the user
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Deserialize the user
passport.deserializeUser(function (user, done) {
    done(null, user);
});
