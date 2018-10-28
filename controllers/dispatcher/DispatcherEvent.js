const _ = require('lodash');

class DispatcherEvent {
    constructor(eventName) {
        this.eventName = eventName;
        this.callbacks = [];
    }

    registerCallback() {
        if (arguments.length > 0) {
            delete arguments[0]['0']
            let arr = Array.from(arguments[0]);
            arr.shift();

            if(typeof arr[0] == 'object')
                arr = arr[0];

            this.callbacks.push(arr);
        }
    }

    unregisterCallback() {
        delete arguments[0]['0']
        let arr = Array.from(arguments[0]);
        arr.shift();

        if (typeof arr[0] == 'object')
            arr = arr[0];

        let index = -1;
        for (let i = 0; i < this.callbacks.length; i++) {
            const element = this.callbacks[i];
            if(_.isEqual(arr, element)) {
                index = i;
                break;
            }
        }

        if(index == -1)
            return;

        this.callbacks.splice(index, 1)
    }

    fire(data) {
        // Get a copy of the callbacks incase it gets edited mid emit
        const cbacks = this.callbacks.slice();
        cbacks.forEach(callback => {
            let cbs = callback.slice();
            let cb = cbs[0]; // First callback
            cbs.shift();

            cb(data, () => {
                this.fireNext(data, cbs)
            });
        });    
    }

    fireNext(data, callbackStack) {
        let cbs  = callbackStack.slice();
        let cb = cbs[0]
        cbs.shift();

        if(cb) {
            cb(data, () => {
                this.fireNext(data, cbs);
            });
        }
    }

    GetCallbackCount() {
        return this.callbacks.length;
    }
}

module.exports = DispatcherEvent;