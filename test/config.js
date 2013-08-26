var should = require('should')
  , config = require('../src/config')
  , utils = require('../src/utils')
  , path = './data/proxy.json';

describe('config', function() {
	it('should have defaults properties', function() {
		var conf = config();
		conf.should.have.property('all');
		conf.should.have.property('http');
		conf.should.have.property('https');
		conf.should.have.property('ftp');
		conf.should.have.property('socks');
		conf.all.should.have.property('host');
		conf.all.should.have.property('port');
		conf.all.should.have.property('username');
		conf.all.should.have.property('password');
		conf.all.should.have.property('noProxy');
	});

	describe('.fill', function() {
		describe('when defaults properties exists', function(){
			it('should fill globals and return true', function() {
				var conf = config();
				conf.fill().should.be.ok;
			});
		});
		describe('when one or more properties not exists', function(){
			it('should return false', function() {
				var conf = config();
				delete conf.all.username;
				conf.fill().should.not.be.ok;
			});
		});
	});

	describe('.empty', function() {
		it('should create a new conf file', function() {
			var conf = config();
			conf.empty(path).should.be.ok;
			utils.exists(path).should.be.ok;
		});
	});

	describe ('.load', function() {
		it('should load defaults properties from file', function() {
			var conf = config();
			delete conf.all;
			delete conf.http;
			delete conf.https;

			conf.load(path);
			
			conf.should.have.property('all');
			conf.should.have.property('http');
			conf.http.should.be.ok;
			conf.should.have.property('https');
			conf.should.have.property('ftp');
			conf.ftp.should.be.ok;
		});
	});
});