const { KikiReader } = require("../reader");
var assert = require('assert');

function read(text) {
	return new KikiReader(text).read().toString();
}

describe("reader", () => {

	it('read digit', () => {
		// assert.equal(read('1'), "( 1 )");
		// assert.equal(read('12'), "( 12 )");
		assert.equal(read('12 34'), "( 12 34 )");
	});

	it('read symbol', () => {
		assert.equal(read('a'), "( a )");
		assert.equal(read('true '), "( true )");
		assert.equal(read('false nil'), "( false nil )");
	});

	it('read string', () => {
		// TODO error for not closed strings
		assert.equal(read('""'), '( "" )');
		assert.equal(read('"a" "b"'), '( "a" "b" )');
		assert.equal(read('"abc" "dfg"'), '( "abc" "dfg" )');
	});

	it('read list', () => {
		assert.equal(read('(1)'), '( ( 1 ) )');
		assert.equal(read('[1]'), '( ( 1 ) )');
		assert.equal(read('(1 2)'), '( ( 1 2 ) )');
		assert.equal(read('(1   2)'), '( ( 1 2 ) )');
		assert.equal(read('(1 2 (true false))'), '( ( 1 2 ( true false ) ) )');
	});

	it('quote', () => {
		assert.equal(read("'a"), '( ( quote a ) )');
	})

	// TODO comments

});