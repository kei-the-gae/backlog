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
    res.render('users/games/new.ejs');
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