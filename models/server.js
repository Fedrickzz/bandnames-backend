const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');

const Sockets = require('./sockets');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // http server
    this.server = http.createServer(this.app);

    // config socket server
    this.io = socketio(this.server, {
      cors: {
        origin: true,
        credentials: true,
      },
      allowEIO3: true,
    });
  }

  middlewares() {
    // public dir
    this.app.use(express.static(path.resolve(__dirname, '../public')));

    // CORS
    this.app.use(cors());
  }

  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    // init middleware
    this.middlewares();

    // init sockets
    this.configurarSockets();

    // init server
    this.server.listen(this.port, () => {
      console.log('Server corriendo en puerto:', this.port);
    });
  }
}

module.exports = Server;
