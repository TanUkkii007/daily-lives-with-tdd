'use strict';

describe('03. trim(string)', function() {

  function trim(string) {
    if (string[0] === ' ') {
      string = string.replace(/^\s+/, '');
    }
    if (string.endsWith(' ')) {
      string = strin.replace(/\s+$/, '');
    }
    return string;
  }

  it('trim(string)はstringの左端の複数の空白を取り除く', function() {
    expect(trim('   abcde')).toBe('abcde');
  });

  it('trim(string)はstringの右端の複数の空白を取り除く', function() {
    expect(trim('abcde   ')).toBe('abcde');
  });

  it('trim(string)はstringの両端の複数の空白を取り除く', function() {
    expect(trim('   abcde   ')).toBe('abcde');
  });

});