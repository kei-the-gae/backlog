const mongoose = require('mongoose');

const userGameData = mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  gameComplete: Boolean,
  achievementsComplete: Boolean,
  notes: String,
});

const userSchema = mongoose.Schema({
  displayName: String,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  games: [userGameData],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
