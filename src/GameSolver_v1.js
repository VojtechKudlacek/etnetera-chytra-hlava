/**
 * Dont look it this, it was just a brute force solution
 * Everyone has to start somewhere, right?
 */

const GameManager = require('./GameManager');

const nickname = 'Vojtuk';
const email = 'vojtuk@example.com';
const slots = 100;

const run = async () => {
  const gm = new GameManager();
  const { gameId } = await gm.start({ nickname, email, slots });
  const numberMap = new Map();
  for (let i = 1; i <= slots; i++) {
    const guess = Array(slots).fill(i);
    const { evaluation: { black } } = await gm.guess({ gameId, guess: guess });
    numberMap.set(i, black);
  }
  const numberMapIterator = numberMap.entries();
  const positionMap = new Map(); 
  while (true) {
    const iteration = numberMapIterator.next();
    if (iteration.done) {
      break;
    }
    const [number, count] = iteration.value;
    const positions = [];
    for (let i = 0; i < slots; i++) {
      const guess = Array(slots).fill(0);
      guess[i] = number;
      const { evaluation: { black } } = await gm.guess({ gameId, guess: guess });
      if (black) {
        positions.push(i);
      }
      if (positions.length === count) {
        break;
      }
    }
    positionMap.set(number, positions);
  }
  const positionMapIterator = positionMap.entries();
  const resultGuess = Array(slots).fill(null);
  while(true) {
    const iteration = positionMapIterator.next();
    if (iteration.done) {
      break;
    }
    const [number, positions] = iteration.value;
    for (let i = 0; i < positions.length; i++) {
      const index = positions[i];
      resultGuess[index] = number;
    }
  }
  const result = await gm.guess({ gameId, guess: resultGuess });
  console.log(resultGuess);
  console.log(result);
};

module.exports = run;
