'use strict';

module.exports = () => {
  const config = exports = {};

  // add your config here
  config.cluster = {
    listen: {
      port: 7002,
    },
  };

  config.logger = {
    // level: 'DEBUG',
    // consoleLevel: 'DEBUG',
  };

  config.amqp = {
    client: {
      hostname: 'oa.chinahuian.cn',
      username: 'dyg',
      password: 'dyg123',
      vhost: 'demo',
    },
    app: true,
    agent: true,
  };

  return config;
};
