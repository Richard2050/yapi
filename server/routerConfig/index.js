const group = require('./group');
const type = require('./type');
const user = require('./user');
const project = require('./project');
const _interface = require('./interface');
const log = require('./log');
const follow = require('./follow');
const col = require('./col');
const test = require('./test');
const open = require('./open');
module.exports = {
  group,
  type,
  user,
  project,
  interface: _interface,
  log,
  follow,
  col,
  test,
  open
};
