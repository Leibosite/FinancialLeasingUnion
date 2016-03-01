/**
 * FinancialApplyController
 *
 * @description :: Server-side logic for managing financialapplies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	wechatList:function(req,res){
    var openId = req.param('openId');
    FinancingApplyService.wechatList(openId,res);
  },
  wechatUpdate: function(req,res){
    var openId = req.param('openId');
    var data = req.param('data');
    FinancingApplyService.wechatUpdate(openId,data,res);
  },
  apply:function(req,res) { 
    var openId = req.param('openId'); 
    var data = req.param('data'); 
    FinancingApplyService.apply(openId,data,res); 
  },
  wechatPublish: function(req,res){
    var openId = req.param('openId');
    var financingApplyId = req.param('financingApplyId');
    FinancingApplyService.wechatPublish(openId,financingApplyId,res);
  }
};

