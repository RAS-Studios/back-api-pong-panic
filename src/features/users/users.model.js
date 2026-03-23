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
        required: true 
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
