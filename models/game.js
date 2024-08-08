const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    igdbId: Number,
    name: String,
    summary: String,
    url: String,
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;