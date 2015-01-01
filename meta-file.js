function config(options) {
  options = options || {};

  function parse(input) {

    var noisy = options.noisy;

    var lines = input.split(/\n/).map(function(line, i) {
      line = {
        line : line
      };
      var regex = /^(\s*)(.*)$/.exec(line.line);
      line.space = regex[1].length;
      line.text = regex[2];
      if (regex = /^((\w|\-)+)\:\s*(.*)/.exec(line.text)) {
        line.key = regex[1];
        line.value = regex[3];
      } else if (regex = /^((\w|\-)*)\.((\w|\-)+)\:\s*(.*)/.exec(line.text)) {
        line.key = regex[1];
        line.meta = regex[3];
        line.value = regex[5];
      }
      return line;
    });

    lines.has = function() {
      return !!lines.length;
    };

    lines.peek = function() {
      if (lines.length) {
        var line = lines[0];
        noisy && console.log('?', line.line);
        return line;
      }
    };

    lines.poll = function() {
      if (lines.length) {
        var line = lines.shift();
        noisy && console.log('-', line.line);
        return line;
      }
    };

    return (function read(space, parent) {
      noisy && console.log('>>');

      var data = null, text = null;

      var plugin = null;

      while (lines.has()) {

        var line = lines.peek();
        if (line.text && line.space < space) {
          break;
        }

        lines.poll();

        var child = line.value;
        if (lines.has()) {
          var next = lines.peek();
          if (next.space > space) {
            child = read(next.space);
          }
        }

        if (line.meta) {

          console.log('.', line.meta, line.value);

          if (line.meta == 'type') {
            if (line.key && line.value == 'list') {
              data = data || {};
              if (!Array.isArray(data[line.key])) {
                data[line.key] = line.key in data ? [ data[line.key] ] : [];
              }
            }
          }

          if (line.meta == 'plugin' && options.plugins) {
            plugin = options.plugins(line.value);
          }

        } else if (line.key) {

          data = data || {};
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

    function assign(obj, key, value) {
      noisy && console.log('+', key, JSON.stringify(value));
      if (!(key in obj)) {
        obj[key] = value;
      } else {
        if (!Array.isArray(obj[key])) {
          obj[key] = [ obj[key] ];
        }
        obj[key].push(value);
      }
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