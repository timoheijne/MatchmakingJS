const clients = [];
const lobbies = {};

/* Expected events:
 * matchmaking.start: Expect: clients input
 *
 */
process.on('message', message => {
    const event = message.event;
    console.log(message)
})
