// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "main", "symbols": ["expr"]},
    {"name": "expr", "symbols": ["atom"]},
    {"name": "expr", "symbols": ["list"]},
    {"name": "atom", "symbols": ["symbol"]},
    {"name": "atom", "symbols": ["number"]},
    {"name": "symbol", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": types.parseSymbol},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": types.parseNumber},
    {"name": "open", "symbols": [(lexer.has("oparen") ? {type: "oparen"} : oparen)]},
    {"name": "open", "symbols": [(lexer.has("obracket") ? {type: "obracket"} : obracket)]},
    {"name": "close", "symbols": [(lexer.has("cparen") ? {type: "cparen"} : cparen)]},
    {"name": "close", "symbols": [(lexer.has("cbracket") ? {type: "cbracket"} : cbracket)]},
    {"name": "list$ebnf$1", "symbols": []},
    {"name": "list$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "list$ebnf$1", "symbols": ["list$ebnf$1", "list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "list$ebnf$2", "symbols": []},
    {"name": "list$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "expr"]},
    {"name": "list$ebnf$2", "symbols": ["list$ebnf$2", "list$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "list$ebnf$3", "symbols": []},
    {"name": "list$ebnf$3$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "list$ebnf$3", "symbols": ["list$ebnf$3", "list$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "list", "symbols": ["open", "list$ebnf$1", "expr", "list$ebnf$2", "list$ebnf$3", "close"], "postprocess": types.parseList}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
