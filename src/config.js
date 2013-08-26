
/**
 * Module dependencies.
 */

var utils = require('./utils.js');

exports = module.exports = function createConfig() {
	var config = utils.extend({}, defaults(), proto);
	return config;
}

function defaults() {
	return {
			'all': {
			  	'host': 'localhost'
				, 'port': '1080'
				, 'username': 'username'
				, 'password': 'password'
				, 'noProxy': ['localhost']
			}
		, 'http': {}
		, 'https': {}
		, 'ftp': {}
		, 'socks': {}

	};
}

var proto = {};

proto.load = function(path) {
	var props = utils.json.read(path);
	this.reset();
	utils.properties.extend(this, props);
	return this.fill();
};

proto.reset = function() {
	var self = this;
	Object.keys(utils.properties(this)).forEach(function(prop) {
		delete self[prop];
	});
};

proto.empty = function(path) {
	utils.json.write(path, defaults());
	return true;
};

proto.fill = function() {
	var protocols = ['http', 'https', 'ftp', 'socks']
		, self = this
		, config
		, res = true;

	this.globals();

	protocols.forEach(function(protocol) {
		config = self[protocol];
		res = config ? res && checkConfig(config) : res;
	});

	return res;
};

proto.url = function(prt) {
	return prt + '://' + username + ':' + password + '@' + host + ':' + port;
};

proto.globals = function() {
	var protocols = [true, 'http', 'https', 'ftp', 'socks']
		, global = this['all']
		, self = this;

	var fillAll = protocols.reduce(function(res, protocol){
		return res && !self[protocol];
	});

	if(fillAll)
		protocols.forEach(function(protocol, i) {
			if(i > 0) self[protocol] = {};
		});

	protocols.forEach(function(protocol) {
		if('object' == typeof self[protocol] && Object.keys(self[protocol]).length >= 0) 
			self[protocol] = utils.defaults(self[protocol], global);
	});

	return !fillAll && !global;
};

function checkConfig(config) {
	var defaults = ['host', 'port', 'username', 'password']
		, valid;

	valid = defaults.map(function(prop) {
		if(config[prop]) return true;
		return false;
	}).reduce(function(res, value) {
		return res && value;
	});

	return valid;
}