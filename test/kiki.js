const k = require("../kiki");
var assert = require('assert');


// read eval to string
function res(env, text) {
	return (k._eval(env, k.read(text)).toStr());
}

describe("truth", () => {

	let env; 

	before(() => {
		env = new k.Env();
	});

	it("if truthy", () => {
		assert.equal(res(null, "(if true 1 2)"), 1);
		assert.equal(res(null, "(if false 1 2)"), 2);
	})

	it.only("should resolve globals", () => {
		assert.equal(res(env, "(inc 0)"), 1);
		assert.equal(res(env, "(inc (inc 0))"), 2);
	})

})

// res(null, "(if true 1 2)")