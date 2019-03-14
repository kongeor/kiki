const k = require("../kiki");
var assert = require('assert');


// read eval to string
function res(env, text) {
	return (k._eval(env, k.read(text)).toStr());
}

describe("truth", () => {
	it("if truthy", () => {
		assert.equal(res(null, "(if true 1 2)"), 1);
		assert.equal(res(null, "(if false 1 2)"), 2);
	})
})

// res(null, "(if true 1 2)")