function config(options) {
  options = options || {};

  var noisy = !options.noisy;

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

      var plugin = null;

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

          if (line.meta == 'plugin') {
            plugin = getplugin(line.value);
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
      if (plugin) {
        result = plugin(result);
      }
      noisy && console.log('<<', JSON.stringify(result));
      return result;
    })(0);
  }

  var gotplugin = {};
  function getplugin(name) {
    if (name in gotplugin) {
      return gotplugin[name];
    }
    if (typeof options.plugins === 'function') {
      return gotplugin[name] = options.plugins(name);
    }
    if (typeof options.plugins === 'object') {
      return options.plugins[name];
    }
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

  return {
    parse : parse,
    config : config
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config();
}