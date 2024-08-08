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
        res.render('games/search.ejs');
    } else {
        res.redirect('auth/sign-in.ejs');
    };
});

router.post('/search-results', async (req, res) => {
    try {
        const search = req.body.name;
        const authBaseUrl = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;

        const authRes = await fetch(authBaseUrl, { method: "POST", });
        const authData = await authRes.json();

        if (!authRes.ok) {
            console.log(authData);
            throw new Error(`Authentication response status: ${authRes.status}`);
        };

        const queryBaseUrl = 'https://api.igdb.com/v4/games';
        const queryHeaders = {
            'Client-ID': `${process.env.TWITCH_CLIENT_ID}`,
            Authorization: `Bearer ${authData['access_token']}`,
            Accept: 'application/json',
        };

        const queryRes = await fetch(queryBaseUrl, {
            method: "POST",
            body: `search "${search}"; fields name,url; limit 50;`,
            headers: queryHeaders,
        });
        const queryData = await queryRes.json();
        if (!queryRes.ok) {
            console.log(queryData);
            throw new Error(`Query response status: ${queryRes.status}`);
        };

        res.render('games/search-results.ejs', {
            search,
            games: queryData,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:gameId', async (req, res) => {
    try {
        let currentUser;
        let userGameData;
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        if (req.session.user) {
            currentUser = await User.findById(req.session.user._id);
            const userGameDataIdx = currentUser.games.findIndex(game => game.game.equals(gameId));
            userGameData = currentUser.games[userGameDataIdx];
        };
        res.render('games/show.ejs', {
            game,
            user: currentUser,
            userGameData,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.delete('/:gameId', async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const currentUser = await User.findById(req.session.user._id);
        const userGameDataIdx = currentUser.games.findIndex(game => game.game.equals(gameId));
        currentUser.games[userGameDataIdx].deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/games`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

module.exports = router;