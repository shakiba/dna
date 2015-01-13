var should = require('should');
var path = require('path');
var fs = require('fs');
var dnafile = require('../dna-file');

describe('dna-file', function() {

  it('simple', function() {

    var dna = fs.readFileSync(__dirname + '/cases/basic.dna', 'utf8');
    var json = fs.readFileSync(__dirname + '/cases/basic.json', 'utf8');

    json = JSON.parse(json);
    dna = dnafile.parse(dna);

    // console.log(json);
    // console.log(dna);

    dna.should.eql(json);

  });

  it('plugin', function() {

    var mf = dnafile.config({
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

    var dna = fs.readFileSync(__dirname + '/cases/plugin.dna', 'utf8');
    var json = fs.readFileSync(__dirname + '/cases/plugin.json', 'utf8');

    json = JSON.parse(json);
    dna = mf.parse(dna);

    // console.log(json);
    // console.log(dna);

    dna.should.eql(json);

  });

});