const readline = require('readline');

const k = require("./kiki");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});

rl.prompt();

const env = new k.Env();

rl.on('line', function (text) {
  try {
    let r = k._eval(env, k.read(text)).toString()
    console.log(r);
  } catch (e) {
    console.error(e);
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

