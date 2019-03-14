@builtin "whitespace.ne"

@{%

const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t]+/,
  number: /[0-9]+/,
  word: /[a-z]+/,
  oparen: "(",
  cparen: ")"
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
list -> %oparen (%ws):* expr (%ws expr):* (%ws):* %cparen {% types.parseList %}