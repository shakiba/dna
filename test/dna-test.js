var should = require('should');
var path = require('path');
var fs = require('fs');
var dna = require('../dna');

describe('DNA', function() {

  it('simple', function() {

    var input = fs.readFileSync(__dirname + '/cases/basic.dna', 'utf8');
    var output = fs.readFileSync(__dirname + '/cases/basic.json', 'utf8');

    output = JSON.parse(output);
    input = dna.parse(input);

    // console.log(json);
    // console.log(dna);

    input.should.eql(output);

  });

  it('plugin', function() {

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

    var input = fs.readFileSync(__dirname + '/cases/plugin.dna', 'utf8');
    var output = fs.readFileSync(__dirname + '/cases/plugin.json', 'utf8');

    output = JSON.parse(output);
    input = mf.parse(input);

    // console.log(json);
    // console.log(dna);

    input.should.eql(output);

  });

});