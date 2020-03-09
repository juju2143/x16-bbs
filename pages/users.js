const Page = require('../lib/page.js');
const petscii = require('../lib/petscii.js');
const moment = require('moment');

module.exports = class UserList extends Page {
    constructor(socket)
    {
        super();
        this.title = "Checking who's online";

        this.on('load', () =>
        {
            var sockets = socket.getUsers();
            socket.writep(petscii.ISOON+petscii.CLEAR)
            socket.writep('USER LIST - ');
            socket.writep(petscii.GREEN+sockets.length+petscii.WHITE+' users online\r\r');
            sockets.forEach((user, i) => {
                var when = moment(user.pageObject.timestamp).fromNow();
                if(user.user)
                {
                    socket.writep(`${i+1}. ${user.user.name} - ${user.pageObject.title} since ${when}\r`);
                }
                else
                {
                    socket.writep(`${i+1}. a guest - ${user.pageObject.title} since ${when}\r`);
                }
            });
            socket.writep('\rpress the any key');
        });

        this.on('data', (data) =>
        {
            data.forEach((value) => {
                socket.change("menu");
            })
        });
    }
}