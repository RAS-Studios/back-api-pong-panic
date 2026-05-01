const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/ 
    },
    password: { 
        type: String, 
        required: false 
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    googleProfile: {
        name: String,
        picture: String
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },
    facebookProfile: {
        name: String,
        picture: String
    },
    stats : {
        total_wins: {
        type: Number,
        default: 0
        },
        total_games: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            default: 600
        }
    }
},{
    collection: 'users',
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);
module.exports = User;
