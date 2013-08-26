var should = require('should')
  , utils = require('../src/utils')
	, config = require('../src/config')
  , file = {
      'all': {
          'host': 'localhost'
        , 'port': '1080'
        , 'username': 'username'
        , 'password': 'password'
        , 'noProxy': ['localhost']
      }
    , 'http': {
      'username': 'marilina'
    }
    , 'ftp': {
        'port': '1234'
      , 'host': 'dominio.daniele.za'
    }
  };

describe('config.load', function(){
  utils.json.write('./data/config1.json', file);
  it('should fill only protocol specified in config file', function() {
    var conf = config();
    conf.load('./data/config1.json');
    conf.should.not.have.property('https');
    conf.should.not.have.property('socks');
    conf.http.should.have.property('username', 'marilina');
    conf.ftp.should.have.property('port', '1234');
    conf.ftp.should.have.property('host', 'dominio.daniele.za');
  });

  describe('when only `all` attribute is set', function() {
    delete file.ftp;
    delete file.http;
    utils.json.write('./data/config2.json', file);
    it('should fill all protocol', function() {
      var conf = config();
      conf.load('./data/config2.json');
      conf.should.have.property('https');
      conf.should.have.property('socks');
      conf.should.have.property('http');
      conf.should.have.property('ftp');
    });
  });

  describe('when `all` attribute is not set', function() {
    it('should not fill anything', function() {
      var conf = config();
      conf.reset();
      conf.http = {
          'host': 'localhost'
        , 'port': '1080'
        , 'username': 'username'
        , 'password': 'password'
        , 'noProxy': ['localhost']
      };

      conf.fill().should.be.ok;

      conf.should.not.have.property('https');
      conf.should.not.have.property('socks');
      conf.should.have.property('http');
      conf.should.not.have.property('ftp');
    })
  });

  describe('when config file has no attributes', function() {
    it('should return false', function() {
      var conf = config();
      conf.reset();
      
      conf.fill().should.not.be.ok;
    })
  });

});