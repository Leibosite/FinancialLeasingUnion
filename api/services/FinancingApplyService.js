/**
 * Created by leibosite on 2015/12/1.
 */

var ResponseUtil = require("../util/ResponseUtil.js");
var Promise = require('bluebird');
module.exports ={

  /**
   * 融租申请列表
   * @param openId
   * @param res
   */
  wechatList: function (openId,res){
    if(!openId){
      sails.log.info('------openId------is null------');
      return res.json(ResponseUtil.addParamNotRight());
    }
    WechatUsers.findOne({openid:openId}).exec(function(err,wechatUser){

      if(err || !wechatUser){
        sails.log.info('-------wechatList-----err-----',err||wechatUser);
        return res.json(ResponseUtil.addErrorMessage());
      }

      FinancingApply.find({wechatUser:wechatUser.id}).sort('updatedAt Desc').exec(function(err,financingApplyResults){

        var responseData = ResponseUtil.addSuccessMessage();

        return Promise.map(financingApplyResults,function(financingApplyResult){

          delete financingApplyResult.createdAt;
          delete financingApplyResult.updatedAt;
          delete financingApplyResult.uuid;

        }).then(function(){
          responseData.results = financingApplyResults;
          //sails.log.info('-------wechatfinancingApplyList--------',financingApplyResults);
          return res.json(responseData);
        });
      });
    });
  },

  /**
   * 融租申请修改
   * @param openId
   * @param data
   * @param res
   */
  wechatUpdate: function(openId,data,res){

    if(!openId || !data){
      sails.log.info('------openid-----data----is--null-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    try{

      var financingApply = JSON.parse(data);

      var financingApplyId = financingApply.id;
      //delete financingApply.id;
      //sails.log.info('---------financingApply--------',financingApply);

      var financingApplyUpdate = {
        company:financingApply.company,
        position:financingApply.position,
        mobile: financingApply.mobile,
        email: financingApply.email,
        contactPerson: financingApply.contactPerson,
        regtime: financingApply.regtime,
        industry: financingApply.industry,
        applyState: financingApply.applyState,
        asset: financingApply.asset,
        annualTurnover: financingApply.annualTurnover,
        intendFinancingAmount: financingApply.intendFinancingAmount,
        companyDetail: financingApply.companyDetail,
        applyTimer: financingApply.applyTimer
      };

      //sails.log.info('---------financingApplyUpdate---------',financingApplyUpdate);

      FinancingApply.update({id:financingApplyId},financingApplyUpdate).exec(function(err,financingUpdate){

        if(err || !financingUpdate){
          sails.log.info('-----financingUpdate----err---',err||financingUpdate);
          return res.json(ResponseUtil.addErrorMessage());
        }

        sails.log.info('---------financingUpdate--------',financingUpdate);

        return res.json(ResponseUtil.addSuccessMessage());
      });
    }catch(e){
      if(e){
        sails.log.info(e.message);
        return res.json(ResponseUtil.addErrorMessage());
      }
    }

  },

  /**
   * 融租申请
   * @param openId
   * @param data
   * @param res
   */
  apply:function (openId,data,res) {

    if(!openId || !data){
      sails.log.info('-----financingApply------apply-----openid-----data-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    WechatUsers.findOne({openid:openId}).exec(function(err,wechatUserFind){

      if(err || !wechatUserFind){
        sails.log.info('-----wechatUserFind--------err-----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      try{


        var financingApplyData = JSON.parse(data);

        //applyState 默认为0 表示未通过 申请
        var financingApplyCreate = {
          company:financingApplyData.company, contactPerson:financingApplyData.contactPerson,
          position:financingApplyData.position, mobile:financingApplyData.mobile,
          email:financingApplyData.email, regtime:financingApplyData.regtime,
          industry:financingApplyData.industry, applyState:0,
          asset:financingApplyData.asset, annualTurnover:financingApplyData.annualTurnover,
          intendFinancingAmount:financingApplyData.intendFinancingAmount, companyDetail:financingApplyData.companyDetail,
          applyTimer:financingApplyData.applyTimer,wechatUser:wechatUserFind.id
        }

        FinancingApply.create(financingApplyCreate).exec(function(err,financingApplyCreateResult) {

          if(err || !financingApplyCreateResult) {
            sails.log.info('-----financingApplyCreateResult--------err-----');
            return res.json(ResponseUtil.addErrorMessage());
          }

          sails.log.info('------financingApplyCreate-----',financingApplyCreateResult);
          return res.json(ResponseUtil.addSuccessMessage());

        });

      }catch(err){
        if(err){
          sails.log.info(err.message);
          return res.json(ResponseUtil.addJSONParseError());
        }
      }

    });

     },

  /**
   * 融租申请发布
   * @param openId
   * @param financingApplyId
   * @param res
   */
  wechatPublish: function(openId,financingApplyId,res){

    if(!openId || !financingApplyId){
      sails.log.info('-----financingApply------apply-----openid-----data-----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    //申请状态 0为 未申请通过，1 申请通过 ，2 为 发布成功
    FinancingApply.update({id:financingApplyId},{applyState:2}).exec(function(err,financingApplyUpdate){

      if(err || !financingApplyUpdate){
        sails.log.info('-------financingApply-----update-----applyState----err----');
        return res.json(ResponseUtil.addParamNotRight());
      }

      return res.json(ResponseUtil.addSuccessMessage());
    });

  }
}
