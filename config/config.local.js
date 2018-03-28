'use strict';

module.exports = () => {
  const config = exports = {};

  // add your config here
  config.cluster = {
    listen: {
      hostname: '0.0.0.0',
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
