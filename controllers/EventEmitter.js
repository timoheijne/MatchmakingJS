const Event = require('events');

class AppEvents extends Event {};

module.exports = new AppEvents();