const assert = require('assert');
const Dispatcher = require('../controllers/dispatcher/Dispatcher')

describe('Dispatcher', () => {
    it('should fire the event test once using .on', (done) => {
        const testDispatch = new Dispatcher();
        testDispatch.on('test', () => {
            done();
        })

        testDispatch.emit('test');
    });

    it('should fire the event 5 times using .on', () => {
        const testDispatch = new Dispatcher();
        let num = 0;
        let test = () => {
            num += 1;
        }
        testDispatch.on('test', test)
        
        for (let i = 0; i < 5; i++) {
            testDispatch.emit('test');
        }

        assert.equal(num, 5)
    });

    it('should\'nt fire the event test after calling .off', (done) => {
        const testDispatch = new Dispatcher();
        let test = () => {
            done('Event was fired');
        }
        testDispatch.on('test', test)
        testDispatch.off('test', test);

        testDispatch.emit('test');
        done();
    });

    it('should fire the event only once using the method .once', () => {
        const testDispatch = new Dispatcher();
        let num = 0;
        let test = () => {
            num += 1;
        }
        testDispatch.once('test', test)

        testDispatch.emit('test');
        testDispatch.emit('test');

        assert.equal(num, 1);
    });
});
