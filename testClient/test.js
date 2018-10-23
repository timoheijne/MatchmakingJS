const net = require('net');

const socket = net.createConnection({host: 'localhost', port: 1100});

// TODO: Delet dis

socket.on('connect', () => {
    console.log("Connection to server has been made")
    let long_message = "";
    for (let i = 0; i < 1000; i++) {
        long_message += "pneumonoultramicroscopicsilicovolcanoconiosis ";
    }
    socket.write('very very long message incoming: ' + long_message);
})

socket.on('data', (data) => {
    console.log(data.toString('utf8'))
})