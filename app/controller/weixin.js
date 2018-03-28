'use strict';

const Controller = require('egg').Controller;
// const moment = require('moment');
const wxutil = require('naf-weixin').MessageUtil;
require('egg-naf-amqp');// for index.d.ts

class WeixinController extends Controller {
  async verify() {
    const { /* signature, timestamp, nonce,*/ echostr } = this.ctx.query;
    // TODO: 校验签名，此处省略
    // ...

    this.ctx.body = echostr;
  }

  async dispatch() {
    const { logger, mq } = this.ctx;
    const rawData = this.ctx.request.rawBody;
    const { defaultUrl } = this.app.config.eventRouter;
    let targetUrl;

    // this.ctx.body = 'success'

    // TODO: 解析消息内容
    const msg = wxutil.extractFromXml(rawData);
    if (msg == null) {
      logger.error('解析消息失败');
      logger.info(rawData);
      logger.info(this.ctx.request);
      this.ctx.body = '解析消息失败';
      return;
    }
    logger.info(`receive ${msg.msgType} message to ${msg.toUser}`);
    // if (msg.msgType != 'text') {
    //     logger.info(`ignore non-text message : ${msg.msgType}`)
    //     this.ctx.body = 'ok'
    //     return;
    // }
    if (msg.msgType === 'event') {
      logger.debug(rawData);
      const { event, eventKey } = wxutil.eventFromXml(rawData);
      logger.info(`event - ${event} eventKey ${eventKey}`);
      // TODO: 发送消息到MQ
      try {
        // console.log(this.ctx.amqp);
        const ex = 'weixin.event';
        const key = `${msg.toUser}.${event}`;
        await mq.topic(ex, key, rawData);
      } catch (err) {
        this.ctx.body = err.toString();
        // console.error(err);
      }
    }
    // TODO: 转发请求
    let result;
    try {
      result = (targetUrl || defaultUrl) && await this.ctx.curl(targetUrl || defaultUrl, {
        method: 'POST',
        content: rawData,
        headers: {
          'content-type': 'text/xml',
        },
        // 创建连接超时 1 秒，接收响应超时 3 秒，用于响应比较大的场景
        timeout: [ 1000, 3000 ],
      });
    } catch (err) {
      logger.error(err);
    }
    if (result && result.status === 200) {
      logger.info(`route message result: ${result.data}`);
      this.ctx.body = result.data;
    } else {
      if (targetUrl || defaultUrl) {
        logger.error(`route message fail: ${result && result.status}`);
      }
      // TODO: 默认消息回复
      this.ctx.body = 'success';
    }
  }

  // 处理消息，将消息发送到MQ
  async produce() {
    const rawData = this.ctx.request.rawBody;
    const { logger, mq } = this.ctx;

    // TODO: 返回确认消息
    this.ctx.body = 'success';

    // TODO: 解析消息内容
    const msg = wxutil.extractFromXml(rawData);
    if (msg == null) {
      logger.error('解析消息失败');
      logger.debug(rawData);
      logger.debug(this.ctx.request);
      return;
    }
    logger.info(`receive ${msg.msgType} message to ${msg.toUser}`);
    if (msg.msgType === 'event') {
      logger.debug(rawData);
      const { event, eventKey, ticket } = wxutil.eventFromXml(rawData);
      logger.info(`fromUser - ${msg.fromUser} event - ${event} eventKey - ${eventKey}`);
      // TODO: 发送消息到MQ
      try {
        // console.log(this.ctx.amqp);
        const ex = 'weixin.event';
        const key = `${msg.toUser}.${event}`;
        await mq.topic(ex, key, JSON.stringify({ fromUser: msg.fromUser, event, eventKey, ticket }));
      } catch (err) {
        this.ctx.body = err.toString();
        // console.error(err);
      }
    }
  }
}

module.exports = WeixinController;
