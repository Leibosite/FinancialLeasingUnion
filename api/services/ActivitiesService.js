/**
 * Created by leibosite on 2015/11/13.
 */
var ResponseUtil = require("../util/ResponseUtil.js");
var Promise = require('bluebird');
var qr = require('qr-image');
var fs = require('fs');
var FileUtil = require('../util/FileUtil');
var moment = require('moment');
var nodeExcel = require('excel-export');
module.exports = {

  /**
   * 微信端历史活动
   * @param openId
   * @param res
   */
  list: function (openId, res) {

      if (!openId) {
          sails.log.info("miss open_id,please check!");
          return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missOpenId.code, ResponseUtil.missOpenId.message));
      }

      //activityState 为1表示历史活动，为0表示最新活动
      Activities.find({
          activityState: 1,
          sort: {activityTime:0,updatedAt:0}
      }).then(function (activities) {

        //sails.log.info('activities -===== ',activities);
        if (!activities || activities.length === 0) {
            sails.log.info("activities length is zero!");
            return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.activitiesLengthIsZero.code, ResponseUtil.activitiesLengthIsZero.message));
        }

        for(var i in activities){
          var activity = activities[i];
              //delete activity.id;
              activity.timeStamp = new Date(activity.activityTime).getTime();
              delete activity.uuid;
              //delete activity.activityState;
              delete activity.createdAt;
              delete activity.updatedAt;
              delete activity.activityDesc;
              delete activity.activityDetail;
              delete activity.publishUnit;
              delete activity.activityCost;
              delete activity.registrationStartTime;
              delete activity.registrationEndTime;
              delete activity.activityStartTime;
              delete activity.activityEndTime;
              delete activity.sponsor;
        }
        return activities;/*.sort(function(a, b){
          //按照活动时间的倒序顺序
          return a.timeStamp < b.timeStamp ? 1:-1;
        });*/
      }).then(function (activities) {
          var responseData = ResponseUtil.addSuccessMessage();
          responseData.data = activities;
          return res.json(responseData);
      }).catch(function(err){
        if(err){
          sails.log.error(err.message);
          return res.json(ResponseUtil.addErrorMessage());
        }
      });
  },

  /**
   * 活动详情页
   * @param openId
   * @param activityId
   * @param res
   */
  activityDetail:function(openId,activityId,res) {
    if(!openId){
      sails.log.info('miss open id please check!');
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missOpenId.code,ResponseUtil.missOpenId.message));
    }

    var newActivity = {};
    var registrationNumber='';
    var isRegistration=0;

    sails.log.info('--------------openId---------------',openId);
    sails.log.info('--------------activityId---------------',activityId);
    Activities.findOne({id:activityId}).then(function(activity) {

      //sails.log.info('----------activity-------------',activity);
      //activityId=activity.id;
      newActivity.activityId = activity.id;
      newActivity.activityTheme=activity.activityTheme;
      //newActivity.publishUnit=activity.publishUnit;
      newActivity.activityLocation=activity.activityLocation;
      newActivity.activityAddress=activity.activityAddress;
      newActivity.activityTime=activity.activityTime;
      //newActivity.activityCost=activity.activityCost;
      newActivity.activityDetail=activity.activityDetail;
      newActivity.activityMemberCounter=activity.activityMemberCounter;
      //newActivity.sponsor=activity.sponsor;
      var activityImage = activity.activityImage;
      if(!activityImage || activityImage === null){
        newActivity.activityImage=sails.config.imageHostUrl;
      }else {
        newActivity.activityImage=sails.config.imageHostUrl +''+ activityImage;
      }


      newActivity.registrationHeadImages = [];

      WechatUsers.findOne({openid:openId}).then(function(wechatUser) {

        if(!wechatUser){
          throw new Error('NOTEXITWECHATUSER');
        }

        registrationNumber = wechatUser.id;

        RegistrationRecord.findOne({wechatUser:registrationNumber,activity:activity.id}).then(function(activityRecord) {

          if(!activityRecord) {
            isRegistration = 0;
          } else{
            isRegistration = 1;
          }

          RegistrationRecord.find({activity:activity.id}).then(function(registrationRecordResults) {

            newActivity.registrationCounter = registrationRecordResults.length;

            //sails.log.info('==================',registrationRecordResults.length);

            return Promise.map(registrationRecordResults, function (registrationRecord) {

              return WechatUsers.findOne({ id: registrationRecord.wechatUser }).then(function (wechatUserResult) {

                sails.log.info('------------------|wechatUserResult------------------',wechatUserResult);
                newActivity.registrationHeadImages.push({
                  realname: wechatUserResult.realname,
                  company: wechatUserResult.company,
                  headImage: wechatUserResult.headImage,
                  position:wechatUserResult.position
                });

              });
            }).then(function(){
              return registrationRecordResults;
            });

          }).then(function(){

            newActivity.registrationState = isRegistration;

            //sails.log.info(newActivity);
            var responseData = ResponseUtil.addSuccessMessage();
            responseData.data = newActivity;
            return res.json(responseData);
          });
        });
      }).catch(function(err){
        if(err){
          var responserData = ResponseUtil.addNotExitWechatUsers();
          sails.log.error(err.message);
          return res.json(responserData);
        }
      });
    });

  },

  /**
   * 生成活动的签到二维码
   * @param req
   * @param res
   */
  generateSignQr: function(activityId,res){

    Activities.findOne({id:activityId},function(err,activityResult){

      if(err || !activityResult){
        sails.log.error('----activityResult----findone------error');
        return res.json(ResponseUtil.addErrorMessage());
      }

      try {

        var url = sails.config.wechatDomain + '?activityId=' + activityResult.id + '&action=sign';
        //生成活动签到的二维码地址
        var qr_svg = qr.image(url, {type: 'png'});
        var activitySignQrPath = FileUtil.imageFoldPath + FileUtil.uploadActivityImageDir + activityResult.id +'.png';
        var SignQrSavePath = FileUtil.uploadActivityImageDir + activityResult.id +'.png';
        qr_svg.pipe(fs.createWriteStream(activitySignQrPath));

        var svg_string = qr.imageSync(activityResult.id, {type: 'png'});
        Activities.update({id:activityResult.id},{signQrPath:SignQrSavePath},function(err,activityUpdate){

          if(err || !activityUpdate){
            sails.log.error('----activityUpdate----findone------error');
            return res.json(ResponseUtil.addErrorMessage());
          }

          var responseData = ResponseUtil.addSuccessMessage();
          sails.log.info('----generate-----qr----iamge-----success------',activityUpdate);
          responseData.data = {};
          responseData.data.signQrPath = sails.config.imageHostUrl + SignQrSavePath;
          return res.json(responseData);

        });
      }catch(err){
        if(err){
          sails.log.info('----generate------signQr-----err----');
          return res.json(ResponseUtil.addErrorMessage());
        }
      }
    })
  },

  /**
   * 提供活动报名名单的excel
   * @param activityId
   * @param res
   * @returns {*}
   */
  generateRegistrationExcel: function(activityId,res){

    if(!activityId){
      sails.log.info('-------err------|generateRegistrationExcel params error|-----');
      return res.json(ResponseUtil.addParamNotRight());
    }
    Activities.findOne({id:activityId}).exec(function(err,activityResult){
      if(err || !activityResult){
        sails.log.info('-----err-----|没有找到活动|-----');
        return res.json(ResponseUtil.addActivityNotExit());
      }

      RegistrationRecord.find({activity:activityId}).exec(function(err,registrationRecordRestults){

        if(err || !activityResult){
          sails.log.info('-----err-----|该活动没有人报名|-----');
          return res.json(ResponseUtil.addErrorMessage());
        }

        var conf = {};
        conf.cols = [
          {caption:'姓名',type:'string',width:30},
          {caption:'公司',type:'string',width:30},
          {caption:'职位',type:'string',width:30},
          {caption:'手机',type:'string',width:30},
          {caption:'邮箱',type:'string',width:30}
        ];
        conf.rows = [];
        //var results = [];
        Promise.map(registrationRecordRestults,function(registrationRecord){
          return WechatUsers.findOne({id:registrationRecord.wechatUser})
            .then(function(wechatUser){
              conf.rows.push([
                wechatUser.realname,
                wechatUser.company,
                wechatUser.position,
                wechatUser.mobile,
                wechatUser.email
              ]);
            });
        }).then(function(){
          var resultExcel = nodeExcel.execute(conf);
          var execlName = encodeURI( activityResult.activityTheme + '_' + moment(new Date()).format('YYYY-MM-DD HH:mm')+'.xlsx');

          res.attachment(execlName);

          res.end(resultExcel, 'binary');
        });
      });
    });
  },


};
