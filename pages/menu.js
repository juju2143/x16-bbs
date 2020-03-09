const Page = require('../lib/page.js');
const petscii = require('../lib/petscii.js');

module.exports = class MainMenu extends Page {
    constructor(socket, selected=0)
    {
        super();
        this.title = "On the main menu";

        var items = ["games", "users", "login", "sysop"];
        var names = ["Games", "User list", "Logout"];

        if(socket.user.sysop > 0)
        {
            names.push("Sysop tools");
        }

        this.on('load', () =>
        {
            socket.writep(petscii.ISOON+petscii.CLEAR)
            socket.writep('Welcome '+petscii.GREEN+socket.user.name+petscii.WHITE+'!\r\r');
            socket.writep('There\'s not much to see so far but here\'s some sort of menu...\r\r');
            socket.writep('What do you want to do today?\r\r');
            names.forEach((item, i) => {
                socket.writep(selected==i?'==> '+petscii.REVERSE:'    ');
                socket.writep((i+1)+'. '+petscii.GREEN+item+'\r\r'+petscii.WHITE);
                if(selected==i)socket.writep(petscii.REVERSEOFF);
            });
        });

        this.on('data', (data) =>
        {
            data.forEach((value) => {
                if(value == 0x11) socket.change(socket.page, ((selected+1)%names.length));
                if(value == 0x91) socket.change(socket.page, ((names.length+selected-1)%names.length));
                if(value == 0x0D) socket.change(items[selected]);
                if(value > 0x30 && value <= 0x30+names.length) socket.change(items[value-0x31]);
            })
        });
    }
}