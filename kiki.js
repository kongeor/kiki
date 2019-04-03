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
	if (form instanceof Array) {
		return form[0];
	}
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
	constructor(cons = NIL) {
		this._env = cons;
	}

	lookup(symb) {
		let curr = this._env;
		while (curr != NIL) {
			let s = curr.car().car();
			let v = curr.car().cdr();
			if (symb == s) {
				return v;
			}
			curr = curr.cdr();
		}
		
		return Env.lookupGlobal(symb);
	}

	bind(symb, val) {
		return new Env(new Cons(new Cons(symb, val), this._env));
	}

	static lookupGlobal(symb) {
		let v = globals[symb];
		if (v) {
			return v;
		}
		throw new Error("Unknown symbol " + symb);
	}

	static bindGlobal(symb, val) {
		globals[symb] = val;
		return val;
	}
}

const global_fns = {
	"println": (env, args) => {
		let s = "";
		for (let a of args) {
			s += a.toString() + " ";
		}
		console.log(s)
		return NIL;
	},
	"+": (env, args) => new Num(args.car().numVal() + args.cdr().car().numVal()),
	"*": (env, args) => new Num(args.car().numVal() * args.cdr().car().numVal()),
	"-": (env, args) => null,
	"/": (env, args) => null,
	"<": (env, args) => null,
	">": (env, args) => null,
	"<=": (env, args) => null,
	">=": (env, args) => null,
	"=": (env, args) => new Bool(args.car().eq(args.cdr().car())),
	"inc": (env, args) => new Num(args.car().numVal() + 1),
	"dec": (env, args) => new Num(args.car().numVal() - 1),
	"car": (env, args) => args.car().car(),
	"cdr": (env, args) => args.car().cdr(),
	"cons": (env, args) => {
		let car = args.car();
		let cdr = NIL;
		if (args.cdr() != NIL) {
			cdr = args.cdr().car();
		}
		return new Cons(car, cdr);
	},
	"cons?": (env, args) => new Bool(args.car() instanceof Cons),
	"symbol?": (env, args) => new Bool(args.car() instanceof Symb),
	"apply": (env, args) => {
		let f = args.car();
		return f.invoke(env, args.cdr().car());
	},
	"nil?": (env, args) => {
		return new Bool(args.car() === NIL)
	},
	"vararg": (parentEnv, parentArgs) => 
		Fn.lambda((env, args) => {
			let vf = parentArgs.car();
			return vf.invoke(env, new Cons(args));
		}),
	"read-file": (env, args) => {
		let text = require('fs').readFileSync(args.car().strVal(), "utf-8");
		let r = read(`(do ${text})`);
		return r;
	},
	"load-file": (env, args) => {
		let form = global_fns["read-file"](env, args);
		return _eval(env, form);
	},
	"die": (env, args) => null,
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
			return Env.bindGlobal(b, _eval(env, v));
		case "quote":
			return form.car()
		case "fn":
			let fn = (_, args) => {
				let params = form.car();

				let lambdaEnv = env;

				let p = params;
				let a = args;
				while (p != NIL) {
					let symb = p.car();
					lambdaEnv = lambdaEnv.bind(symb, a.car());

					p = p.cdr();
					a = a.cdr();
				}

				let body = form.cdr();
				let b = body;
				let r = NIL;

				while (b != NIL) {
					r = _eval(lambdaEnv, b.car());
					b = b.cdr();
				}

				return r;
			}
			return Fn.lambda(fn);
		case "resolve":
			return Env.lookupGlobal(form.car());
		case "cond":
			let pair = form

			while (pair != NIL) {
				let testf = pair.car();
				let exprf = pair.cdr().car();
				if (truthy(_eval(env, testf))) {
					return _eval(env, exprf);
				}
				pair = pair.cdr().cdr();
			}
			throw new Error("No matching clause in cond");
		case "let":
			let binds = form.car();
			let letEnv = env;

			while (binds != NIL) {
				let s = binds.car();
				let v = binds.cdr().car();
				letEnv = letEnv.bind(s, _eval(letEnv, v));
				binds = binds.cdr().cdr();
			}

			let body = form.cdr();
			let b1 = body;
			let r = NIL;
			while (b1 != NIL) {
				r = _eval(letEnv, b1.car())
				b1 = body.cdr();
			}
			return r;
		default: return evalApply(env, _eval(env, symb), form);
	}
}

function _eval(env, form) {
	if (form instanceof Cons) {
		if (form.car() instanceof Symb) {
			return evalSexpr(env, form.car(), form.cdr());
		}
		return evalApply(env, _eval(env, form.car()), form.cdr());
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
	Env,
	resetGlobals
}