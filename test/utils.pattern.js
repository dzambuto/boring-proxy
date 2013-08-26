var should = require('should')
  , pattern = require('../src/utils').pattern
  , config = {
      'host': '172.16.65.140'
    , 'port': '8080'
    , 'username': 'daniele.zambuto'
    , 'password': 'daniele'
    , 'protocol': 'http'
    , 'noProxy': ['localhost', '127.0.0.1', 'localaddress', '.localdomain.com']
    , 'httpOnly': ''
  };


describe('utils.pattern', function(){
  describe('.compile', function() {
    it('should replace all placeholders in a pattern (apt test)', function() {
      var str = 'Acquire::http::proxy "http://daniele.zambuto:daniele@172.16.65.140:8080"';
      var tpl = 'Acquire::#{protocol}::proxy "#{protocol}://#{username}:#{password}@#{host}:#{port}"';
      pattern.compile(tpl, config).should.be.equal(str);
    });

    it('should replace all placeholders in a pattern (env test)', function() {
      var str = 'http_proxy="http://daniele.zambuto:daniele@172.16.65.140:8080"';
      var tpl = '#{protocol}_proxy="#{protocol}://#{username}:#{password}@#{host}:#{port}"';
      pattern.compile(tpl, config).should.be.equal(str);
    });

    it('should support partials (env test)', function() {
      var str = 'http_proxy="http://#{username}:#{password}@#{host}:#{port}"';
      var tpl = '#{protocol}_proxy="#{protocol}://#{username}:#{password}@#{host}:#{port}"';
      pattern.compile(tpl, {'protocol': 'http'}).should.be.equal(str);
    });

    it('should join array params with specified separator (env test)', function() {
      var str = 'no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com"';
      var tpl = 'no_proxy="#{noProxy(,)}"';
      pattern.compile(tpl, config).should.be.equal(str);
    });

    it('should join array with comma if not specified (env test)', function() {
      var str = 'no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com"';
      var tpl = 'no_proxy="#{noProxy()}"';
      pattern.compile(tpl, config).should.be.equal(str);
    });
  });

  describe('.clean', function() {
    it('should remove line that match a pattern (apt test)', function() {
      var str = 'Acquire::http::proxy "http://daniele.zambuto:daniele@172.16.65.140:8080"' + "\n"
        + 'http_proxy="http://daniele.zambuto:daniele@172.16.65.140:8080"' + "\n"
        + 'Acquire::ftp::proxy "http://daniele.zambuto:daniele@172.16.65.140:8080"'
        + 'ftp_proxy="ftp://daniele.zambuto:daniele@172.16.65.140:8080"';
      
      var tpl = 'Acquire::#{protocol}::proxy "#{protocol}://#{username}:#{password}@#{host}:#{port}"';
      
      var res = 'http_proxy="http://daniele.zambuto:daniele@172.16.65.140:8080"' + "\n" 
        + 'ftp_proxy="ftp://daniele.zambuto:daniele@172.16.65.140:8080"';

      pattern.clean(tpl, str).should.be.equal(res);
    });

    it('should remove line that match a pattern (env test)', function() {
      var str = 'Acquire::http::proxy "http://daniele.zambuto:daniele@172.16.65.140:8080"' + "\n"
        + 'http_proxy="http://daniele.zambuto:daniele@172.16.65.140:8080"' + "\n"
        + 'Acquire::ftp::proxy "http://daniele.zambuto:daniele@172.16.65.140:8080"'
        + 'ftp_proxy="ftp://daniele.zambuto:daniele@172.16.65.140:8080"';
      
      var tpl = '#{protocol}_proxy="#{protocol}://#{username}:#{password}@#{host}:#{port}"';
      
      var res = 'Acquire::http::proxy "http://daniele.zambuto:daniele@172.16.65.140:8080"' + "\n"
        + 'Acquire::ftp::proxy "http://daniele.zambuto:daniele@172.16.65.140:8080"'

      pattern.clean(tpl, str).should.be.equal(res);
    });

  });
});