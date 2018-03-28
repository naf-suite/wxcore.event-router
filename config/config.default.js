'use strict';

const eventRouter = require('./event-router');

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1496644326431_669';

  // add your config here
  config.security = { csrf: { enable: false } };

  // 微信消息路由规则
  config.eventRouter = eventRouter;

  config.bodyParser = {
    enableTypes: [ 'json', 'form', 'text' ],
    extendTypes: {
      text: [ 'text/xml', 'text/html' ],
    },
  };

  config.logger = {
    // level: 'DEBUG',
    // consoleLevel: 'DEBUG',
  };

  return config;
};
