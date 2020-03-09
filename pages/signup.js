const Page = require('../lib/page.js');
const petscii = require('../lib/petscii.js');
const database = require('../lib/database.js');
const argon2 = require('argon2');

module.exports = class Signup extends Page {
    constructor(socket)
    {
        super();
        this.title = "Trying to create a new account";

        var db = new database();

        var user = {};
        var step = "name";
        user[step] = '';

        this.on('load', () =>
        {
            socket.writep('\r\rWE\'LL SETUP A NEW ACCOUNT FOR YOU, WE\'RE GONNA ASK YOU A FEW QUESTIONS');
            socket.writep(`\r\rTYPE ${petscii.GREEN}NEW${petscii.WHITE} ANYTIME TO CANCEL AND GO BACK`);
            socket.writep('\r\rCHOOSE USERNAME: ');
        });

        this.on('data', (data) =>
        {
            data.forEach((value) => {
                if(step != '')
                {
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
                        if(user[step].trim() == "NEW")
                        {
                            socket.change("login");
                        }
                        else switch(step)
                        {
                            case "name":
                                user[step] = user[step].trim();
                                if(user[step] == "")
                                {
                                    socket.writep(`\r\r${petscii.RED}EMPTY NAME, TRY AGAIN${petscii.WHITE}`);
                                    socket.writep(`\r\rCHOOSE USERNAME: `);
                                }
                                else if(db.checkName(user[step]))
                                {
                                    socket.writep(`\r\r${petscii.RED}THIS NAME IS TAKEN, TRY AGAIN${petscii.WHITE}`);
                                    socket.writep(`\r\rCHOOSE USERNAME: `);
                                }
                                else
                                {
                                    socket.writep(`\r\rCHOOSE PASSWORD: `);
                                    step = "password";
                                }
                                user[step] = '';
                                break;
                            case "password":
                                if(user[step].length < 6)
                                {
                                    socket.writep(`\r\r${petscii.RED}PASSWORD TOO SHORT, TRY AGAIN${petscii.WHITE}`);
                                    socket.writep(`\r\rCHOOSE PASSWORD: `);
                                }
                                else
                                {
                                    socket.writep(`\r\rYOUR EMAIL, JUST IN CASE: `);
                                    step = "email";
                                }
                                user[step] = '';
                                break;
                            case "email":
                                user[step] = user[step].trim();
                                if(user[step].search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.([A-Z]{2,}|XN--[A-Z0-9]+)$/)<0)
                                {
                                    socket.writep(`\r\r${petscii.RED}INVALID EMAIL, TRY AGAIN${petscii.WHITE}`);
                                    socket.writep(`\r\rYOUR EMAIL, JUST IN CASE: `);
                                }
                                else if(db.checkEmail(user[step]))
                                {
                                    socket.writep(`\r\r${petscii.RED}SOMEBODY ALREADY SIGNED UP WITH THIS EMAIL, TRY AGAIN${petscii.WHITE}`);
                                    socket.writep(`\r\rYOUR EMAIL, JUST IN CASE: `);
                                }
                                else
                                {
                                    socket.writep(`\r\rIS THIS CORRECT? (TYPE Y OR YES): `);
                                    step = "confirm";
                                }
                                user[step] = '';
                                break;
                            case "confirm":
                                if(user[step] != 'Y' && user[step] != 'YES')
                                {
                                    socket.writep(`\r\r${petscii.RED}GOING BACK TO THE FIRST QUESTION...${petscii.WHITE}`);
                                    socket.writep(`\r\rCHOOSE USERNAME: `);
                                    step = "name";
                                    user[step] = '';
                                }
                                else
                                {
                                    socket.writep(`\r\rREGISTERING...`);
                                    step = '';

                                    argon2.hash(user.password).then((value) => {
                                        user.password = value;
                                    
                                        var usr = db.createUser(user)

                                        if(usr)
                                        {
                                            socket.user = usr;
                                            socket.change("menu");
                                        }
                                        else
                                        {
                                            socket.writep(`\r\r${petscii.RED}SOMETHING WENT WRONG, TRY AGAIN${petscii.WHITE}`);
                                            socket.writep(`\r\rCHOOSE USERNAME: `);
                                            step = "name";
                                            user[step] = '';
                                        }
                                    });
                                }
                                break;
                        }
                    }
                }
            });
        });
    }
}