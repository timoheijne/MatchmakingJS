const net = require('net');

const socket = net.createConnection({host: 'localhost', port: 1100});

// TODO: Delet dis

socket.on('connect', () => {
    console.log("Connection to server has been made")
    socket.write('authenticate');
})

socket.on('data', (data) => {
    console.log(data.toString('utf8') + '\n')
})