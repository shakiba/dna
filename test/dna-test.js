var should = require('should');
var path = require('path');
var fs = require('fs');
var dna = require('../dna');

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

  it('Plugin', function() {

    var mf = dna.config({
      plugins : function(plugin) {
        return function convert(data) {
          if (typeof data === 'string') {
            if (plugin == 'prefix') {
              return '-' + data;
            } else if (plugin == 'postfix') {
              return data + '-';
            }
          } else if (typeof data === 'object') {
            for ( var key in data)
              if (data.hasOwnProperty(key))
                data[key] = convert(data[key]);
          } else if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++)
              data[i] = convert(data[i]);
          }
          return data;
        };
      }
    });

    var input = readFileSync('plugin.dna');
    var output = readFileSync('plugin.json');

    output = JSON.parse(output);
    input = mf.parse(input);

    // console.log(input);
    // console.log(output);

    input.should.eql(output);

  });

  function readFileSync(name) {
    return fs.readFileSync(path.resolve(__dirname, name), 'utf8');
  }
});