const mongoose = require('mongoose');

const playerSnapshotSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    username: 
    { 
        type: String, required: true 
    },
    stats: 
    {
        total_wins: 
        { 
            type: Number, 
            required: true 
        },
        total_games: 
        {
            type: Number, 
            required: true
        },
        rating: 
        { 
            type: Number, 
            required: true 
        }
    }
}, { _id: false });

const setSchema = new mongoose.Schema({
    team1: 
    { 
        type: Number,
        min: 0, 
        required: true 
    },
    team2: 
    {
        type: Number,
        min: 0,
        required: true 
    }
}, { _id: false });

const matchSchema = new mongoose.Schema({
    players: {
        type: [playerSnapshotSchema],
        required: true
    },
    sets: {
        type: [setSchema],
        required: true
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    duration: Number,
},{
    collection: "matches",
    versionKey: false,
    timestamps: true
});

const Matches = mongoose.model('Match', matchSchema);
module.exports = Matches;