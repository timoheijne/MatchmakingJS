const DispatcherEvent = require('./DispatcherEvent')

class Dispatcher {
    constructor() {
        this.events = {};
    }

    on(eventName, callback) {
        let event = this.events[eventName];

        if(!event) {
            event = new DispatcherEvent(eventName)
            this.events[eventName] = event;
        }

        event.registerCallback(callback);
    }

    off(eventName, callback) {
        let event = this.events[eventName];

        // Check if event exists, otherwise there is no callback to be unregistered
        if(event) 
            event.unregisterCallback(callback);

        if(event.GetCallbackCount() === 0)
            delete this.events[eventName];
    }

    once(eventName, callback) {
        this.on(eventName, callback);

        this.on(eventName, (data) => { 
            // Hook onto that event and delete callback when event is fired
            this.off(eventName, callback)
        })
    }

    emit(eventName, data = null) {
        const event = this.events[eventName];
        
        if(event)
            event.fire(data);
    }
}

module.exports = Dispatcher;