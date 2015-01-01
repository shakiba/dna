var should = require('should');
var path = require('path');
var fs = require('fs');
var metafile = require('../meta-file');

var cases = [ 'basic' ];

describe('meta-file', function() {

  it('sync', function() {

    cases.forEach(function(name) {
      console.log(name);

      var meta = __dirname + '/cases/' + name + '.meta';
      var json = __dirname + '/cases/' + name + '.json';

      meta = fs.readFileSync(meta, 'utf8');
      json = fs.readFileSync(json, 'utf8');

      json = JSON.parse(json);
      meta = metafile.parse(meta);

      // console.log(json);
      // console.log(meta);

      meta.should.eql(json);
    });

  });

});