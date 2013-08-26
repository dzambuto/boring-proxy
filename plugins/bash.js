/**
 * Module dependencies.
 */

var plugin = require('../src/plugin')
  , utils = require('../src/utils')
  , fs = require('fs');

exports = module.exports = plugin(bash); 

function bash(config) {
  var protocols = utils.properties(config);

  if(!utils.exists(bash.file)) return false;
  if(!utils.writable(bash.file)) return false;

  var content = fs.readFileSync(bash.file).toString() || '';

  for(var protocol in protocols) {
    if(protocol == 'all') continue;
    var pars = protocols[protocol]
      , tpl = utils.pattern.compile(bash.template, {'protocol': protocol})
    
    pars.url = pars.httpOnly ? 'http' : protocol
    var str = utils.pattern.compile(tpl, pars);

    content = utils.pattern.clean(tpl, content, str + "\n");
  };

  return fs.writeFileSync(bash.file, content) || true;
}

bash.init = function(program) {
  program.option('-b, --bash', 'add global bash proxy settings');
  this.template = '#{protocol}_proxy="#{url}://#{username}:#{password}@#{host}:#{port}"';
  this.file = '/etc/environment';
};