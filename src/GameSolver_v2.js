const axios = require('axios').default;
const fs = require('fs');

const run = async ({ nickname, email, slots, apiUrl }) => {
  const logs = [];
  const log = (message, data) => {
    logs.push({ message, data });
  }

  const callStart = async (apiUrl, data) => {
    log('Calling start endpoint', data);
    const response = await axios.post(`${apiUrl}/start`, data);
    log('Getting response from start endpoint', response.data);
    return response.data;
  };
  
  const callGuess = async (apiUrl, data) => {
    log('Calling guess endpoint', data);
    const response = await axios.post(`${apiUrl}/guess`, data);
    log('Getting response from guess endpoint', response.data);
    return response.data;
  };

  // Requesting game id
  const { gameId } = await callStart(apiUrl, { nickname, email, slots });

  // Some algo I was drawing on the paper for like 30 minutes and it actually works
  const solveForSection = async (number, from, to) => {
    const guess = Array(slots).fill(0);
    for (let i = from; i <= to; i++) { guess[i] = number; }
    const { evaluation: { black } } = await callGuess(apiUrl, { gameId, guess });
    if (black > 0) {
      const length = to - from + 1;
      if (length === 1) {
        return [from];
      }
      // Check left half
      const leftHalfResult = await solveForSection(number, from, from + Math.ceil(length / 2) - 1);
      if (leftHalfResult.length === black) {
        return leftHalfResult;
      }
      if (Math.floor(length / 2) === 1) {
        // Simply cut off right half check if we know it has to contain the number
        // It saves a few calls
        return [...leftHalfResult, to - Math.floor(length / 2) + 1];
      }
      // Check right half
      const rightHalfResult = await solveForSection(number, to - Math.floor(length / 2) + 1, to);
      return [...leftHalfResult, ...rightHalfResult];
    }
    return [];
  }

  // Creating position map - key = guessed number, value = indedex of the number
  const positionMap = new Map();
  let found = 0;
  for (let i = 1; i <= slots; i++) {
    const positions = await solveForSection(i, 0, slots - 1);
    positionMap.set(i, positions);
    found += positions.length;
    if (found >= slots) {
      break;
    }
  }

  // Iterate through the position map and create the final guess
  const positionMapIterator = positionMap.entries();
  const finalGuess = Array(slots).fill(null);
  while (true) {
    const iteration = positionMapIterator.next();
    if (iteration.done) {
      break;
    }
    const [number, positions] = iteration.value;
    for (let i = 0; i < positions.length; i++) {
      const index = positions[i];
      finalGuess[index] = number;
    }
  }

  // Win the game
  log('Final guess', finalGuess);
  const result = await callGuess(apiUrl, { gameId, guess: finalGuess });
  log('Final call result', result);
  fs.writeFileSync(`logs/log-${gameId}.json`, JSON.stringify(logs, null, 2));
  return result;
};

module.exports = run;
