const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../features/users/users.model');

// Stratégie Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://api-pong-panic.onrender.com/api/users/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            // Créer un nouvel utilisateur
            user = new User({
                email: profile.emails[0].value,
                username: profile.displayName || profile.emails[0].value.split('@')[0],
                googleId: profile.id,
                googleProfile: {
                    name: profile.displayName,
                    picture: profile.photos[0]?.value
                },
                password: null, // Pas de mot de passe pour SSO
                authProvider: 'google'
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Stratégie Facebook (Meta)
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://api-pong-panic.onrender.com/api/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });
        
        if (!user) {
            // Créer un nouvel utilisateur
            user = new User({
                email: profile.emails[0].value,
                username: profile.displayName || profile.emails[0].value.split('@')[0],
                facebookId: profile.id,
                facebookProfile: {
                    name: profile.displayName,
                    picture: profile.photos[0]?.value
                },
                password: null, // Pas de mot de passe pour SSO
                authProvider: 'facebook'
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
