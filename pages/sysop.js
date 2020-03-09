const Page = require('../lib/page.js');
const petscii = require('../lib/petscii.js');

module.exports = class SysopMenu extends Page {
    constructor(socket, selected=0)
    {
        super();
        this.title = "On the secret sysop menu";

        var nbitems = 2;

        this.on('load', () =>
        {
            socket.writep(petscii.ISOON+petscii.CLEAR)
            socket.writep('Welcome '+petscii.GREEN+socket.user.name+petscii.WHITE+'!\r\r');
            socket.writep('Sysop tools here do not touch\r\r');
            socket.writep(selected==0?'==> '+petscii.REVERSE:'    ');
            socket.writep("1. "+petscii.GREEN+'Reload\r\r'+petscii.WHITE);
            if(selected==0)socket.writep(petscii.REVERSEOFF);
            socket.writep(selected==1?'==> '+petscii.REVERSE:'    ');
            socket.writep("2. "+petscii.GREEN+'Return\r\r'+petscii.WHITE);
            if(selected==1)socket.writep(petscii.REVERSEOFF);
        });

        this.on('data', (data) =>
        {
            data.forEach((value) => {
                if(value == 0x11) socket.change(socket.page, ((selected+1)%nbitems));
                if(value == 0x91) socket.change(socket.page, ((nbitems+selected-1)%nbitems));
                if(value == 0x0D) {
                    if(selected == 0)
                        socket.reloadPages();
                    else
                        socket.change("menu");
                }
                if(value == 0x31) socket.reloadPages();
                if(value == 0x32) socket.change("menu");
            })
        });
    }
}