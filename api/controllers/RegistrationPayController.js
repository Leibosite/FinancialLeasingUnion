/**
 * RegistrationPayController
 *
 * @description :: Server-side logic for managing Registrationpays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  registrationPay:function(req,res){
    var openId = req.param('openId');
    var activityId = req.param('activityId');

    RegistrationPayService.registrationPay(openId,activityId,res);
  },
  queryPayResult: function (req, res) {
    var openId = req.param('openId');
    var payNumber = req.param('payNumber');

    RegistrationPayService.queryPayResult(openId, payNumber, res);
  },
  // TODO:
  wechatNofify: function (req, res) {
    RegistrationPayService.wechatNofify(req, res);
  }
};

