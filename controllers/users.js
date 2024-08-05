const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/:userId', async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        res.render('users/show.ejs', {
            displayName: targetUser.displayName,
            username: targetUser.username,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    };
});

module.exports = router;