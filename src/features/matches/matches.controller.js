const Matches = require("./matches.model");
const User = require('../users/users.model');

function calculateEloRating(playerRating, opponentRating, isWinner) {
    const K = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const result = isWinner ? 1 : 0;
    return Math.round(playerRating + K * (result - expectedScore));
}

exports.getMatchById = async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await Matches.findById(matchId);

        if (!match) {
            return res.status(404).json({ error: "Match introuvable" });
        }
        res.status(200).json(match);
    } catch (err) {
        res.status(400).json({ error: err.message });
    } 
};

exports.deleteMatchById = async (req, res) => {
    try {
        const matchId = req.params.id;
        const deleteMatch = await Matches.findById(matchId);

        if (!deleteMatch) {
            return res.status(404).json({ error: "Match introuvable" });
        }

        await deleteMatch.deleteOne();

        res.status(200).json("Match supprimé")
    } catch (err) {
        res.status(400).json({ error: err.message });
    } 
};

exports.createMatch = async (req, res) => {
    try {
        const newMatch = new Matches({
            players: req.body.players,
            sets: req.body.sets,
            winner: req.body.winner,
            duration: req.body.duration
        });
        
        await newMatch.save();

        // Mettre à jour les stats des joueurs
        const [player1, player2] = await Promise.all([
            User.findById(req.body.players[0].userId),
            User.findById(req.body.players[1].userId)
        ]);

        const player1Won = req.body.winner.toString() === player1._id.toString();

        const newEloP1 = calculateEloRating(player1.stats.rating, player2.stats.rating, player1Won);
        const newEloP2 = calculateEloRating(player2.stats.rating, player1.stats.rating, !player1Won);

        player1.stats.total_games += 1;
        player2.stats.total_games += 1;

        if (player1Won) {
            player1.stats.total_wins += 1;
        } else {
            player2.stats.total_wins += 1;
        }

        player1.stats.rating = newEloP1;
        player2.stats.rating = newEloP2;
        
        await Promise.all([player1.save(), player2.save()]);

        res.status(201).json({
            match: newMatch,
            ratingChanges: [
                { username: player1.username, oldRating: player1.stats.rating, newRating: newEloP1, diff: newEloP1 - player1.stats.rating },
                { username: player2.username, oldRating: player2.stats.rating, newRating: newEloP2, diff: newEloP2 - player2.stats.rating }
            ]
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }


};

exports.getHistoryById = async (req, res) => {
    try {
        const user = req.params.userId
        const history = await Matches.find({ "players.userId": user }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .select('username stats')
            .sort({ 'stats.rating': -1 })
            .limit(50);

        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};