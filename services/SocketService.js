const logger        = require('./../logger');
const net           = require('net');
const Dispatcher    = require('./../controllers/dispatcher/Dispatcher');
const uuidV4        = require('uuid/v4');

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

    // TODO: Clean up this function
    initSocket() {
        this._server = net.createServer((socket) => {
            this.emit('client.connect', { client: socket });

            // Generate a session id
            socket.id = uuidV4();
            socket.write('welcome|' + socket.id)

            socket.on('data', (data) => {
                // Client send data, Emit a callback for this socket+
                let dataParsed = data.toString('utf8').trim().split('|');
                if (dataParsed.length == 0) {
                    // We've gotten some incorrect input here
                } else {
                    let evnt = dataParsed[0];
                    let args = [];
                    if (dataParsed[1]) {
                        args = dataParsed[1].split(',');
                    }
                    
                    if (evnt == "ping") {
                        socket.write('pong\r\n');
                    }

                    this.emit(`client.message.${dataParsed[0]}`, { client: socket, event: evnt, data: args, raw: data});

                    // A wild card for all messages coming through
                    this.emit('client.message', { client: socket, event: evnt, data: args, raw: data });
                }
            })

            socket.on('end', () => {
                this.emit('client.end', {client: socket});
            })

            socket.on('close', () => {
                this.emit('client.disconnect', {client: socket});
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

function emit(data) {
    if (typeof data == "object") {
        this.socket.write(JSON.stringify(data));
    }
}

module.exports = SocketService;