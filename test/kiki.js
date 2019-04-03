const k = require("../kiki");
var assert = require('assert');


// read eval to string
function res(env, text) {
	return (k._eval(env, k.read(text)).toString());
}

function reb(env, text) {
	return (k._eval(env, k.read(text)).boolVal());
}

describe("truth", () => {

	let env; 

	beforeEach(() => {
		env = new k.Env();
		k.resetGlobals();
	});

	describe('reader', () => {
		it('reads', () => {
			assert.equal(k.read('1'), 1);
		})
	});

	it('one', () => {
		assert.equal(res(env, '1'), 1);
		assert.equal(res(env, 'inc'), '<Builtin: inc>');
		assert.equal(res(env, '(do (def id (fn [x] x)) id)'), '<Lambda: 1>');
	});

	it("if truthy", () => {
		assert.equal(res(null, "(if true 1 2)"), 1);
		assert.equal(res(null, "(if false 1 2)"), 2);
	})

	it("do", () => {
		assert.equal(res(env, "(do)"), "nil");
		assert.equal(res(env, "(do 1)"), 1);
		assert.equal(res(env, "(do 1 (inc 1))"), 2);
	})

	it("def", () => {
		assert.equal(res(env, "(def a 1)"), "1");
		assert.equal(res(env, "(do (def a 2) a)"), 2);
		assert.equal(res(env, "(do (def a 1) (def inc (fn [x] (+ x 5))) (inc 0))"), 5);
	});

	it("quote", () => {
		assert.equal(res(env, "(quote (1 2))"), "( 1 2 )");
	})

	it("should resolve globals", () => {
		assert.equal(res(env, "(inc 0)"), 1);
		assert.equal(res(env, "(inc (inc 0))"), 2);
	})

	it("lambda", () => {
		assert.equal(res(env, "((fn [x] x) 1)"), "1");
		assert.equal(res(env, "((fn [x y z] (+ x (+ y z))) 1 2 3)"), "6");
	})

	it("resolve", () => {
		assert.equal(res(env, "((resolve inc) 0)"), "1");
	});

	it("cond", () => {
		assert.equal(res(env, "(cond true 1)"), "1");
		assert.equal(res(env, "(cond false 1 true 2)"), "2");
		assert.throws(() => res(env, "(cond false 1)"), Error, "No matching clause in cond");
		// assert.equal(res(env, "(cond false 1 (= 1 (inc 0)) 2)"), "2");
	});

	it("let", () => {
		assert.equal(res(env, "(let [a 1 b 2] (+ a b))"), "3");
		assert.equal(res(env, "(let [a 1 b (+ a 2) c (+ a b)] c)"), "4");
	})

	describe("builtins", () => {
		it("eq", () => {
			assert.equal(reb(env, "(= 0 0)"), true);
			assert.equal(reb(env, "(= 0 1)"), false);
			assert.equal(reb(env, "(= (quote (1 2 3)) (quote (1 2 3)))"), true);
			assert.equal(reb(env, "(= (quote (1 2 3)) (quote (1 2 4)))"), false);
		})

		it("vararg", () => {
			assert.equal(res(env, "((vararg (fn [args] (car args))) 1 2)"), 1);
			assert.equal(res(env, "((vararg (fn [args] (car (cdr args)))) 1 2)"), 2);
		})

		it.skip("read-file", () => {
			assert.equal(res(env, "(do (load-file \"./examples/core.clj\") (map inc (cons 1)))"), 1);
		})
	})

	describe("programs", () => {
		it.skip("ignore whitespace", () => {
			assert.equal(res(env, "  (+ 1 2)   "), 3);
		})
		it("factorial multiline", () => {
			assert.equal(res(env, `(do
				(def fact 
				  (fn [n]
					(if (= n 0)
						1
						(* n (fact (dec n))))))
				(fact 5))`), 120);
		})

		it("factorial", () => {
			assert.equal(res(env, "(do (def fact (fn [n] (if (= n 0) 1 (* n (fact (dec n)))))) (fact 5))"), 120);
		})
	})



})

// res(null, "(if true 1 2)")