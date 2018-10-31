const clients = [];
const lobbies = {};

const loop = true;

let matchmakingStep;

/* Expected events:
 * matchmaking.start: Expect: clients input
 *
 */
process.on('message', message => {
    const event = message.event;

    if(event ==  "matchmaking.start") {
        clients.push(message.clientData);

        initMatchmaking();
    }
    
    console.log(clients)
})

function initMatchmaking() {
    if(matchmakingStep) return; // Its already running

    matchmakingStep = setInterval(() => {
        // This is a matchmaking step.
        console.log('dab')
    }, 500); // We don't need a while true loop here, Search for a match every .5 of a second is more than enough
}
