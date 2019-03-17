const nearley = require("nearley");
const grammar = require("./grammar.js");

const { Cons, Bool, Fn, Num, Symb, NIL } = require("./types");

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

globals = {}

class Env {
	constructor() {
		this._env = NIL;
	}

	lookup(symb) {
		let curr = this._env;
		while (curr != NIL) {
			let [[s, v]] = curr;
			if (symb == s) {
				return v;
			}
			curr = curr.cdr();
		}
		
		let v = globals[symb];
		if (v) {
			return v;
		}
		throw new Error("Unknown symbol " + symb);
	}

	bind(symb, val) {
		this._env = new Cons(new Cons(symb, val), this._env);
	}

	static bindGlobal(symb, val) {
		globals[symb] = val;
		return val;
	}
}

const global_fns = {
	"inc": (env, args) => new Num(args.car().numVal() + 1),
	"dec": (env, args) => new Num(args.car().numVal() - 1)
};

function resetGlobals() {
	globals = {};
	for (let [key, value] of Object.entries(global_fns)) {
		globals[Symb.intern(key)] = Fn.builtin(key, value);
	}
}

resetGlobals();

function truthy(sexpr) {
	if (sexpr == NIL) {
		return false;
	} else if (sexpr instanceof Bool) {
		return sexpr.boolVal();
	} else {
		return true;
	}
}

function evalArgs(env, args) {
	if (args == NIL) {
		return NIL;
	}
	return new Cons(_eval(env, args.car()), evalArgs(env, args.cdr()));
}

function evalApply(env, f, args) {
	return f.invoke(env, evalArgs(env, args));
}

function evalSexpr(env, symb, form) {
	let s = symb.name();

	switch(s) {
		case "if": 
			let [pred, ifc, elsec] = form;
			return truthy(_eval(env, pred)) ? _eval(env, ifc) : _eval(env, elsec);
		case "do":
			let result = NIL;
			for (let f of form) {
				result = _eval(env, f);
			}
			return result;
		case "def":
			let [b, v] = form;
			return Env.bindGlobal(b, v);
		case "quote":
			return form.car()
		default: return evalApply(env, _eval(env, symb), form);
	}
}

function _eval(env, form) {
	if (form instanceof Cons) {
		if (form.car() instanceof Symb) {
			return evalSexpr(env, form.car(), form.cdr());
		}

	} else if (form instanceof Symb) {
		return env.lookup(form);
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
	_eval,
	Env
}