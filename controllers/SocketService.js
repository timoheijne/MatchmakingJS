const logger        = require('./../logger');
const net           = require('net');
const Dispatcher    = require('./dispatcher/Dispatcher');

/* 
 * Keeping in mind the idea that we might need to open different sockets in the future
 */

// TODO: Add encryption option
class SocketService extends Dispatcher {
    constructor(port) {
        super()

        this._port = port;
        this.initSocket();
    }

    initSocket() {
        this._server = net.createServer((socket) => {
            socket.on('connect', () => {
                // Client connected, Emit a callback
                this.emit('client.connect', {client: socket});
            })

            socket.on('data', (data) => {
                // Client send data, Emit a callback for this socket
                console.log(data);
                // TODO: Partially Parse incomming data and emit to dispatcher
            })

            socket.on('close', () => {
                this.emit('client.close', {client: socket});
            })
        })

        this._server.on('close', () => {
            logger.info(`Server running on port ${this._port} has been closed`);
            this.emit('socket.closed');
        })

        this._server.on('error', (error) => {
            logger.fatal(`Server running on port ${this._port} errored with error ${error.name}`, error);
            this.emit('socket.error', {error: error});
        })

        this._server.on('listening', () => {
            logger.info(`Server running on port ${this._port} is now listening for connections`)
            this.emit('socket.listening');
        })
    }

    openConnection() {
        this._server.listen(this._port);
    }

    closeConnection() {
        this._server.closeSocket();
    }
}

module.exports = SocketService;