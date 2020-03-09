const EventEmitter = require('events');

module.exports = class Page extends EventEmitter {
    constructor(socket, ...args)
    {
        super();

        this.timestamp = Date.now();
        this.title = "On an unknown place";
    }
}