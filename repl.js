const readline = require('readline');

const { NIL } = require("./types");
const { KikiReader } = require("./reader");

const k = require("./kiki");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});

rl.prompt();

const env = new k.Env();

function readEvalPrint(text) {
  let reader = new KikiReader(text);
  let cons = reader.read();
  let result = NIL;
  while (cons != NIL) {
    let car = cons.car();
    result = k._eval(env, car);
    cons = cons.cdr();
  }
  console.log(result.toString());
}

rl.on('line', function (text) {
  try {
    readEvalPrint(text);
  } catch (e) {
    console.error(e);
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

