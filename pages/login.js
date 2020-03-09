const Page = require('../lib/page.js');
const petscii = require('../lib/petscii.js');
const database = require('../lib/database.js');

module.exports = class Login extends Page {
    constructor(socket)
    {
        super();
        this.title = "Trying to login";

        var db = new database();
        var user = {};
        var step = "name";
        user[step] = "";

        this.on('load', () =>
        {
            socket.user = [];
            switch(step)
            {
                case 1:
                    socket.writep(`\r\rPASSWORD:`);
                    break;
                case 2:
                    socket.writep(`\r\r${petscii.RED}INVALID NAME, PLEASE TRY AGAIN${petscii.WHITE}\r\r`);
                    break;
                default:
                    socket.writep(petscii.ISOOFF+petscii.BLACK+petscii.CLEAR);
                    socket.writep(`${petscii.PURPLE}${petscii.REVERSE}  ${petscii.REVERSEOFF}   ${petscii.REVERSE}  ${petscii.REVERSEOFF}\r`);
                    socket.writep(`${petscii.LIGHTBLUE} ${petscii.REVERSE}  ${petscii.REVERSEOFF} ${petscii.REVERSE}  ${petscii.REVERSEOFF}`);
                    socket.writep(`${petscii.WHITE}  **** COMMANDER X16 BBS V0.1 ****\r`);
                    socket.writep(`${petscii.CYAN}  ${petscii.REVERSE}  ${petscii.REVERSEOFF} ${petscii.REVERSE}  ${petscii.REVERSEOFF}\r`);
                    socket.writep(`${petscii.GREEN}    ${petscii.REVERSE} ${petscii.REVERSEOFF} ${petscii.REVERSE} ${petscii.REVERSEOFF}   `);
                    socket.writep(`${petscii.WHITE}  BBS.JUJU2143.CA PORT 23\r`);
                    socket.writep(`${petscii.YELLOW}  ${petscii.REVERSE}  ${petscii.REVERSEOFF} ${petscii.REVERSE}  \r`);
                    socket.writep(`${petscii.ORANGE} ${petscii.REVERSE}  ${petscii.REVERSEOFF} ${petscii.REVERSE}  ${petscii.REVERSEOFF}`);
                    socket.writep(`${petscii.WHITE}  INSERT MOTD HERE\r`);
                    socket.writep(`${petscii.RED}${petscii.REVERSE}  ${petscii.REVERSEOFF}   ${petscii.REVERSE}  \r`);
                    socket.writep(`${petscii.WHITE}\r`);
                    socket.writep(`TYPE ${petscii.GREEN}NEW${petscii.WHITE} TO CREATE A NEW ACCOUNT\r\r`);
                    socket.writep(`LOGIN: `);
                    break;
            }
        });

        this.on('data', (data) =>
        {
            data.forEach((value) => {
                if (value >= 0x20 && value <= 0x5F && (step == "name" && value != 0x2F || step != "name") && user[step].length < 32)
                {
                    socket.write(Buffer.from([step=="password"?113:value]));
                    user[step] += String.fromCharCode(value);
                }
                if (value == 0x14 && user[step].length > 0)
                {
                    socket.write(Buffer.from([value]));
                    user[step] = user[step].slice(0, -1);
                }
                if(value == 0x0D)
                {
                    switch(step)
                    {
                        case "name":
                            user[step] = user[step].trim();
                            if(user[step] == "")
                            {
                                socket.writep(`\r\r${petscii.RED}EMPTY NAME, TRY AGAIN${petscii.WHITE}`);
                                socket.writep(`\r\rLOGIN: `);
                                user[step] = '';
                            }
                            else if(user[step] == "NEW")
                            {
                                socket.change("signup");
                            }
                            else
                            {
                                socket.writep(`\r\rPASSWORD: `)
                                step = "password";
                                user[step] = '';
                            }
                            break;
                        case "password":
                            db.auth(user.name, user.password).then((login) => {
                                if(login)
                                {
                                    socket.user = login;
                                    console.log(socket.user.name+' logged in');
                                    socket.change("menu");
                                }
                                else
                                {
                                    socket.writep(`\r\r${petscii.RED}WRONG USERNAME/PASSWORD, TRY AGAIN${petscii.WHITE}`);
                                    socket.writep(`\r\rLOGIN: `);
                                    step = "name";
                                    user[step] = '';
                                }
                            });
                            break;
                    }
                }
            })
        });
    }
}