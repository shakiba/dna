var should = require('should');
var path = require('path');
var fs = require('fs');
var metafile = require('../meta-file');

describe('meta-file', function() {

  it('simple', function() {

    var meta = fs.readFileSync(__dirname + '/cases/basic.meta', 'utf8');
    var json = fs.readFileSync(__dirname + '/cases/basic.json', 'utf8');

    json = JSON.parse(json);
    meta = metafile.parse(meta);

    // console.log(json);
    // console.log(meta);

    meta.should.eql(json);

  });

  it('plugin', function() {

    var mf = metafile.config({
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

    var meta = fs.readFileSync(__dirname + '/cases/plugin.meta', 'utf8');
    var json = fs.readFileSync(__dirname + '/cases/plugin.json', 'utf8');

    json = JSON.parse(json);
    meta = mf.parse(meta);

    // console.log(json);
    // console.log(meta);

    meta.should.eql(json);

  });

});