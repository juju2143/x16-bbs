module.exports = class Petscii {

    // control characters
    // see https://github.com/commanderx16/x16-docs/blob/master/Commander%20X16%20Programmer%27s%20Reference%20Guide.md#new-control-characters
    static NULL = '\x00';
    static SWAP = '\x01';
    static STOP = '\x03'; // '\x83'
    static UNDERLINE = '\x04';
    static WHITE = '\x05';
    static BOLD = '\x06';
    static BELL = '\x07';
    static BACKSPACE = '\x08';
    static SHIFTOFF = '\x08'; // not supported on X16
    static TAB = '\x09';
    static SHIFTON = '\x09'; // not supported on X16
    static LF = '\x0A';
    static ITALICS = '\x0B';
    static OUTLINE = '\x0C';
    static RETURN = '\x0D'; // '\x8D'
    static LOWERCASE = '\x0E'; // '\x8E'
    static ISO = '\x0F'; // '\x8F'
    static ISOON = '\x0F'; // '\x8F'
    static F9 = '\x10';
    static DOWN = '\x11'; // '\x91'
    static REVERSE = '\x12';
    static REVERSEON = '\x12';
    static HOME = '\x13'; // '\x93'
    static DEL = '\x14'; // '\x94'
    static F10 = '\x15';
    static F11 = '\x16';
    static F12 = '\x17';
    static SHIFTTAB = '\x18';
    static RED = '\x1C';
    static RIGHT = '\x1D';
    static GREEN = '\x1E';
    static BLUE = '\x1F';

    static ORANGE = '\x81';
    static RUN = '\x83'; // '\x03'
    static HELP = '\x84';
    static F1 = '\x85';
    static F3 = '\x86';
    static F5 = '\x87';
    static F7 = '\x88';
    static F2 = '\x89';
    static F4 = '\x8A';
    static F6 = '\x8B';
    static F8 = '\x8C';
    static SHIFTRETURN = '\x8D'; // '\x0D'
    static UPPERCASE = '\x8E'; // '\x0E'
    static ISOOFF = '\x8F'; // '\x0F'
    static BLACK = '\x90';
    static UP = '\x91'; // '\x11'
    static CLEARALL = '\x92';
    static REVERSEOFF = '\x92';
    static CLEAR = '\x93'; // '\x13'
    static INSERT = '\x94'; // '\x14'
    static BROWN = '\x95';
    static LIGHTRED = '\x96';
    static DARKGRAY = '\x97';
    static MIDDLEGRAY = '\x98';
    static LIGHTGREEN = '\x99';
    static LIGHTBLUE = '\x9A';
    static LIGHTGRAY = '\x9B';
    static PURPLE = '\x9C';
    static LEFT = '\x9D';
    static YELLOW = '\x9E';
    static CYAN = '\x9F';

    static encode(str)
    {
        return new Uint8Array(Array.prototype.map.call(str, a => a.codePointAt(0)));
    }
}