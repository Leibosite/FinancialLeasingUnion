/**
 * Created by leibosite on 2015/11/12.
 */
var WechatService = require("../services/wechat/WechatService");
module.exports = {

  oauthRedirect: function (req, res) {
    WechatService.oauthRedir(req, res);
  },
  oauthUser: function (req, res) {
    sails.log.info("--------start---------controller oauthUser");
    WechatService.oauthUser(req, res);
    sails.log.info("--------end---------controller oauthUser");
  },
  getAuthData:function(req,res){
    WechatService.getAuthData(req,res);
  },
  getVoteShareData:function(req,res){
    WechatService.getVoteShareData(req,res);
  },
  getVoteFrontShareData:function(req,res){
    WechatService.getVoteFrontShareData(req,res);
  }
};
