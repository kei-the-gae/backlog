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

router.get('/search', async (req, res) => {
    if (req.session.user) {
        res.render('/games/search.ejs');
    } else {
        res.redirect('/auth/sign-in.ejs');
    };
});

module.exports = router;