const Game = require('./Game');

class GameManager {

  constructor() {
    this.games = new Map();
  }

  start({ nickname, email, slots }) {
    const game = new Game({ nickname, email, slots });
    this.games.set(game.gameId, game);
    return { gameId: game.gameId };
  }

  guess({ gameId, guess }) {
    if (this.games.has(gameId)) {
      const game = this.games.get(gameId);
      const evaluation = game.guess(guess);
      return { evaluation, guessCount: game.guessCount };
    }
    throw new Error('No?');
  }

}

module.exports = GameManager;
