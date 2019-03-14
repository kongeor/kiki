const nearley = require("nearley");
const grammar = require("./grammar.js");

const { Cons, Bool, Numb, Symb, NIL } = require("./types");

// Create a Parser object from our grammar.
// parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const kikiGrammar = nearley.Grammar.fromCompiled(grammar);

function read(text) {
	let parser = new nearley.Parser(kikiGrammar);
	parser.feed(text);
	let form = parser.results[0][0][0];
	return form;
}

// Parse something!
// parser.feed("(a 1 1 b)");
// parser.feed("(fn (x) (f xyx 1000)    )");
// parser.feed("( fn ( x ) ( f xyx 1000 ) )");
// parser.feed("( ( ( a ) fn ( x ) ) ( f xyx 1000 ) )");
// parser.feed("( a b (c d))")
// parser.feed("( 10000 )")
// parser.feed("1000")
// parser.feed("a");
// parser.feed("((a))");

function truthy(sexpr) {
	if (sexpr == NIL) {
		return false;
	} else if (sexpr instanceof Bool) {
		return sexpr.boolVal();
	} else {
		return true;
	}
}

function evalApply(env, f, args) {

}

function evalSexpr(env, symb, form) {
	let s = symb.name();

	switch(s) {
		case "if": 
			let [pred, ifc, elsec] = form;
			return truthy(_eval(env, pred)) ? _eval(env, ifc) : _eval(env, elsec);
		default: evalApply(env, _eval(env, symb), form);
	}
}

function _eval(env, form) {
	if (form instanceof Cons) {
		if (form.car() instanceof Symb) {
			return evalSexpr(env, form.car(), form.cdr());
		}

	} else if (form instanceof Symb) {

	} else {
		return form;
	}
}


// parser.results is an array of possible parsings.
// console.log(JSON.stringify(parser.results[0][0][0]));
//  console.log(JSON.stringify(parser.results));
//  console.log(JSON.stringify(parser.results[0][0][0]));
// let form = parser.results[0][0][0];
// console.log(form.toStr());

// //  let [p1, p2, p3] = parse;
// //  console.log(p1.toStr())

// //  for (let e of parse) {
// // 	 console.log(e.toStr());
// //  }

// console.log(_eval(null, read("(if true 1 2)")))
// console.log(_eval(null, read("(if false 1 2)")))

module.exports = {
	read,
	_eval
}