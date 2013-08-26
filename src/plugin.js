/**
 * Module dependencies.
 */

var utils = require('../src/utils');

exports = module.exports = createPlugin;

function createPlugin(plugin) {
  function pl(program) {
    plugin.home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    plugin.init(program);
    return plugin;
  }

  return pl;
}