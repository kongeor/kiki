const k = require("../kiki");
var assert = require('assert');


// read eval to string
function res(env, text) {
	return (k._eval(env, k.read(text)).toStr());
}

describe("truth", () => {

	let env; 

	beforeEach(() => {
		env = new k.Env();
		k.resetGlobals();
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
	})

})

// res(null, "(if true 1 2)")