const express = require('express');
const router = express.Router();

const User = require('../models/user');

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
        res.render('users/games/index.ejs', {
            userId: req.params.userId,
            displayName: targetUser.displayName,
            username: targetUser.username,
            games: targetUser.games,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

router.get('/:userId/games/new', async (req, res) => {
    try {
        const id = req.query.game;
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

        console.log(queryData);

        res.render('users/games/new.ejs', {
            game: queryData,
        });
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