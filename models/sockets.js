const BandList = require('./band-list');

class Sockets {
  constructor(io) {
    this.io = io;
    this.bandList = new BandList();
    this.socketEvents();
  }

  socketEvents() {
    // on connection
    this.io.on('connection', (socket) => {
      console.log('Cliente conectado');

      // Emitir al cliente conectado, todas las bandas actuales
      socket.emit('current-bands', this.bandList.getBands());

      // votar por la banda
      socket.on('votar-banda', (id) => {
        this.bandList.increaseVotes(id);
        this.io.emit('current-bands', this.bandList.getBands());
      });

      // votar por la banda
      socket.on('borrar-banda', (id) => {
        this.bandList.removeBand(id);
        this.io.emit('current-bands', this.bandList.getBands());
      });

      // cambiar nombre banda
      socket.on('cambiar-nombre-banda', ({ id, nombre }) => {
        this.bandList.changeName(id, nombre);
        this.io.emit('current-bands', this.bandList.getBands());
      });

      // crear new band
      socket.on('nueva-banda', ({nombre}) => {
        this.bandList.addBand(nombre);
        this.io.emit('current-bands', this.bandList.getBands());
      });
    });
  }
}

module.exports = Sockets;
