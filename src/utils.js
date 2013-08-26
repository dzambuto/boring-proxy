
/**
 * Module dependencies.
 */

var fs = require('fs')
	, slice = Array.prototype.slice
	, forEach = Array.prototype.forEach
  , toString = Object.prototype.toString;

/**
 * Chech if `path` exists
 *
 * @param {String} path
 * @return {Bool}
 * @api private
 */

exports.exists = function(path) {
	return fs.existsSync(path);
};

/**
 * Check if `path` is writable
 *
 * @param {String} path
 * @return {Bool}
 * @api private
 */

exports.writable = function(path) {
	var stats = fs.statSync(path);
	return !!(2 & parseInt((stats.mode & parseInt ("777", 8)).toString (8)[0]));
};

/**
 * Extend a given object `obj`
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.extend = function(obj) {
	forEach.call(slice.call(arguments, 1), function(source) {
		if (source) {
			for (var prop in source) {
				obj[prop] = source[prop];
			}
		}
	});
	return obj;
};

/**
 * Return properties of a given object `obj`
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.properties = function(obj) {
	var props = {};
	Object.keys(obj).forEach(function(key){
		if (!(obj[key] instanceof Function)) props[key] = obj[key];
	});
	return props;
};

/**
 * Extend a given object `obj` (properties only)
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.properties.extend = function(obj) {
  forEach.call(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        if(toString.call(source[prop]) != '[object Function]') obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

/**
 * Fill in a given object with default properties. 
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */
 
exports.defaults = function(obj) {
  forEach.call(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

// JSON

exports.json = {};

/**
 * Read and parse a JSON file
 *
 * @param {String} path
 * @return {Object}
 * @api private
 */

exports.json.read = function(path) {
	var str = fs.readFileSync(path);
	return JSON.parse(str);
};

/**
 * Write `obj` properties in a file
 *
 * @param {String} path
 * @param {Object} obj
 * @api private
 */

exports.json.write = function(path, obj) {
	fs.writeFile(path, JSON.stringify(obj, null, 2));
};

// pattern

exports.pattern = {
    'host': '([a-zA-Z0-9\\.]+)?'
  , 'port': '(\\d+)?'
  , 'username': '([a-zA-Z0-9\\_\\-\\.\\@]+)?'
  , 'password': '([a-zA-Z0-9\\_\\-\\.\\@\\$\\#\\%]+)?'
  , 'protocol': '(http|https|ftp|socks)'
  , 'url': '(http|https|ftp|socks)'
  , 'noProxy': ''
  , 'httpOnly': ''
};

/**
 * Compile the given pattern string,
 * returning a string.
 *
 * @param {String} pattern
 * @return {String} compiled
 * @api private
 */

exports.pattern.compile = function(tpl, config) {
  if(typeof tpl != 'string' || !config) return false;
  var res = tpl.replace(/\#\{(\w+)(\((.{0,1})\))?\}/g, function(match, name, _, separator) {
    var field = config[name] || match;
    if(toString.call(field) != '[object Array]') return field;
    if(!separator) separator = ',';
    return field.join(separator);
  });
  return res;
};

exports.pattern.clean = function(tpl, str) {
  var self = this
    , sstr = arguments.length > 2 ? arguments[2] : '';

  tpl = tpl
    .trim()
    .replace(/\//g, '\\/')
    .replace(/\:/g, '\\s*\\:\\s*')
    .replace(/\@/g, '\\@')
    .replace(/\_/g, '\\_')
    .replace(/\-/g, '\\-')
    .replace(/\s+/g, '\\s+')
    .replace(/\=/g, '\\s*\\=\\s*')
    .replace(/\#\{(\w+)(\((.)\))?\}/g, function(_, name) {
      return self[name] || '';
    });

    var regex = new RegExp(tpl + '(\\/?)(\\n?)', 'gi');
    if(!str.match(regex)) return sstr ? str.concat(sstr) : str;
    return str.replace(regex, sstr);
};

/**
 * Abort program with message `str`
 *
 * @param {String} str
 * @api private
 */

exports.abort = function(str) {
	console.error(str);
	process.exit(1);
};

