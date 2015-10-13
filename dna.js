/*
 * DNA - Human-readable data format
 *
 * Copyright (c) 2015 Ali Shakiba
 * Available under the MIT license
 */

var DNA = (function config(options) {
  options = options || {};

  var debug = options.debug || false;

  function parse(input) {
    var stream = new InputStream(input);
    return read(stream, 0);
  }

  // one-pass post-order recursive read
  function read(stream, indent) {

    var data = null, text = null;

    debug && console.log(indent);

    // next line
    while (!stream.eof) {

      // if line is less indented (and not empty) return to parent context
      debug && console.log('?', stream.line);
      if (stream.text && stream.indent < indent) {
        break;
      }

      // consume current line
      var line = stream.shift();

      if (line.key) {
        // use as object or array
        data = data || {};
        debug && console.log('.', line.key);

        var value = line.value;

        // if next line is more indented read it as value
        if (!stream.eof) {
          debug && console.log('>', stream.line);
          if (stream.indent > indent) {
            value = read(stream, stream.indent);
          }
        }

        if (line.pipe == 'list') {
          debug && console.log('@list');
          if (!isArray(data)) {
            data[line.key] = line.key in data ? [ data[line.key] ] : [];
          }
        }
        multimapSet(data, line.key, value);

      } else {
        // line contains a string, it is multiline string
        text = text || [];
        debug && console.log('+', line.text);
        text.push(line.text);
      }

      debug && console.log('=', data, text);
    }

    var result = data || (text && text.join('\n').replace(/\n$/, ''));
    debug && console.log('<<', JSON.stringify(result));
    return result;
  }

  function InputStream(input) {

    if (typeof input === 'string') {
      input = input.split(/\n/);
    }

    if (input.length) {
      var array = input;
      var i = 0;
      input = {
        hasNext : function() {
          return array.length > i;
        },
        next : function() {
          return array.length > i ? array[i++] : undefined;
        }
      };
    }

    this.shift = function() {
      var first = {};
      for ( var key in this) {
        if ('shift' !== key && 'eof' !== key) {
          first[key] = this[key];
          delete this[key];
        }
      }
      if (input.hasNext()) {
        var line = input.next();
        this.line = line;
        var regex = /^(\s*)(.*)$/.exec(line);
        this.indent = regex[1].length;
        this.text = regex[2];
        if (regex = /^((\w|\-)+)\:\s*(.*)/.exec(this.text)) {
          // key: value
          this.key = regex[1];
          this.value = regex[3];
        } else if (regex = /^((\w|\-)*)[@|]((\w|\-)+)\:\s*(.*)/.exec(this.text)) {
          // key@pipe: value
          this.key = regex[1];
          this.pipe = regex[3];
          this.value = regex[5];
        }
        this.eof = false;
      } else {
        this.eof = true;
      }
      return first;
    };

    this.shift();
  }

  function stringify(obj, replacer, space) {
    if (typeof replacer === 'string') {
      space = replacer;
      replacer = null;
    } else if (typeof replacer !== 'function') {
      replacer = null;
    }
    if (typeof space !== 'string' || !/^\s+$/.test(space)) {
      space = '  ';
    }

    var output = [];
    var ctx = {
      space : space,
      replacer : replacer,
      cycle : [],
      mark : function(value) {
        if (indexOf(ctx.cycle, value) === -1) {
          ctx.cycle.push(value);
          return true;
        } else {
          return false;
        }
      },
      push : function(value) {
        output.push(value);
      }
    };

    if (obj === null || typeof obj === 'undefined') {

    } else if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        write(ctx, '', i + ':', obj[i]);
      }
    } else if (typeof obj === 'object') {
      for ( var key in obj) {
        write(ctx, '', key + ':', obj[key]);
      }
    } else {
      ctx.push(obj);
    }

    return output.join('\n');
  }

  function write(ctx, space, name, value) {
    if (value === null || typeof value === 'undefined') {
      ctx.push(space + name);

    } else if (isArray(value)) {
      if (ctx.mark(value)) {
        for (var i = 0; i < value.length; i++) {
          write(ctx, space, name, value[i]);
        }
      }

    } else if (typeof value === 'object') {
      if (ctx.mark(value)) {
        ctx.push(space + name);
        for ( var key in value) {
          write(ctx, space + ctx.space, key + ':', value[key]);
        }
      }

    } else if (typeof value === 'string') {
      if (value.indexOf('\n') >= 0) {
        ctx.push(space + name + '\n' + space + ctx.space
            + value.replace(/\n/g, '\n' + space + ctx.space));
      } else {
        ctx.push(space + name + ' ' + value);
      }

    } else {
      ctx.push(space + name + ' ' + value);
    }
  }

  function pipe(name, data, text) {

  }

  return {
    parse : parse,
    stringify : stringify,
    config : config
  };

  function isArray(value) {
    if (!value) {
      return false;
    } else if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return '[object Array]' === Object.prototype.toString.call(value);
    }
  }

  function indexOf(array, item) {
    if (!isArray(array)) {
      return -1;
    } else if (typeof array.indexOf === 'function') {
      return array.indexOf(item);
    } else {
      for (var i = 0; i < array.length; i++) {
        if (item === array[i]) {
          return i;
        }
      }
      return -1;
    }
  }

  function multimapSet(obj, key, value) {
    if (!(key in obj)) {
      obj[key] = value;
    } else if (!isArray(obj[key])) {
      obj[key] = [ obj[key], value ];
    } else {
      obj[key].push(value);
    }
  }
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DNA;
} else if (typeof define === 'function' && define.amd) {
  define(function() {
    return DNA;
  });
} else if (typeof window !== 'undefined') {
  window.DNA = DNA;
}
