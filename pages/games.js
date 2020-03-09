const Page = require('../lib/page.js');
const petscii = require('../lib/petscii.js');

module.exports = class GamesMenu extends Page {
    constructor(socket, selected=0)
    {
        super();
        this.title = "On the games menu";

        var items = ["frotz", "frotz", "frotz", /*"frotz",*/ "menu"];
        var args = ["games/zork1.z5", "games/zork2.z5", "games/zork3.z5", /*"games/ztuu.z5",*/ undefined];
        var names = ["Zork I", "Zork II", "Zork III", /*"Zork IV",*/ "Return"];

        this.on('load', () =>
        {
            socket.writep(petscii.ISOON+petscii.CLEAR)
            socket.writep('Welcome '+petscii.GREEN+socket.user.name+petscii.WHITE+'!\r\r');
            socket.writep('We have a vast collection of games here, ');
            socket.writep('which one do you want to do play?\r\r');
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
                if(value == 0x0D) socket.change(items[selected], args[selected]);
                if(value > 0x30 && value <= 0x30+names.length) socket.change(items[value-0x31], args[value-0x31]);
            })
        });
    }
}