
/**
 * Module dependencies.
 */

var program = require('commander')
  , fs = require('fs')
  , path = require('path')
  , basename = path.basename
  , config = require('./src/config')
  , pkg = require('./package.json')
  , version = pkg.version
  , plugins = {}
  , configFile
  , settings;

// CLI

program
  .version(version)
  .usage('[options] <config>');

// init plugins
fs.readdirSync(__dirname + '/plugins').forEach(function(filename){
  if (!/\.js$/.test(filename)) return;
  var name = basename(filename, '.js');
  plugins[name] = (require('./plugins/' + name)(program));
});

program
  .command('empty [file]')
  .description('create an empty config.json')
  .action(function(file) {
    config().empty(file || './proxy.json');
  });

program.parse(process.argv);

if (0 == program.args || !/\.json$/.test(configFile = program.args[0])) return;

settings = config();

if(!settings.load(path.resolve(process.cwd(), configFile))){
  return;
}

for(var name in plugins) {
  if(!program[name]) continue;
  plugins[name](settings);
}