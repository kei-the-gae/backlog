const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Game = require('../models/game');

router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.render('games/index.ejs', {
            games,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

module.exports = router;