'use strict';

describe('06. trim(string)', function() {
  
  var trim = require('./trim.example');

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