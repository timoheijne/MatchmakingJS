const net = require('net');

const socket = net.createConnection({host: 'localhost', port: 1100});

// TODO: Delet dis

socket.on('connect', () => {
    console.log("Connection to server has been made")

    // socket.write('createParty')
})

socket.on('data', (data) => {
    console.log(data.toString('utf8') + '|-|')
    let d = data.toString('utf8').trim().split('|')

    if(d[0] == "welcome")
        socket.write('authenticate');

    if(d[0] == "authenticated") {
        socket.write('createParty')
    }
})