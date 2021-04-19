class Game {

  constructor({ nickname, email, slots }) {
    this.nickname = nickname;
    this.email = email;
    this.slots = slots;
    this.gameId = String(Date.now());
    this.state = [];
    this.guessCount = 0;
    this.createState();
  }

  createState() {
    for (let i = 0; i < this.slots; i++) {
      this.state.push(Math.floor(Math.random() * this.slots) + 1);
    }
  }

  guess(guess) {
    this.guessCount++;
    let black = 0;
    let white = 0;
    let whiteGuess = [];
    let whiteState = [];
    // Black evaluation
    for (let i = 0; i < this.state.length; i++) {
      if (guess[i] === this.state[i]) {
        black++;
      } else {
        whiteGuess.push(guess[i]);
        whiteState.push(this.state[i]);
      }
    }
    // White evaluation
    for (let i = 0; i < whiteGuess.length; i++) {
      const index = whiteState.findIndex((value) => value === whiteGuess[i]);
      if (index >= 0) {
        white++;
        whiteState.splice(index, 1);
      }
    }
    return { black, white };
  }
}

module.exports = Game;
