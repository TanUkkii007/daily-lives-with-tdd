'use strict';

describe('07. format', function() {
  function format(f) {
    var formatRegExp = /%[sdj%]/g;
    if (typeof f !== 'string') {
      var objects = [];
      for (var i = 0; i < arguments.length; i++) {
        objects.push(String(arguments[i]));
      }
      return objects.join(' ');
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      switch (x) {
        case '%s': return String(args[i++]);
        case '%d': return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
        default:
          return x;
      }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
      str += ' ' + x;
    }
    return str;
  }

  it('format("%s")は%sを文字列に置換する', function() {
    expect(format('%s', 'abc')).toBe('abc');
  });

  it('format(%d)は%dを数字に置換する', function() {
    expect(format('%d', 123)).toBe('123');
  });

  it('format("%d * %d * 1000 = %s")', function() {
    expect(format('%d * %d * 1000 = %s', 2, 3, '6e+3')).toBe('2 * 3 * 1000 = 6e+3');
  });

  it('format(%j)は%jをJSON形式に整形して置換する', function() {
    expect(format('%j', {array: [1,2,3]})).toBe(JSON.stringify({array: [1,2,3]}));
  });

  it('format(%j)は対象が循環参照を含む場合[Circular]となる', function() {
    var circular = {a: 1, b: 2};
    circular.ab = circular;
    expect(format('%j', circular)).toBe('[Circular]');
  });

  it('formatは置換するプレースホルダーがないと単にスペースで結合する', function() {
    expect(format(1,2,3)).toBe('1 2 3');
  });

  it('formatは置換引数が超過している場合、スペースで結合する', function() {
    expect(format('trafic light: %s', 'red', 'yellow', 'blue')).toBe('trafic light: red yellow blue');
  });

  it('formatは置換引数が足りない場合置換しない', function() {
    expect(format('trafic light: %s %s %s %s', 'red', 'yellow', 'blue')).toBe('trafic light: red yellow blue %s');
  });
});