const assert = require('assert');
const Dispatcher = require('./../controllers/dispatcher/Dispatcher')

describe('Dispatcher', function () {
    it('should fire the event test once', function (done) {
        const testDispatch = new Dispatcher();
        testDispatch.on('test', () => {
            done();
        })

        testDispatch.emit('test');
    });

    it('shouldnt fire the event test', function (done) {
        const testDispatch = new Dispatcher();
        let test = () => {
            done('Event was fired');
        }
        testDispatch.on('test', test)
        testDispatch.off('test', test);

        testDispatch.emit('test');
        done();
    });

    it('should fire event only once using the method .once', function () {
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
