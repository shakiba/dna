var expect = require('expect.js');
var path = require('path');
var FS = require('fs');
var DNA = require('../');

describe('DNA', function() {

  it('parse', function() {
    var dna = readFileSync('basic.dna');
    var json = readFileSync('basic.json');
    json = JSON.parse(json);
    dna = DNA.parse(dna);
    expect(dna).eql(json);
  });

  it('stringify', function() {
    var json = readFileSync('basic.json');
    var dna = readFileSync('basic.dna');
    json = JSON.parse(json);
    json = DNA.stringify(json);
    expect(json.replace(/\s+/g, ' ')).eql(dna.replace(/\s+/g, ' '));
  });

  function readFileSync(name) {
    return FS.readFileSync(path.resolve(__dirname, name), 'utf8');
  }
});