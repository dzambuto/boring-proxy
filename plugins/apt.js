/**
 * Module dependencies.
 */

var plugin = require('../src/plugin')
  , utils = require('../src/utils')
  , fs = require('fs');

exports = module.exports = plugin(apt); 

function apt(config) {
  var protocols = utils.properties(config);

  if(!utils.exists(apt.file)) return false;
  if(!utils.writable(apt.file)) return false;

  var content = fs.readFileSync(apt.file).toString() || '';

  for(var protocol in protocols) {
    if(protocol == 'all') continue;
    var pars = protocols[protocol]
      , tpl = utils.pattern.compile(apt.template, {'protocol': protocol});

    pars.url = pars.httpOnly ? 'http' : protocol
    var str = utils.pattern.compile(tpl, pars);

    content = utils.pattern.clean(tpl, content, str + "\n");
  };

  return fs.writeFileSync(apt.file, content) || true;
}

apt.init = function(program) {
  program.option('-a, --apt', 'add apt proxy settings');
  this.template = 'Acquire::#{protocol}::proxy "#{url}://#{username}:#{password}@#{host}:#{port}";';
  this.file = '/etc/apt/apt.conf';
};