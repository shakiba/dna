/*
 * DNA - Human-readable data format
 *
 * Copyright (c) 2015 Ali Shakiba
 * Available under the MIT license
 */

function config(options) {
  options = options || {};

  var noisy = options.noisy;

  function wrap(input) {

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

    if (input.hasNext && input.next) {
      var last = null;
      return {
        has : function() {
          return last !== null || input.hasNext();
        },
        peek : function() {
          if (last === null) {
            last = new Line(input.next());
          }
          return last;
        },
        poll : function() {
          if (last === null) {
            return new Line(input.next());
          }
          var line;
          line = last;
          last = null;
          return line;
        }
      };
    }
  }

  function Line(line) {
    this.line = line;
    var regex = /^(\s*)(.*)$/.exec(line);
    this.space = regex[1].length;
    this.text = regex[2];
    if (regex = /^((\w|\-)+)\:\s*(.*)/.exec(this.text)) {
      this.key = regex[1];
      this.value = regex[3];
    } else if (regex = /^((\w|\-)*)\.((\w|\-)+)\:\s*(.*)/.exec(this.text)) {
      this.key = regex[1];
      this.meta = regex[3];
      this.value = regex[5];
    }
  }

  function parse(input) {

    input = wrap(input);

    return (function read(space, parent) {
      noisy && console.log('>>');

      var data = null, text = null;

      while (input.has()) {

        var line = input.peek();
        noisy && console.log('?', line.line);
        if (line.text && line.space < space) {
          break;
        }

        input.poll();
        noisy && console.log('-', line.line);

        var child = line.value;
        if (input.has()) {
          var next = input.peek();
          noisy && console.log('?', next.line);
          if (next.space > space) {
            child = read(next.space);
          }
        }

        if (line.meta) {

          noisy && console.log('.', line.meta, line.value);

          if (line.meta == 'type') {
            if (line.key && line.value == 'list') {
              data = data || {};
              if (!Array.isArray(data[line.key])) {
                data[line.key] = line.key in data ? [ data[line.key] ] : [];
              }
            }
          }

        } else if (line.key) {

          data = data || {};
          noisy && console.log('+', line.key, JSON.stringify(line.value));
          assign(data, line.key, line.value || child);

        } else {
          text = text || [];
          text.push(line.text);
          // line.text && (istext = true);
        }

        noisy && console.log('=', JSON.stringify(data), JSON.stringify(text));
      }

      var result = data || text && text.join('\n').replace(/\n$/, '');
      noisy && console.log('<<', JSON.stringify(result));
      return result;
    })(0);
  }

  function assign(obj, key, value) {
    if (!(key in obj)) {
      obj[key] = value;
    } else {
      if (!Array.isArray(obj[key])) {
        obj[key] = [ obj[key] ];
      }
      obj[key].push(value);
    }
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
        if (ctx.cycle.indexOf(value) === -1) {
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

    } else if (Array.isArray(obj)) {
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

    } else if (Array.isArray(value)) {
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

  return {
    parse : parse,
    stringify : stringify,
    config : config
  };
}

// Array.isArray, array.indexOf

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config();
}