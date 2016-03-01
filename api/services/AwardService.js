/**
 * Created by leibosite on 2015/11/19.
 */

var ResponseUtil = require("../util/ResponseUtil.js");
var Promise = require('bluebird');

module.exports = {
    /**
    * 抽奖接口
    * @param openId
    * @param res
    */
    beginRaffle: function (openId, res) {

      // 判断抽奖是否开始

      if(!openId){
        return res.json(ResponseUtil.addParamNotRight());
      }

      var responseDate = ResponseUtil.addSuccessMessage();

      sails.log.info('-----openId------',openId);
      sails.log.info('-----reqIds-----',sails.config.reqIds);
      sails.log.info('------',sails.config.reqIds[openId.toString()]);
      sails.log.info('------',sails.config.reqIds[openId.toString()]);

      if(sails.config.reqIds[openId.toString()]){
        responseDate.data = {};
        responseDate.data.awardLevel = '';
        responseDate.data.awardName = '';
        //已经抽过
        responseDate.state = 2;
        return res.json(responseDate);
      } else {

        sails.config.reqIds[openId.toString()] = openId;

        sails.log.info('--------------openId-------',openId);
        sails.log.info('-----reqIds-----',sails.config.reqIds);

        var currentDate = new Date();


         if (currentDate > sails.config.activityStartTimer && sails.config.activityStartTimer !== 0) {

          sails.log.info('---------|开始抽奖|------------');

           sails.config.counterRaffle++;
           sails.log.info('------counter------',sails.config.counterRaffle);
          AwardPool.query('call update_award_pool_status("'+openId+'",'+ sails.config.counterRaffle +');',function(err,awardResult){


            if(err || !awardResult){

              sails.log.info('-------err-----beginRaffle-----awardResult------');
              delete sails.config.reqIds[openId.toString()];
              return res.json(ResponseUtil.addErrorMessage());
            }
            var award = awardResult[0][0];
            if(award && award.awardLevel > 0){

              responseDate.data = {};
              responseDate.data.awardLevel = award.awardLevel;
              responseDate.data.awardName = award.awardName;
              //正在抽奖
              responseDate.state = 1;
              sails.log.info('--------openid-------',openId);
              sails.config.openIds[openId.toString()] = openId;

              //delete sails.config.reqIds[openId.toString()];

              sails.log.info('----responseDate----',responseDate);
              return res.json(responseDate);

            }else{
              responseDate.data = {};
              responseDate.data.awardLevel = '';
              responseDate.data.awardName = '';
              //抽奖结束
              responseDate.state = 0;

              delete sails.config.reqIds[openId.toString()];

              return res.json(responseDate);
            }

          });
        } else{
           sails.log.info('------|还没有开始抽奖|-------');
           return res.json(ResponseUtil.addNotTimeToRaffle());
         }
      }
    },

    /**
    * 初始化抽奖转盘
    * @param openId
    * @param res
    * @returns {Promise.<T>}
    */
    initRaffle: function (openId, res) {
        var tempData = {};
        tempData.awardData = [];
        tempData.awardList = [];

        //TODO:抽奖活动关联活动
        Activities.findOne({activityState:0}).then(function(activity){

            if(!activity){
              sails.log.info('-----initRaffle-----activities------find----null----');
              return res.json(ResponseUtil.addErrorMessage());
            }

            //0为激活状态
            return AwardActivity.findOne({ state: 0 ,activity : activity.id}).then(function (awardActivity) {

                if(!awardActivity){
                  sails.log.info('-----initRaffle-----AwardActivity------find----null----');
                  return res.json(ResponseUtil.addErrorMessage());
                }

                sails.log.info('-------startTime-----',awardActivity.startTime);
                sails.log.info('-----startTime------',Date.parse(awardActivity.startTime));
                tempData.startTime = Date.parse(awardActivity.startTime);

                //0状态表示激活
                return Award.find({ state: 0, awardActivity: awardActivity.id }).then(function (awardResults) {
                    return Promise.map(awardResults, function (awardResult) {
                        tempData.awardData.push({
                            awardLevel: awardResult.awardLevel,
                            awardName: awardResult.awardName,
                        });
                    });
                }).then(function () {
                    return AwardPool.find({ award: { '>': 0 }, isPress: 1 }).then(function (awardPoolResults) {
                        return Promise.map(awardPoolResults, function (awardPoolResult) {
                            var tempAwardInfo = {};
                            //sails.log.info()
                            return WechatUsers.findOne({ openid: awardPoolResult.openid }).then(function (wechatUser) {

                                if (!wechatUser) {
                                    throw new Error('missing openid info');
                                }

                                tempAwardInfo = {
                                    realname: wechatUser.realname,
                                    headImage: wechatUser.headImage,
                                    company: wechatUser.company,
                                    position: wechatUser.position,
                                }
                            }).then(function () {
                                return Award.findOne({ id: awardPoolResult.award }).then(function (awardResult) {
                                    if (!awardResult) {
                                        throw new Error('missing award info');
                                    }
                                    tempAwardInfo.awardName = awardResult.awardName;
                                }).then(function () {
                                    tempData.awardList.push(tempAwardInfo);
                                })
                            })
                        })
                    })
                }).then(function () {
                    var responseData = ResponseUtil.addSuccessMessage();
                    responseData.awardData = tempData.awardData;
                    responseData.awardList = tempData.awardList;
                    responseData.startTime = tempData.startTime;
                    sails.log.info('responseDate----------------',responseData);
                    //sails.log.info('awardList----------------',awardList);
                    return res.json(responseData);
                }).catch(function (err) {
                    sails.log.info(err);
                    var responseData = {};
                    if (err.message === 'missing openid info') {
                        responseData = ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missOpenId.code,ResponseUtil.missOpenId.message);
                        return res.json(responseData);
                    }
                    else if (err.message === 'missing award info') {
                        responseData = ResponseUtil.addExceptionMessageAndCode(ResponseUtil.missAward.code,ResponseUtil.missAward.message);;
                        return res.json(responseData);
                    }
                    else {
                        responseData = ResponseUtil.addErrorMessage();
                        return res.json(responseData);
                    }

                })
            })
        });
    },

    /**
     * 我的抽奖记录接口
     * @param openId
     * @param res
     * @returns {Promise.<T>}
     */
    myRaffle: function (openId, res) {

        if(!openId){
          sails.log.info('-----opeid-----missing----');
          return res.json(ResponseUtil.addParamNotRight());
        }
        var tempData = [];
        return AwardPool.find({ award: { '>': 0 }, openid: openId, isPress: 1 }).then(function (awardPoolResults) {

          return AwardActivity.findOne({ state: 0 }).then(function (awardActivityResult) {

                if (!awardActivityResult) {
                    throw new Error('miss award activity info');
                }
                return Promise.map(awardPoolResults, function (awardPoolResult) {
                    return Award.findOne({ id: awardPoolResult.award }).then(function (awardResult) {
                        if (!awardResult) {
                            throw new Error('miss award info');
                        }
                        tempData.push({
                            awardImage: awardResult.awardImage,
                            awardLevel: awardResult.awardLevel,
                            awardName: awardResult.awardName,
                            awardActivity: {
                                name: awardActivityResult.name,
                                description: awardActivityResult.description,
                            }
                        });
                    });
                });
            });
        }).then(function () {
            return WechatUsers.findOne({ openid: openId }).then(function (wechatUser) {
                if (!wechatUser) {
                    throw new Error('missing openid info');
                }

                /*return AwardList.find({ wechatUser: wechatUser.id }).then(function (awardListResults) {

                    if(!awardListResults || awardListResults.length === 0){
                      throw new Error('No record');
                    }
                    return Promise.map(awardListResults, function (awardListResult) {
                        return AwardActivity.findOne({ id: awardListResult.awardActivity }).then(function (awardActivityResult) {

                            if (!awardActivityResult) {
                                throw new Error('miss award activity info');
                            }
                            return Award.findOne({ id: awardListResult.award }).then(function (awardResult) {
                                if (!awardResult) {
                                    throw new Error('miss award info');
                                }
                                tempData.push({
                                    awardLevel: awardResult.awardLevel,
                                    awardName: awardResult.awardName,
                                    awardImage: awardResult.awardImage,
                                    awardActivity: {
                                        name: awardActivityResult.name,
                                        description: awardActivityResult.description,
                                    }
                                });
                            });
                        });
                    });
                });*/
            });
        }).then(function () {
            var responseData = ResponseUtil.addSuccessMessage();
            responseData.data = tempData;
            return res.json(responseData);
        }).catch(function (err) {
            sails.log.info(err);
            var responseData = {};
            if (err.message === 'miss award activity info') {
                var code = ResponseUtil.missAwardActivity.code;
                var message = ResponseUtil.missAwardActivity.message;
                responseData = ResponseUtil.addExceptionMessageAndCode(code,message);
            }
            else if (err.message === 'miss award info') {

                var code = ResponseUtil.missAward.code;
                var message = ResponseUtil.missAward.message;
                responseData = ResponseUtil.addExceptionMessageAndCode(code,message);
            }
            else if (err.message === 'missing openid info') {

                var code = ResponseUtil.missOpenId.code;
                var message = ResponseUtil.missOpenId.message;
                responseData = ResponseUtil.addExceptionMessageAndCode(code,message);
                responseData.data = [];
            }
            else if(err.message === 'No record'){
              responseData = ResponseUtil.addSuccessMessage();
              responseData.data = [];
            }
            else {
                responseData = ResponseUtil.addErrorMessage();
            }
            return res.json(responseData);
        });
  },
  /**
   *
   * @param req
   * @param res
   */
    list:function(req,res){
    AwardList.find().then(function(lists) {
      Promise.map(lists,function(list) {
        if(list.award){
          return WechatUsers.findOne({id:list.wechatUser}).then(function(wechatuser)
          {
            list.headImage=wechatuser.headImage;
            return AwardActivity.findOne({id:list.awardActivity}).
              then(function(awardActivity){
                list.awardActivity={name:awardActivity.name,description:awardActivity.description}
                return Award.findOne({id:list.award}).then(function(award){
                  list.awardName=award.awardName;
                  list.awardImage=award.awardImage;
                });
              });
          } );
        }
        else
        {
          var responseDate=ResponseUtil.addErrorMessage();
          return res.json(responseDate);
        }
      } ).then(function(){
        Promise.map(lists,function(list){
          delete list.wechatUser;
          delete list.award;
          delete list.id;
          delete list.createdAt;
          delete list.updatedAt;
          delete list.uuid;
        }).then(function(){});
        var responseDate=ResponseUtil.addSuccessMessage();
        responseDate.Total=lists.length;
        responseDate.data=lists;
        return res.json(responseDate);
      } )        .catch(function(err){
        sails.log.info(err);
        var responseDate=ResponseUtil.addErrorMessage();
        return res.json(responseDate);
      });
    });
  }
}
