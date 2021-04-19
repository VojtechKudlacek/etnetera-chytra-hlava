const Api = require('./src/Api');
const solve = require('./src/GameSolver');

(async () => {
  const result = await solve({
    nickname: 'Vojtuk',
    email: 'vkudlacek98@gmail.com',
    slots: 100,
    apiUrl: 'https://hravahlava.etnetera.cz',
    saveLogs: true,
  });
  console.log(result);
  // const api = new Api();
  // await api.listen(3000);
  // let total = 0;
  // for (let i = 0; i < 200; i++) {
  //   console.log(`Iteration ${i}`);
  //   const result = await solve({
  //     nickname: 'Vojtuk',
  //     email: 'vkudlacek98@gmail.com',
  //     slots: 100,
  //     apiUrl: `http://localhost:3000`, // 'https://hravahlava.etnetera.cz'
  //   });
  //   console.log(result);
  //   total += result.guessCount;
  // }
  // console.log(total / 200);
  // await api.close();
})();
