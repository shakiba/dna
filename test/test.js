var expect = require('expect.js');
var path = require('path');
var FS = require('fs');
var DNA = require('../');

describe('DNA', function() {

  it('parse', function() {
    var input = readFileSync('basic.dna');
    var output = readFileSync('basic.json');
    output = JSON.parse(output);
    input = DNA.parse(input);
    expect(input).eql(output);
  });

  it('stringify', function() {
    var obj = readFileSync('basic.json');
    obj = JSON.parse(obj);

    obj = DNA.stringify(obj);

    console.log(obj);
  });

  function readFileSync(name) {
    return FS.readFileSync(path.resolve(__dirname, name), 'utf8');
  }
});