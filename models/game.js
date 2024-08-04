const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    name: String,
    multiplayer: Boolean,
    genre: [
        { type: String, }
    ],
    summary: String,
    url: String,
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;