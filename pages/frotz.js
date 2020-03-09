const Page = require('../lib/page.js');
const petscii = require('../lib/petscii.js');
const fs = require('fs');
const { spawn } = require('child_process');
const config = require('../config.json');

module.exports = class Frotz extends Page {
    constructor(socket, game)
    {
        super();
        this.title = "Playing a game";

        fs.mkdirSync(config.data+'/users/'+socket.user.name+'/frotz', {recursive: true});

        const frotz = spawn('dfrotz', ['-p', '-w80', '-h60', '-R', config.data+'/users/'+socket.user.name+'/frotz', config.data+'/'+game],
        {
            env: {
                //'TERM': 'cx16-iso',
                //'HOME': process.env.HOME
            }
        });

        this.on('load', () =>
        {
            socket.writep(petscii.ISOON+petscii.CLEAR);

            frotz.stdout.on("data", (data) => {
                let i;
                while((i=data.indexOf(0x0A))!=-1) data[i]=0x0D;
                //console.log(data);
                socket.write(data);
            });

            frotz.stderr.on("data", (data) => {
                //let i;
                //while((i=data.indexOf(0x0A))!=-1) data[i]=0x0D;
                console.log(data.toString());
            });

            frotz.on("close", () => {
                if(!socket.destroyed)
                    socket.change("games");
            });
        });

        this.on('unload', () =>
        {
            frotz.kill();
        });

        this.on('data', (data) =>
        {
            data.forEach((value) => {
                if (value >= 0x20 && value <= 0x7F)
                {
                    socket.write(Buffer.from([value]));
                    frotz.stdin.write(String.fromCharCode(value));
                }
                if (value == 0x14)
                {
                    socket.write(Buffer.from([value]));
                    frotz.stdin.write("\x08");
                }
                if(value == 0x0D)
                {
                    socket.write(Buffer.from([value]));
                    frotz.stdin.write("\n");
                }
            })
        });
    }
}