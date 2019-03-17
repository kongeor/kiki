@builtin "whitespace.ne"

@{%

const moo = require("moo");

const lexer = moo.compile({
  ws:     {match: /\s+/, lineBreaks: true},
  number: /0|[1-9][0-9]*/,
  word: /[a-z\+\=\*]+/,
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
symbol -> %word {% types.parseSymbol %}
number -> %number {% types.parseNumber %}
open -> %oparen | %obracket
close -> %cparen | %cbracket
list -> open (%ws):* expr (%ws expr):* (%ws):* close {% types.parseList %}