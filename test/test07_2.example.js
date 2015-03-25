'use strict';

describe('07_2. format', function() {
  function concat(array) {
    var objects = [];
    for (var i = 0; i < array.length; i++) {
      objects.push(String(array[i]));
    }
    return objects.join(' ');
  }

  function stringFormat(s) {
    return String(s);
  }

  function numberFormat(d) {
    return Number(d);
  }

  function jsonFormat(j) {
    try {
      return JSON.stringify(j);
    } catch (_) {
      return '[Circular]';
    }
  }

  function formatWith(type, value) {
    switch (type) {
      case '%s': return String(value);
      case '%d': return Number(value);
      case '%j': return jsonFormat(value);
      default:
        return type;
    }
  }

  function format(f) {
    var formatRegExp = /%[sdj%]/g;
    if (typeof f !== 'string') {
      return concat(arguments);
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      return formatWith(x, args[i++]);
    });
    
    if (i < len) {
      str += ' ' + concat(Array.prototype.slice.call(args, i));
    }

    return str;
  }

  describe('concat', function() {
    it('concat', function() {
      expect(concat([1,2,3,4,5])).toBe('1 2 3 4 5');
    });
  });

  describe('stringFormat', function() {
    it('stringFormat', function() {
      expect(stringFormat(12345)).toBe('12345');
    });
    it('stringFormat', function() {
      expect(stringFormat('12345')).toBe('12345');
    });
    it('stringFormat', function() {
      expect(stringFormat([1,2,3,4,5])).toBe('1,2,3,4,5');
    });
    it('stringFormat', function() {
      expect(stringFormat(true)).toBe('true');
    });
  });

  describe('numberFormat', function() {
    it('numberFormat', function() {
      expect(numberFormat(12345)).toBe(12345);
    });
    it('numberFormat', function() {
      expect(numberFormat('12345')).toBe(12345);
    });
    it('numberFormat', function() {
      expect(numberFormat([1,2,3,4,5])).toBeNaN();
    });
    it('numberFormat', function() {
      expect(numberFormat(true)).toBe(1);
    });
  });

  describe('jsonFormat', function() {
    it('jsonFormat', function() {
      expect(jsonFormat(12345)).toBe('12345');
    });
    it('jsonFormat', function() {
      expect(jsonFormat('12345')).toBe('"12345"');
    });
    it('jsonFormat', function() {
      expect(jsonFormat([1,2,3,4,5])).toBe('[1,2,3,4,5]');
    });
    it('jsonFormat', function() {
      expect(jsonFormat(true)).toBe('true');
    });
    it('jsonFormat', function() {
      expect(jsonFormat({a: 1, b: 'b', c: ['d']})).toBe('{"a":1,"b":"b","c":["d"]}');
    });
    it('jsonFormat', function() {
      var circular = {a: 1, b: 2};
      circular.ab = circular;
      expect(jsonFormat(circular)).toBe('[Circular]');
    });
  });

  describe('formatWith', function() {
    it('formatWith', function() {
      expect(formatWith('%s', 12345)).toBe('12345');
    });
    it('formatWith', function() {
      expect(formatWith('%d', '12345')).toBe(12345);
    });
    it('formatWith', function() {
      expect(formatWith('%j', {a: 1, b: 'b', c: ['d']})).toBe('{"a":1,"b":"b","c":["d"]}');
    });
  });

  describe('format', function() {
    it('format("%d * %d * 1000 = %s")', function() {
      expect(format('%j * %d = %s', {numer: 1, denom: 6}, 2, '1/3')).toBe('{"numer":1,"denom":6} * 2 = 1/3');
    });
  
    it('formatは置換するプレースホルダーがないと単にスペースで結合する', function() {
      expect(format(1,2,3)).toBe(concat([1,2,3]));
    });
  
    it('formatは置換引数が超過している場合、スペースで結合する', function() {
      expect(format('trafic light: %s', 'red', 'yellow', 'blue')).toBe('trafic light: red ' + concat(['yellow', 'blue']));
    });
  
    it('formatは置換引数が足りない場合置換しない', function() {
      expect(format('trafic light: %s %s %s %s', 'red', 'yellow', 'blue')).toBe('trafic light: red yellow blue %s');
    });
  });
});