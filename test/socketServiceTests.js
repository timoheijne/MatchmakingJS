const assert = require('assert');
const SocketService = require('./../controllers/SocketService')

let server;

describe('Socket Service', () => {
    beforeEach(() => {
        server = new SocketService(3000);
    })

    afterEach(() => {
        server.closeConnection();
    })

    it('should be able to open a socket server', (done) => {
        server.once('socket.listening', () => {
            done();
            server.closeConnection();
        })
        server.openConnection();
    })
    // Yes i am aware that it's it a bit double these two but for the sake of testing I do try both open & close seperately
    it('should be able to close a socket server', (done) => {
        server.once('socket.listening', () => {
            server.closeConnection();
        })
        server.once('socket.closed', () => {
            done();
        })
        server.openConnection();
    })

    it('should be able to receive an incoming connection')
    it('should be able to send an outgoing message')
    it('should be able to recieve a message')
    it('should be able to broadcast a message to all connections')
})