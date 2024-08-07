const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Game = require('../models/game');

router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.render('users/index.ejs', {
            users: allUsers,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:userId', async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        res.render('users/show.ejs', {
            userId: req.params.userId,
            displayName: targetUser.displayName,
            username: targetUser.username,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:userId/games', async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        const allGames = await Game.find();
        const userGames = [];
        targetUser.games.forEach(game => {
            const currentGame = allGames.find(entry => game.game.equals(entry._id));
            userGames.push(currentGame);
        });
        res.render('users/games/index.ejs', {
            targetUser,
            games: userGames,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:userId/games/new', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const id = req.query.game;
        const gameInDatabase = await Game.find({ igdbId: id });

        if (!gameInDatabase.length) {
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
                body: `fields *; where id = ${id};`,
                headers: queryHeaders,
            });
            const queryData = await queryRes.json();

            if (!queryRes.ok) {
                console.log(queryData);
                throw new Error(`Query response status: ${queryRes.status}`);
            };

            await Game.create({
                igdbId: queryData[0].id,
                name: queryData[0].name,
                summary: queryData[0].summary,
                url: queryData[0].url,
            });
        };

        const newGame = await Game.find({ igdbId: id });

        res.render('users/games/new.ejs', {
            userId,
            newGame,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.post('/:userId/games', async (req, res) => {
    try {
        const gameId = req.query.game;
        const currentUser = await User.findById(req.session.user._id);
        req.body.game = gameId;
        currentUser.games.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/games`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:userId/games/:gameId/edit', async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        const currentUser = await User.findById(req.session.user._id);
        const userGameDataIdx = currentUser.games.findIndex(game => game.game.equals(gameId));
        const userGameData = currentUser.games[userGameDataIdx];
        res.render('users/games/edit.ejs', {
            game,
            userGameData,
        })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.put('/:userId/games/:gameId', async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const currentUser = await User.findById(req.session.user._id);
        const userGameDataIdx = currentUser.games.findIndex(game => game.game.equals(gameId));
        currentUser.games[userGameDataIdx].set(req.body);
        await currentUser.save();
        res.redirect(`/games/${gameId}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:userId/wishlist', async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        res.render('users/wishlist/index.ejs', {
            userId: req.params.userId,
            displayName: targetUser.displayName,
            username: targetUser.username,
            wishlist: targetUser.wishlist,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:userId/wishlist/new', async (req, res) => {
    res.render('users/wishlist/new.ejs');
});

module.exports = router;