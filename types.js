class Num {
	constructor(n) {
		this.n = n;
	}

	numVal() {
		return this.n
	}

	toStr() {
		return this.n;
	}
}

class SymbolRegistry {
	constructor() {
		this._registry = {};
	}
	
	intern(str) {
		let s = this._registry[str];
		if (s) {
			return s;
		} else {
			let symb = new Symb(str);
			this._registry[str] = symb;
			return symb;
		}
	}
}

symbol_registry = new SymbolRegistry();

class Symb {
	constructor(s) {
		this.s = s;
	}

	name() {
		return this.s;
	}

	static intern(str) {
		return symbol_registry.intern(str);
	}

	toStr() {
		return this.s;
	}
}

class Bool {
	constructor(b) {
		this.b = b;
	}

	boolVal() {
		return this.b;
	}

	toStr() {
		return this.b;
	}
}

const T = new Bool(true);
const F = new Bool(false);

class Nil {
	constructor() {}

	toStr() {
		return "nil";
	}
}

const NIL = new Nil("nil");

class Fn {

	constructor(name, fn, idx) {
		this._name = name;
		this._fn = fn;
		this._idx = idx;
	}

	invoke(env, args) {
		return this._fn(env, args);
	}

	static anonymous() {

	}

	static builtin(name, fn) {
		return new Fn(name, fn);
	}

	toStr() {
		return `<Builtin: ${this._name}>`;
	}
}

class Cons {
	constructor(car, cdr) {
		this._car = car;
		this._cdr = cdr;
	}

	static fromArray(arr) {
		let cons = NIL;
		for (let i=arr.length - 1; i >= 0; i--) {
			cons = new Cons(arr[i], cons);
		}
		return cons;
	}

	car() {
		return this._car;
	}

	cdr() {
		return this._cdr;
	}

	*[Symbol.iterator]() {
		let curr = this;
		while (curr != NIL) {
			yield curr._car;
			if (curr._cdr instanceof Cons) {
				curr = curr._cdr;
			} else {
				// yield this._cdr;
				curr = NIL;
			}
		}
	}

	_toStr() {
		if (this._cdr instanceof Cons) {
			return this._car.toStr() + " " + this._cdr._toStr();
		} else if (this._cdr == NIL) {
			return this._car.toStr();
		}
		return this._car.toStr() + " . " + this._cdr.toStr();
	}

	toStr() {
		return "( " + this._toStr() + " )";
	}
}

function parseSymbol(arr) {
	let s = arr[0].text;
	switch(s) {
		case "true": return T;
		case "false": return F;
		case "nil": return NIL;
		default: return Symb.intern(s);
	}
}

function parseNumber(n) {
	return new Num(parseInt(n[0].value));
}

function parseList(d) {
	let car = d[2][0][0];
	if (!car) {
		car = d[2][0];
	}
	let arr = [];
	arr.push(car);

	let idx = 0;
	let e = d[3][idx];
	while(e) {
		if (e[1][0][0]) {
			arr.push(e[1][0][0]);
		} else {
			arr.push(e[1][0])
		}
		idx++;
		e = d[3][idx];
	}
	// return new Cons(car, cdr);
    return Cons.fromArray(arr);
}

module.exports = {
	Num,
	Symb,
	Cons,
	Bool,
	Fn,
	NIL,
	parseSymbol,
	parseList,
	parseNumber
}
