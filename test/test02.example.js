'use strict';

describe('02. trim(string)', function() {

  function trim(string) {
    if (string[0] === ' ') {
      string = string.slice(1);
    }
    if (string.endsWith(' ')) {
      string = string.slice(0, string.length - 1);
    }
    return string;
  }

  it('trim(string)はstringの両端の空白を取り除く', function() {
    expect(trim(' abcde ')).toBe('abcde');
  });

  it('trim(string)はstringの両端の複数の空白を取り除く', function() {
    expect(trim('   abcde   ')).toBe('abcde');
  });

});