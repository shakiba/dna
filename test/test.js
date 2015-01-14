var should = require('should');
var path = require('path');
var fs = require('fs');
var dna = require('../');

describe('DNA', function() {

  it('Basic', function() {

    var input = readFileSync('basic.dna');
    var output = readFileSync('basic.json');

    output = JSON.parse(output);
    input = dna.parse(input);

    // console.log(input);
    // console.log(output);

    input.should.eql(output);

  });

  function readFileSync(name) {
    return fs.readFileSync(path.resolve(__dirname, name), 'utf8');
  }
});