'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.get('/weixin/CoreServlet', 'weixin.verify');
  app.post('/weixin/CoreServlet', 'weixin.dispatch');
  app.post('/weixin/produce', 'weixin.produce');
};
