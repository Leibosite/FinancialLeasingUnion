/**
 * Created by leibosite on 2015/11/13.
 */
var ResponseUtil = require("../util/ResponseUtil.js");
var ResultCode=require("../util/ResultCode.js");
var Promise = require('bluebird');
var qr = require('qr-image');
var fs = require('fs');
var FileUtil = require('../util/FileUtil');
module.exports={

  /**
   * 获取用户信息
   * @param openId
   * @param activityId
   * @param res
   */
  getUserInfo:function(openId,res){

    if(!openId){
      sails.log.info("miss open id please check!");
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missOpenId.code,ResponseUtil.missOpenId.message));
    }

    WechatUsers.findOne({openId:openId}).exec(function(err,wechatUser){

      if(err || !wechatUser){
        sails.log.info('-----getUserInfo-----err----wechatUser---',err||wechatUser);
        return res.json(ResponseUtil.addErrorMessage());
      }


      var wechatUserCopy = {realname:'',mobile:'',email:'',company:'',position:''};

      wechatUserCopy.realname = wechatUser.realname;
      wechatUserCopy.mobile = wechatUser.mobile;
      wechatUserCopy.email = wechatUser.email;
      wechatUserCopy.company = wechatUser.company;
      wechatUserCopy.position = wechatUser.position;
      //wechatUserCopy.state = 0;//0表示未报名

      var responseData = ResponseUtil.addSuccessMessage();
      responseData.wechatUser = wechatUserCopy;
      return res.json(responseData);

    });
  },

  /**
   * 最新活动,活动详情
   * @param openId
   */
  //
  NewRegisration:function(openId,res) {

    if(!openId){
      sails.log.info('miss open id please check!');
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missOpenId.code,ResponseUtil.missOpenId.message));
    }

    var newActivity = {};
    var isRegistration=0;

    Activities.findOne({activityState:0}).then(function(activity) {

      if(!activity){
        sails.log.info('-------there----is----not-----any------latest------activity-----');
        return res.json(ResponseUtil.addActivityNotExit());
      }

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
      newActivity.activityImage=sails.config.imageHostUrl +''+ activity.activityImage;

      newActivity.registrationHeadImages = [];
      var isPay = activity.isPay;

      WechatUsers.findOne({openid:openId}).then(function(wechatUser) {

        if(!wechatUser){
          throw new Error('NOTEXITWECHATUSER');
        }

        RegistrationRecord.findOne({wechatUser:wechatUser.id,activity:activity.id}).then(function(activityRecord) {

          // 0 表示未报名
          // 1已报名需支付
          // 2表示已支付查看二维码
          // 3表示已签到
          if(!activityRecord) {
            isRegistration = 0;
          } else if(isPay === 1){
            if (activityRecord.isPay === 0){
              isRegistration = 1;
            } else if (activityRecord.isPay === 1 && activityRecord.isRegistration === 0){
              isRegistration = 2;
            } else if (activityRecord.isPay === 1 && activityRecord.isRegistration === 1){
              isRegistration = 3;
            }
          } else if(isPay === 0){
            if(activityRecord.isRegistration === 0){
              isRegistration = 2;
            }else if(activityRecord.isRegistration === 1){
              isRegistration = 3;
            }
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
                position:wechatUserResult.position,
                registrationState:registrationRecord.isRegistration
              });

            });
          }).then(function(){
            return registrationRecordResults;
          });

        }).then(function(){

          newActivity.registrationState = isRegistration;
          newActivity.isAdmin = wechatUser.isAdmin;
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
   * 活动报名信息录入：：确认报名接口
   * @param openId
   * @param activity
   * @param res
   */
  regisration:function(openId,data,activity,res){

    if (!openId || openId === '?' || openId === ''||openId === null)
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResultCode.missOpenId.code, ResultCode.missOpenId.msg));
    if (!data)
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResultCode.missRegisrationInformation.code, ResultCode.missRegisrationInformation.msg));
    if (!activity)
      return res.json(ResponseUtil.addExceptionMessageAndCode(ResultCode.missActivity.code, ResultCode.missActivity.msg));

    //sails.log.info(data);

    try{


    var jsonData = JSON.parse(data);
    Activities.findOne({id:activity}).exec(function(err,activityResult){

      if(err){
        return res.json(ResponseUtil.addExceptionMessageAndCode(ResultCode.missRegisrationInformation.code, ResultCode.missRegisrationInformation.msg));
      }

      WechatUsers.findOne({openid:openId}).exec(function(err,wechatUser){

        //sails.log.info(user);
        //sails.log.info('------openid belown to wechatUser!-----',wechatUser);
        if(!wechatUser){
          sails.log.info('user is not exit!');
          return res.json(ResponseUtil.addNotExitWechatUsers());
        }
        var userId = wechatUser.id;

        if(err){
          return res.json(ResponseUtil.addExceptionMessageAndCode(ResultCode.missRegisrationInformation.code, ResultCode.missRegisrationInformation.msg));
        }

        RegistrationRecord.count({id:activity}).exec(function(err,count){

          if(err){
            return res.json(ResponseUtil.addExceptionMessageAndCode(ResultCode.missRegisrationInformation.code, ResultCode.missRegisrationInformation.msg));
          }

          //统计活动可报名剩余人数。
          if(activityResult.activityMemberCounter - count > 0)
          {
            //找到或生成一条报名记录
            sails.log.info('---------activity-----------',activity);
            RegistrationRecord.findOrCreate({
              wechatUser:userId,activity:activity,isPay:0}, function (err, registrationRecordCreate) {

              if(err || !registrationRecordCreate){
                sails.log.info(err);
                sails.log.info("-----信息录入失败--------");
                return res.json(ResponseUtil.addErrorMessage());
              }

              sails.log.info("-----信息录入成功----------录入的活动Id是-------");

              //sails.log.info(jsonData);
              var updateUser = {realname:jsonData.realname,mobile:jsonData.mobile,email:jsonData.email,company:jsonData.company,position:jsonData.position};

              //更新数据库中的WeChatUser
              WechatUsers.update({id:userId},updateUser).exec(function(err,update){
                if(err){
                  sails.log.info(err);
                  sails.log.info("-----信息录入失败--------");
                }
                sails.log.info('update user ------',update);
                var responseDate = ResponseUtil.addSuccessMessage();
                //responseDate.payNumber = payNumber;

                if(activityResult.isPay){
                  responseDate.isFree = activityResult.isPay;
                }else{
                  responseDate.isFree = 0;
                }
                return res.json(responseDate);
              });
            });
          }else{
            sails.log.info("member is enough!");
            return res.json(ResponseUtil.addExceptionMessageAndCode(ResponseUtil.activitiesLengthIsFull.code,ResponseUtil.activitiesLengthIsFull.message));
          }
        });
      });
    });
    }catch(e){
      return res.json(ResponseUtil.addErrorMessage());
    }
  },

  /**
   * 报名用户列表
   * 用于现场抽奖用
   * 根据当前活动、报名签到状态列出用户列表
   * @param res
   */

  list:function(res){
    //activityState:0 表示当前活动，
    Activities.findOne({activityState:0}).exec(function(err,activityResult){

      //sails.log.info('-----activityResult------',activityResult);
      if(err || !activityResult ){
        sails.log.info('-----err------|没有当前活动|------');
        return res.json(ResponseUtil.addActivityNotExit());
      }

      //isRegistration:1 表示签到状态
      RegistrationRecord.find({activity:activityResult.id,isRegistration:1}).exec(function(err,registrationWechatUsers){

        if(!registrationWechatUsers || registrationWechatUsers.length === 0 || err){
          sails.log.info('-------err-----|没有签到的用户|---------');
          return res.json(ResponseUtil.addNoRegistrationUsers());
        }

        var result = [];
        return Promise.map(registrationWechatUsers,function(registrationWechatUser){
          return WechatUsers.findOne({id:registrationWechatUser.wechatUser}).then(function(wechatUser){
            result.push({
              realname:wechatUser.realname,
              username:wechatUser.username,
              headImage:wechatUser.headImage
            })
          });
        }).then(function(){
          var responseData = ResponseUtil.addSuccessMessage();
          sails.log.info(result.length);
          responseData.results = result;
          return res.json(responseData);
        });
      })
    });
  },

  /**
   * 报名用户列表
   * @param res
   */
  listForServer:function(res){

    RegistrationRecord.find().populate("wechatUser").populate("activity").exec(function(err,registrationnRecordResult){

      if(!registrationnRecordResult || registrationnRecordResult.length === 0){
        return res.json(ResponseUtil.addErrorMessage());
      }

      var responseData = ResponseUtil.addSuccessMessage();
      responseData.total = registrationnRecordResult.length;
      responseData.results = registrationnRecordResult;
      return res.json(responseData);
    });
  },

  /**
   * 获取二维码接口
   * @param openId
   * @param res
   */
  getTicket: function(openId, activityId, res){

    //sails.log.info('--------------start---------------------');
    WechatUsers.findOne({openid:openId},function(err,wechatUser){

      if(err || !wechatUser){
        sails.log.error('----WechatUsers----findone------error');
        return res.json(ResponseUtil.addErrorMessage());
      }

      Activities.findOne({id:activityId},function(err,activityResult){

        if(err || !activityResult){
          sails.log.error('----activityResult----findone------error');
          return res.json(ResponseUtil.addErrorMessage());
        }
        var isFree = 0;
        if(activityResult.isPay){
          isFree = activityResult.isPay;
        }else{
          isFree = 0;
        }


        RegistrationRecord.findOne({activity:activityId,wechatUser:wechatUser.id},function(err,registrationRecordResult){

          if(err || !registrationRecordResult){
            sails.log.error('----RegistrationRecord----findone------error');
            return res.json(ResponseUtil.addErrorMessage());
          }

          if(registrationRecordResult.isPay === 1 || isFree === 0){
            if(registrationRecordResult.ticket === '' || !registrationRecordResult.ticket){

              try{

              //生成二维码
              var qrPng = qr.image(activityId+':'+openId, { type: 'png' });
              //生成二维码的路径：/var/www/financial/qrImages/1/1.png
              //TODO：判断文件是否存在

              var qrPath = FileUtil.imageFoldPath +FileUtil.uploadQrImageDir + '/' +registrationRecordResult.wechatUser +'.png';
              //数据库中存放路径：/financial/qrImages/1.png
              //var qrPath = "d:\\"+registrationRecordResult.wechatUser.toString() +".png";
              sails.log.info('--------|qrPath|--------',qrPath);

              var ticketPath = FileUtil.uploadQrImageDir + '/' +registrationRecordResult.wechatUser +'.png';;
              sails.log.info('--------|ticketPath|--------',ticketPath);

              qrPng.pipe(fs.createWriteStream(qrPath));

              var qrImageString = qr.imageSync(openId, { type: 'png' });

              }catch(err){
                if(err){
                  sails.log.error(err);
                  return res.json(ResponseUtil.addErrorMessage());
                }
              }
              //保存二维码
              RegistrationRecord.update({id:registrationRecordResult.id},{ticket:ticketPath},function(err,registrationRecordSave){

                if(err || !registrationRecordSave){
                  sails.log.info('----registrationRecord-----save-----ticket-----error-----');
                  return res.json(ResponseUtil.addErrorMessage());
                }

                sails.log.info('-----------------registrationrecordSavve---------',registrationRecordSave);

                var responseData = ResponseUtil.addSuccessMessage();
                responseData.ticket = sails.config.imageHostUrl + ticketPath;
                return res.json(responseData);
              });
            }else {
              var responseData = ResponseUtil.addSuccessMessage();
              responseData.ticket = sails.config.imageHostUrl + registrationRecordResult.ticket;
              return res.json(responseData);
            }
          }else {
            sails.log.info('----not pay-----please check-------');
            return res.json(ResponseUtil.addErrorMessage());
          }
        });
      });
    });
  },

  /**
   * 管理员扫码验证是否为报名用户
   * @param openId
   * @param data
   * @param res
   */
  checkRegistration: function(openId,data,res){
    if(!openId || !data){
      sails.log.info('-----checkRegistration----params----error----');
      return res.json(ResponseUtil.addParamNotRight());
    }
    //sails.log.info('-------checkRegistration-------openId--------',openId);
    WechatUsers.findOne({openid:openId}).exec(function(err,wechatUser){

      if(!wechatUser || err){
        sails.log.error('------findOne------wechatuser-----error-----');
        return res.json(ResponseUtil.addErrorMessage());
      }

      if(!wechatUser.isAdmin || wechatUser.isAdmin === 0){
        //不是管理员
        sails.log.info('-------He-----is-----not------admin------');
        return res.json(ResponseUtil.addNotAdmin());
      }else {
        //var dataRecv = [];
        var dataRecv = data.split(':');

        var activityId = dataRecv[0];
        var registrationWechatUserOpenId = dataRecv[1];
        sails.log.info('------activityId------',activityId);
        sails.log.info('------registrationWechatUserOpenId------',registrationWechatUserOpenId);
        if(activityId  || registrationWechatUserOpenId){
          WechatUsers.findOne({openid:registrationWechatUserOpenId}).exec(function(err,RegistrationWechatUser){
            if(err || !RegistrationWechatUser){
              sails.log.info('------findOne------RegistrationWechatUser-----error-----');
              return res.json(ResponseUtil.addErrorMessage());
            }
            RegistrationRecord.findOne({activity:activityId,wechatUser:RegistrationWechatUser.id}).exec(function(err,registrationRecord){
              if(err || !RegistrationWechatUser){
                sails.log.info('------findOne------registrationRecord-----error-----');
                return res.json(ResponseUtil.addErrorMessage());
              }

              RegistrationRecord.update({id:registrationRecord.id},{isRegistration:1}).exec(function(err,registrationRecordUpdate){

                if(err || !registrationRecordUpdate){
                  sails.log.info('------findOne------registrationRecordUpdate-----error-----');
                  return res.json(ResponseUtil.addErrorMessage());
                }
                return res.json(ResponseUtil.addSuccessMessage());
              })
            });
          });
        }
      }
    });
  },

  /**
   * 报名者签到
   * @param openId
   * @param activityId
   * @param res
   * @returns {*}
   */
  sign: function(openId,activityId,res){

    if(!openId || !activityId){
      sails.log.info('-----sign----params----error----');
      return res.json(ResponseUtil.addParamNotRight());
    }

    WechatUsers.findOne({openid:openId}).exec(function(err,RegistrationWechatUser){
      if(err || !RegistrationWechatUser){
        sails.log.info('------findOne------RegistrationWechatUser-----error-----');
        return res.json(ResponseUtil.addErrorMessage());
      }
      var isFree = 0;
      Activities.findOne({id:activityId},function(err,activityResult){

        if(err || !activityResult){
          sails.log.info('------findOne------activityResult-----error-----');
          return res.json(ResponseUtil.addErrorMessage());
        }
        isFree = activityResult.isPay;

        RegistrationRecord.findOne({activity:activityId,wechatUser:RegistrationWechatUser.id}).exec(function(err,registrationRecord){
          if(err || !registrationRecord){
            sails.log.info('------findOne------registrationRecord-----error-----');
            sails.log.info('------he dose not register! please check!---------')
            return res.json(ResponseUtil.addNotRegister());
          }
          if(isFree === 0 || (isFree === 1 && registrationRecord.isPay === 1)){
            RegistrationRecord.update({id:registrationRecord.id},{isRegistration:1}).exec(function(err,registrationRecordUpdate){

              if(err || !registrationRecordUpdate){
                sails.log.info('------findOne------registrationRecordUpdate-----error-----');
                return res.json(ResponseUtil.addErrorMessage());
              }

              sails.log.info('---------sign -------in -----success-----');
              return res.json(ResponseUtil.addSuccessMessage());
            })
          } else if(isFree === 1 && registrationRecord.isPay === 0){

            sails.log.info('------not-----pay-----please-----check------');
            return res.json(ResponseUtil.addNotPay());

          }

        });
      });
    });
  }
};
