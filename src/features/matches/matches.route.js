const express = require('express');
const router = express.Router();
const matchController = require('./matches.controller');
const auth = require('../../middlewares/auth.middleware')

router.get('/:id', matchController.getMatchById);
router.delete('/:id', matchController.deleteMatchById);
router.post('/', matchController.createMatch);

module.exports = router;