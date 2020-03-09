const net = require('net');
const websockify = require('@maximegris/node-websockify');
const petscii = require('./lib/petscii.js');
var pages = require('./pages.js');
const config = require('./config.json');

// This code is best viewed with the C64 Pro Mono font

net.Socket.prototype.writep = function(data, callback)
{
    return this.write(petscii.encode(data), callback);
}

net.Socket.prototype.change = function(newPage, ...args)
{
    if(this.pageObject)
    {
        this.pageObject.emit('unload', newPage);
    }
    if(newPage)
    {
        this.page = newPage;
        this.pageArgs = args;
    }
    else
    {
        newPage = this.page;
        args = this.pageArgs;
    }
    this.pageObject = new pages[newPage](this, ...args);
    this.pageObject.emit('load');
}

net.Socket.prototype.reloadPages = function()
{
    Object.keys(require.cache).forEach(function(key) { if(key.indexOf("/pages")!=-1) delete require.cache[key] });
    pages = require('./pages.js');
    this.change();
}

net.Socket.prototype.getUsers = function()
{
    return sockets;
}

var sockets = [];

const server = net.createServer((socket) =>
{
    console.log('someone connected on', socket.address());

    sockets.push(socket);

    socket.change("login");

    socket.on('data', (data) => {
        if(socket.pageObject)
            socket.pageObject.emit('data', data);
    });

    socket.on('close', ()=>{
        console.log(socket.username+' disconnected');
        socket.pageObject.emit('unload', 'quit');
        var index = sockets.findIndex(o => o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort);
        if (index !== -1) sockets.splice(index, 1);
    });
})
.on('error', (err) =>
{
    // Handle errors here.
    console.log(err);
});

server.listen(config.port, () =>
{
    console.log('opened server on', server.address());
    websockify({
        source: ':'+config.webport,
        target: ':'+config.port,
    });
});