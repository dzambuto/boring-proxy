/**
 * Module dependencies.
 */

var plugin = require('../src/plugin')
  , utils = require('../src/utils')
  , fs = require('fs');

exports = module.exports = plugin(npm); 

function npm(config) {
  var protocols = utils.properties(config);

  var content = fs.readFileSync(npm.file).toString() || '';
  
  for(var protocol in npm.template) {
    var pars = protocols[protocol]
      , tpl = npm.template[protocol];
    
    if(!pars) continue;
    pars.url = pars.httpOnly ? 'http' : protocol
    var str = utils.pattern.compile(tpl, pars);

    content = utils.pattern.clean(tpl, content, str + "\n");
  };

  return fs.writeFileSync(npm.file, content) || true;
}

npm.init = function(program) {
  program.option('-n, --npm', 'add npm proxy settings (local)');
  this.template = {};
  this.template.http = 'proxy=#{url}://#{username}:#{password}@#{host}:#{port}';
  this.template.https = 'https-proxy=#{url}://#{username}:#{password}@#{host}:#{port}'
  this.file = this.home +'/.npmrc';
};