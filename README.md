# x16-bbs

This is a simple framework for writing BBSes in Node.js written specifically for the Commander X16 machine.

## What is a BBS, anyway?

In short, a Bulletin Board System. Remember the good old days of slightly before Internet, where you have to dial up a phone number with your Commodore 64 to get to another one running BBS software and get some neat software for your machine? It's still the same thing over 30 years later, but this time you can access it through a TCP connection via Internet...

## Features implemented so far

- [x] Access via telnet and websockets
- [x] Login and signup process (with Argon2 hashing)
- [x] Menus
- [x] Doors
- [x] Sysop tools
- [ ] Boards
- [ ] Chatrooms
- [ ] Profile
- [ ] Feature detection (right now it assumes a X16 in 80x60 text mode)
- [ ] File upload
- [ ] Proper client software to support those features

If you think of something else, feel free to open an issue about it!

## How to connect

UART support on [the official emulator](https://github.com/commanderx16/x16-emulator) is a bit wonky as I write this, so you might want to use [my fork](https://github.com/juju2143/x16-emulator) which supports UART via FIFOs on Linux and the web emulator or [mattuna15's fork](https://github.com/mattuna15/x16-emulator/tree/main-sockets) which supports connecting directly to an IP address.

You'll then want to load a serial terminal program like this one:

```basic
10 OPEN 2,2,0,CHR$(6)+CHR$(161)
20 GET#2,A$
30 PRINT A$;:
40 GET B$
50 IF B$="" THEN 20
60 PRINT#2,B$;:
100 GOTO 20
```

Connect your X16 to the BBS server and there you go!

## Available instances

- http://bbs.juju2143.ca

## How to install

_soon_