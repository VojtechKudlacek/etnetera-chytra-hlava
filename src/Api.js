const express = require('express');
const GameManager = require('./GameManager');

class Api {

  constructor() {
    this.app = express();
    this.gm = new GameManager();
    this.init();
  }

  init() {
    this.app.use(express.urlencoded());
    this.app.use(express.json());
    this.app.get('/', (_req, res) => {
      res.send('Nothing here');
    });
    this.app.post('/start', (req, res) => {
      res.json(this.gm.start(req.body));
    });
    this.app.post('/guess', (req, res) => {
      res.json(this.gm.guess(req.body));
    });
  }

  listen(port) {
    return new Promise((r) => {
      this.server = this.app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`);
        r();
      });
    });
  }

  close() {
    return new Promise((r) => {
      console.log('Cloing the server. Bye. :)');
      this.server.close(r);
    });
  }

}

module.exports = Api;
