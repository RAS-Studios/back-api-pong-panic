const express = require('express');
const router = express.Router();
const userController = require('./users.controller');
const auth = require('../../middlewares/auth.middleware')
const passport = require('passport');

router.post('/register', userController.createUser);
//router.get('/', userController.getAllUser);
router.post('/login', userController.login);
router.get('/me', auth , userController.getMe);

// Routes SSO Google
router.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    userController.googleCallback
);

// Routes SSO Facebook (Meta)
router.get('/auth/facebook', passport.authenticate('facebook', { 
    scope: ['email'] 
}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    userController.facebookCallback
);

module.exports = router;