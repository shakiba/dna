var path = require('path');
var fs = require('fs');
var DNA = require('./');

cli(process.argv.slice(2));

function cli(params) {

  if (params.length) {

    var cmd = params.shift().toLocaleLowerCase();

    if ('json' === cmd && params.length) {
      var content = fs.readFileSync(params[0], 'utf8');
      content = DNA.parse(content);
      content = JSON.stringify(content, null, ' ');
      console.log(content);
      return;
    }
  }

  console.log('DNA - Human-readable data format');
  console.log('Usage: dna json <dna file>');
  console.log('');

}
