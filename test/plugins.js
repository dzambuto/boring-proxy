var should = require('should')
	, apt = require('../plugins/apt')
  , bash = require('../plugins/bash')
  , npm = require('../plugins/npm')
  , config = require('../src/config')
  , program = { 'option': function() {} };

describe('apt plugin', function() {
  it('should write apt.conf', function() {
    var plugin = apt(program)
      , conf = config();

    plugin.file = '/home/daniele/git-projects/boring-proxy.git/tmp/apt.conf';

    conf.all = {
        'host': '172.16.65.140'
      , 'port': 8080
      , 'username': 'daniele.zambuto'
      , 'password': 'daniele'
    };
    conf.fill();
    plugin(conf).should.be.ok;
  });
});

describe('bash plugin', function() {
  it('should write /etc/environment', function() {
    var plugin = bash(program)
      , conf = config();

    plugin.file = '/home/daniele/git-projects/boring-proxy.git/tmp/environment';

    conf.all = {
        'host': '172.16.65.140'
      , 'port': 8080
      , 'username': 'daniele.zambuto'
      , 'password': 'daniele'
    };

    conf.https = {
      'httpOnly': true
    };

    conf.fill();
    plugin(conf).should.be.ok;
  });
});

describe('npm plugin', function() {
  it('should write .npmrc', function() {
    var plugin = npm(program)
      , conf = config();

    plugin.file = '/home/daniele/git-projects/boring-proxy.git/tmp/npmrc';

    conf.all = {
        'host': '172.16.65.140'
      , 'port': 8080
      , 'username': 'daniele.zambuto'
      , 'password': 'daniele'
    };
    conf.fill();
    plugin(conf).should.be.ok;
  });
});

