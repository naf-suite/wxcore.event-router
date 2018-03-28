'use strict';

module.exports = () => {
  const config = exports = {};

  // add your config here
  config.cluster = {
    listen: {
      port: 7003,
    },
  };

  config.logger = {
    // level: 'DEBUG',
    // consoleLevel: 'DEBUG',
  };

  config.amqp = {
    client: {
      hostname: '192.168.1.190',
      username: 'weixin',
      password: 'weixin123',
    },
    app: true,
    agent: true,
  };

  return config;
};
