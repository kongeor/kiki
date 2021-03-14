const { Cons, Bool, Str, Fn, Num, Symb, NIL, parseSymbol } = require("./types");

const ALPHANUMS = "1234567890abcdefghijklmnopqrstuvwxyz_!-+*/<>=?"; 
const DIGITS = "1234567890";
const WHITESPACE = " \n\t";

class PushbackReader {

    constructor(source) {
        this._buf = source.split("");
        this._idx = 0;
    }

    read() {
        if (this._hasUnread) {
            this._hasUnread = false;
            return this._unreadChar;
        } 
        return this._buf[this._idx++];
    }

    unread(char) {
        if (this._hasUnread) {
            throw new Error("Cannot unread again: " + char);
        }
        this._hasUnread = true;
        this._unreadChar = char;
    }

}

class KikiReader {

    constructor(source) {
        this._reader = new PushbackReader(source);
    }

    read() {
        let exprs = NIL;

        this._readWhitespace();

        let char = this._reader.read();

        while (char) {
            this._reader.unread(char);
            exprs = new Cons(this._readExpr(), exprs);
            this._readWhitespace();
            char = this._reader.read();
        }

        if (exprs === NIL) {
            return NIL;
        } else {
            return exprs.reverse();
        }
    }

    _readExpr() {
        this._readWhitespace();

        let char = this._reader.read();

        if (DIGITS.includes(char)) {
            this._reader.unread(char);
            return this._readNumber();
        }

        if (ALPHANUMS.includes(char)) {
            this._reader.unread(char);
            return this._readSymbol();
        }

        if ('"' == char) {
            return this._readString();
        }

        if ('(' == char) {
            return this._readList(')');
        }

        if ('[' == char) {
            return this._readList(']');
        }

        if ('\'' == char) {
            return new Cons(new Symb("quote"), new Cons(this._readExpr()));
        }

        if (';' == char) {
            while ('\n' != char) {
                char = this._reader.read();
            }
        }

        throw "Unrecognized character: " + char;
    }

    _readNumber() {
        let char = this._reader.read();
        let num = "";
        while (DIGITS.includes(char)) {
            num += char;
            char = this._reader.read();
        }
        this._reader.unread(char);
        return new Num(parseInt(num, 10));
    }

    _readSymbol() {
        let char = this._reader.read();
        let symb = "";
        while (ALPHANUMS.includes(char)) {
            symb += char;
            char = this._reader.read();
        }
        this._reader.unread(char);
        // TODO fix
        return parseSymbol([{text: symb}])
    }

    _readString() {
        let char = this._reader.read();
        let str = "";
        while ('"' != char) {
            str += char;
            char = this._reader.read();
        }
        // this._reader.unread(char);
        return new Str(str);
    }

    _readList(terminator) {
        let char = this._reader.read();
        let exprs = NIL;
        while (terminator != char) {
            this._reader.unread(char);
            let expr = this._readExpr();
            exprs = new Cons(expr, exprs);
            this._readWhitespace();
            char = this._reader.read();
        }
        return exprs.reverse();
    }

    _readWhitespace() {
        let char = this._reader.read();
        while (WHITESPACE.includes(char)) {
            char = this._reader.read();
        }
        this._reader.unread(char);
    }
}

module.exports = {
    KikiReader
}