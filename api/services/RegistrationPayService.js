/**
 * Created by leibosite on 2015/11/24.
 */

var ResponseUtil = require("../util/ResponseUtil");
var Promise = require('bluebird');
var ResultCode = require('../util/ResultCode');
var Payment = require('wechat-pay').Payment;
var Api = require('wechat-api');
var api = new Api(sails.config.wechatAppId, sails.config.wechatSecret);

var initConfig = {
  partnerKey: sails.config.partnerKey,
  appId: sails.config.wechatAppId,
  mchId: sails.config.mchId,
  notifyUrl: sails.config.notifyUrl,
  pfx: sails.config.wechatSecret
};
var payment = new Payment(initConfig);

module.exports = {

  /**
   *  报名支付
   * 1.通过openId查询用户，检查用户是否存在
   * 2.检查.payNumber，payNumber
   * 3.根据传入的payNumber调用统一下单API
   * 4.将返回结果给微信浏览器
   * @param openId
   * @param payNumber
   * @param res
   */
  registrationPay: function (openId, activityId, res) {

    sails.log.info("--------------{start}--|Function:payOrder()|------------");
    sails.log.info("--------------[bs]---{openId}-------|openId为:|--------------");
    sails.log.info(openId);

    if (!openId || openId === "?" || openId === "")
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missOpenId.code,ResponseUtil.missOpenId.message));
    if (!activityId)
      return res.json(ResponseUtil.addParamNotRight());

    WechatUsers.findOne({openid:openId}).exec(function(err,wechatUser){

    Activities.findOne({id:activityId}).exec(function(err,activity){

      if(err || !activity){
        sails.log.info('-----findOne----activities----RegistrationPay-----|err|-----------',err||activity);
        return res.json(ResponseUtil.addErrorMessage());
      }
      //create a payNumber,every time is different!
      var payNumber = wechatUser.id + "00" + new Date().getTime() + Math.floor(Math.random() * 10000);

      RegistrationPay.findOrCreate({openid:wechatUser.openid,wechatUser:wechatUser.id,activity:activityId,state:0}).exec(function(err,registrationPay) {

        if (!registrationPay || err) {
          sails.log.info('------findOrCreate----RegistrationPay----err---------');
          return res.json(ResponseUtil.addErrorMessage());
        }

        RegistrationPay.update({id:registrationPay.id},{payNumber:payNumber}).exec(function(err,registrationPayUpdate){

          if(!registrationPayUpdate || err){
            sails.log.info('------update----RegistrationPay-----err-------------');
            return res.json(ResponseUtil.addErrorMessage());
          }

          var totalFee = parseFloat(activity.activityCost);
          var order = {
            body: '报名支付 * 1',
            attach: '{"报名":"支付"}',
            out_trade_no: payNumber,
            total_fee: totalFee * 100,
            spbill_create_ip: sails.config.hostIp,
            openid: openId,
            trade_type: 'JSAPI'
          };

          var payment = new Payment(initConfig);
          sails.log.info("--------------[bs]---{payment}-------|生成开始向微信统一下单|--------------");
          sails.log.info(payment);
          sails.log.info("--------------[bs]---{order}-------|微信支付统一下单,订单为:|--------------");
          sails.log.info(order);
          payment.getBrandWCPayRequestParams(order, function (err, payargs) {
            if (err) {
              sails.log.error("----[bs]----{payment.getBrandWCPayRequestParams(order, function (err, payargs)}---error");
              sails.log.error(err);
              return res.json(ResponseUtil.addErrorMessage());
            } else {

              sails.log.info("--------------[bs]---{payargs}-------|生成微信的支付信息参数为:|--------------");
              sails.log.info(payargs);

              var responseData = ResponseUtil.addSuccessMessage();
              responseData.payargs = payargs;
              sails.log.info("--------------{res}--|res|----|返回的API JSON数据为|--------");
              sails.log.info(JSON.stringify(responseData));
              sails.log.info("--------------{end}--|Function:payOrder()|------------");
              return res.json(responseData);
            }

          });
        });

      });

    });
    });
  },
  /**
   * 查询支付结果
   * @param openId
   * @param payNumber
   * @param res
   */
  queryPayResult: function (openId, payNumber, res) {
    if (!openId || openId === "?" || openId === "")
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missOpenId.code, ResultCode.missOpenId.msg));
    if (!payNumber || payNumber === "?" || payNumber === "")
      return res.json(ResponseUtil.addParamNotRight());

  },
  /**
   * 接收微信支付结果通知
   * @param openId
   * @param payNumber
   * @param res
   */
  wechatNofify: function (req, res) {
    sails.log.info("--------------{start}--|Function:wechatNofify()|------------");
    sails.log.info("--------------[bs]-----------{wechat pay notify}--------|收到微信支付成功通知消息为:|--------");

    var rawBody = req.rawBody;
    //sails.log.info('request rawbody is \n',rawBody);
    if(!rawBody){
      res.end(payment.buildXml({
        return_code: 'FAIL',
        return_msg: data.name
      }));
    }


    payment.validate(rawBody, function(err, message){

      res.reply = function(data){
        if(data instanceof Error){
          res.end(payment.buildXml({
            return_code: 'FAIL',
            return_msg: data.name
          }));
        }else{
          res.end(payment.buildXml({
            return_code: 'SUCCESS'
          }));
        }
      };

      sails.log.info('validate error:',err);
      if(err){
        return res.end(payment.buildXml({
          return_code: 'FAIL',
          return_msg: err.name
        }));
      }

      sails.log.info("---------[bs]-------{wechat notify}-----------------------1------------");
      sails.log.info(message);
      sails.log.info("---------[bs]-------{wechat notify}-----------------------2------------");

      //var openid = message.openid;
      var payNumber = message.out_trade_no;
      var attach = {};

      try{

        //attach = JSON.parse(message.attach);

        //var qrPng = qr.image(openid, { type: 'png' });
        //var qrPath = FileUtil.imageFoldPath +FileUtil.uploadQrImageDir + '/' +registrationPayResult.wechatUser + '/' +registrationPayResult.wechatUser +'.png';
        //var ticketPath = FileUtil.uploadQrImageDir + '/' +registrationPayResult.wechatUser + '/' +registrationPayResult.wechatUser +'.png';;
        //sails.log.info('--------|qrPath|--------',qrPath);
        //qrPng.pipe(fs.createWriteStream(qrPath));


        /**
         * 查询订单，在自己系统里把订单标为已处理
         * 如果订单之前已经处理过了直接返回成功
         */
        //TODO:事务操作
        sails.log.info("--------------[bs]-----------{payOrder update}--------|开始更新支付订单下的订单列表|--------");
        RegistrationPay.findOne({payNumber: payNumber}).exec(function (err, registrationPay) {

          sails.log.info("--------------[bs]-----------{payOrder update}--------|支付订单为:|--------");
          sails.log.info(JSON.stringify(registrationPay));
          if (err || !registrationPay) {
            sails.log.error(err);
            var error = new Error();
            error.name = 'XMLParseError';
            return res.reply(error);
          }
          sails.log.info("--------------[bs]-----------{ updating order}--------|更新订单列表|--------");
          RegistrationRecord.update({
            wechatUser: registrationPay.wechatUser,
            activity: registrationPay.activity
          }, {isPay: 1})
            .exec(function (err, registrationRecordResult) {

              if (err || !registrationRecordResult) {
                sails.log.info('--------------------|error update registrationRecord isPay|---------------------');
                return res.reply(err);
              }
              RegistrationPay.update({payNumber: payNumber}, {state: 1}).exec(function (err, registrationPayResult) {
                if (err || !registrationPayResult) {
                  sails.log.info('--------------------|error update RegistrationPay state|---------------------');
                  return res.reply(err);
                }

                sails.log.info("--------------[bs]-----------{ updated order}--------|更新后的报名记录为:|--------");
                sails.log.info(registrationRecordResult);
                res.reply('success');
              });
            });
        });

      }catch(err){
        sails.log.error(err);
        err.name = 'XMLParseError';
        return res.reply(err)
      }

    });




      /**
       * 有错误返回错误，不然微信会在一段时间里以一定频次请求你
       * res.reply(new Error('...'))
       */
  }
};
