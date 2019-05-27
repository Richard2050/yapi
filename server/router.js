const koaRouter = require('koa-router');
const interfaceController = require('./controllers/interface.js');
const groupController = require('./controllers/group.js');
const typeController = require('./controllers/type.js');
const userController = require('./controllers/user.js');
const interfaceColController = require('./controllers/interfaceCol.js');
const testController = require('./controllers/test.js');

const yapi = require('./yapi.js');
const projectController = require('./controllers/project.js');
const logController = require('./controllers/log.js');
const followController = require('./controllers/follow.js');
const openController = require('./controllers/open.js');
const { createAction } = require('./utils/commons.js');

const router = koaRouter();

let INTERFACE_CONFIG = {
  interface: {
    prefix: '/interface/',
    controller: interfaceController
  },
  user: {
    prefix: '/user/',
    controller: userController
  },
  group: {
    prefix: '/group/',
    controller: groupController
  },
  type: {
    prefix: '/type/',
    controller: typeController
  },
  project: {
    prefix: '/project/',
    controller: projectController
  },
  log: {
    prefix: '/log/',
    controller: logController
  },
  follow: {
    prefix: '/follow/',
    controller: followController
  },
  col: {
    prefix: '/col/',
    controller: interfaceColController
  },
  test: {
    prefix: '/test/',
    controller: testController
  },
  open: {
    prefix: '/open/',
    controller: openController
  }
};

const routerConfig = require('./routerConfig/index');

let pluginsRouterPath = [];

function addPluginRouter(config) {
  if (!config.path || !config.controller || !config.action) {
    throw new Error('Plugin Route config Error');
  }
  let method = config.method || 'GET';
  // let routerPath = '/plugin/' + config.path;
  // 支持 /api/open/plugin 前缀的 openApi
  let routerPath = (config.prefix || '') + '/plugin/' + config.path;
  if (pluginsRouterPath.indexOf(routerPath) > -1) {
    throw new Error('Plugin Route path conflict, please try rename the path');
  }
  pluginsRouterPath.push(routerPath);
  createAction(router, '/api', config.controller, config.action, routerPath, method, false);
}

yapi.emitHookSync('add_router', addPluginRouter);

for (let ctrl in routerConfig) {
  let actions = routerConfig[ctrl];
  actions.forEach(item => {
    let routerController = INTERFACE_CONFIG[ctrl].controller;
    let routerPath = INTERFACE_CONFIG[ctrl].prefix + item.path;
    createAction(router, '/api', routerController, item.action, routerPath, item.method);
  });
}

module.exports = router;
