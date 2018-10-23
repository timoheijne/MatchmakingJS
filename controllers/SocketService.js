const logger        = require('./../logger');
const net           = require('net');
const Dispatcher    = require('./dispatcher/Dispatcher');

/* 
 * Keeping in mind the idea that we might need to open different sockets in the future
 */

// TODO: Add encryption option
class SocketService extends Dispatcher {
    constructor(port) {
        super();

        this._port = port;
        this.initSocket();
    }

    initSocket() {
        this._server = net.createServer((socket) => {
            this.emit('client.connect', { client: socket });

            socket.on('data', (data) => {
                // Client send data, Emit a callback for this socket+
                dataParsed = data.toString('utf8').trim().split('|');
                if (dataParsed.length == 0) {
                    // We've gotten some incorrect input here
                } else {
                    if (dataParsed[0] == "ping") {
                        socket.write('pong\r\n');
                    }

                    this.emit(`client.message.${dataParsed[0]}`, { client: socket, event: dataParsed[0], data: dataParsed[1], raw: data});

                    // A wild card for all messages coming through
                    this.emit('client.message', { client: socket, event: dataParsed[0], data: dataParsed[1], raw: data });
                }
            })

            socket.on('end', () => {
                this.emit('client.end', {client: socket});
            })

            socket.on('close', () => {
                this.emit('client.close', {client: socket});
            })

            socket.on('error', (err) => {
                if (err.errno != 'ECONNRESET')
                    logger.error(`Server running on port ${this._port} caught an error ${err.name}`, err, socket);

                this.emit('client.error', {client: socket, error: err});
            })
        })

        this._server.on('close', () => {
            logger.info(`Server running on port ${this._port} has been closed`);
            this.emit('socket.closed');
        })

        this._server.on('error', (error) => {
            if (error.errno != 'ECONNRESET')
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
        this._server.unref();
        this._server.close();
    }
}

module.exports = SocketService;