class DispatcherEvent {
    constructor(eventName) {
        this.eventName = eventName;
        this.callbacks = [];
    }

    registerCallback(callback) {
        this.callbacks.push(callback);
    }

    unregisterCallback(callback) {
        let index = this.callbacks.indexOf(callback);

        if(index == -1)
            return;

        this.callbacks.splice(index, 1)
    }

    fire(data) {
        // Get a copy of the callbacks incase it gets edited mid emit
        const callbacks = this.callbacks.slice(0);

        callbacks.forEach(callback => {
            callback(data);
        });
    }

    GetCallbackCount() {
        return this.callbacks.length;
    }
}

module.exports = DispatcherEvent;