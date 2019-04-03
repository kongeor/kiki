@builtin "whitespace.ne"

@{%

const moo = require("moo");

const lexer = moo.compile({
  ws:     {match: /\s+/, lineBreaks: true},
  number: /0|[1-9][0-9]*/,
  word: /[a-z\+\=\*\-\/\?\>\<\_\!][a-z0-9\+\=\*\-\/\?\>\<\_\!]*/,
  string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
  oparen: "(",
  cparen: ")",
  obracket: "[",
  cbracket: "]",
});

const types = require("./types.js");

%}

@lexer lexer


main -> expr
expr -> atom 
	  | list
atom -> symbol 
	  | number
    | string
symbol -> %word {% types.parseSymbol %}
number -> %number {% types.parseNumber %}
string -> %string {% types.parseString %}
open -> %oparen | %obracket
close -> %cparen | %cbracket
list -> open (%ws):* expr (%ws expr):* (%ws):* close {% types.parseList %}