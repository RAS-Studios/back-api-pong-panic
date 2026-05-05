const express = require('express');
const router = express.Router();
const matchController = require('./matches.controller');
const auth = require('../../middlewares/auth.middleware')

router.get('/leaderboard', matchController.getLeaderboard);
router.post('/', matchController.createMatch);
router.get('/:id', matchController.getMatchById);
router.delete('/:id', matchController.deleteMatchById);
router.get('/history/:userId', auth, matchController.getHistoryById);

module.exports = router;