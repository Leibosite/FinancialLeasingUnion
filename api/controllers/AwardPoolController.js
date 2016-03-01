/**
 * AwardPoolController
 *
 * @description :: Server-side logic for managing awardpools
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var UUID = require('node-uuid');
var ResponseUtil = require("../util/ResponseUtil.js");

module.exports = {
  /**
   * 初始化奖池
   * @param req
   * @param res
   */
  initAwardPool: function (req,res) {

    //初始化 奖池时 将 抽奖所需要的缓存变量
    sails.config.reqIds = {};
    sails.config.openIds = {};
    sails.config.counterRaffle = 0;

    Activities.findOne({activityState:0}).exec(function (err,activity) {


      if(err || !activity){
        return res.json(ResponseUtil.addErrorMessage());
      }


      var activityID = activity.id;


      AwardPool.find({award:{'>':0},openid:{'!':null}}).exec(function (err,awardList) {

        if(err || !awardList || awardList.length===0){
          sails.log.info('没有抽奖人员');

        }

        //sails.log.info(awardList);
        var awardMap = {};
        for(var m = 0;m<awardList.length;++m){
          var item = awardList[m];
          awardMap[item.openid] = item.id;
        }


        var awardArray = [];
        Promise.map(awardList, function (oneAward) {
          sails.log.info('####',oneAward.id,oneAward.openid);
          return WechatUsers.findOne({openid:oneAward.openid}).then(function (wechat) {

            var wechatToAwardID = awardMap[wechat.openid];
            sails.log.info('$$$$$$',wechatToAwardID,wechat.openid);
            var tempAward = {awardActivity:activityID,
                              wechatUser:wechat.id,
                              award:wechatToAwardID,
                              realname:wechat.realname,
                              company:wechat.company,
                              position:wechat.position};
            awardArray.push(tempAward);
          });

        }).then(function () {
          //保存上次抽奖记录
          //sails.log.info('awardArray---------------',awardArray);
          if(awardArray.length > 0){
            return AwardList.create(awardArray);
          }

        }).then(function () {

         // AwardActivity.find({activity:activity.id});
         // 初始化奖池表
          sails.log.info('-----------初始化奖池表----------');
          AwardPool.query('truncate table award_pool;', function (err) {

            //sails.log.info('activityID----------',activityID);
            AwardActivity.findOne({activity:activityID}).then(function(awardActivity){

              sails.config.activityStartTimer = awardActivity.startTime;
              //sails.log.info('awardActivity--------',awardActivity);
              //0 表示 激活状态
              //var initAward={
              //  awardLevel:0,
              //  awardName:'谢谢惠顾',
              //  awardAmount:0,
              //  state:0,
              //  awardActivity:awardActivity.id
              //};
              //Award.findOrCreate(initAward).then(function(awardCreate){

                var p = Award.find({state:0,awardActivity:awardActivity.id}).then(function (awards) {

                  //sails.log.info('awards----------',awards);

                  var awardsSize = awards.length;
                  if(awardsSize<0){
                    res.ok('没有奖品');
                    return p.cancel();
                  }

                  var poolSize = awardActivity.poolSize;
                  var poolArray = [];
                  for(var k=0;k<awardsSize;++k){
                    var award = awards[k];
                    for(var l=0;l<award.awardAmount;++l){
                      poolArray.push(award.id);
                    }
                  }

                  var length = poolSize - poolArray.length;
                  for(var j=0;j<length;++j){
                    poolArray.push(0);
                  }

                  poolArray.sort(function () {
                    return Math.random()>.5 ? -1 : 1;
                  });

                  var insertSql = 'insert into award_pool(award,uuid,isPress) values';

                  for(var i=0;i<poolSize;++i){
                    var awardValue = poolArray[i];
                    insertSql = insertSql + "("+awardValue+",'"+ UUID.v4() +"',0)";
                    if(i<poolSize-1){
                      insertSql = insertSql + ',';
                    }
                  }

                  return insertSql + ';';

                }).then(function (insertSql) {

                  //sails.log.info(insertSql);
                  AwardPool.query(insertSql);

                }).then(function () {

                  var responseData = ResponseUtil.addSuccessMessage();
                  sails.log.info('初始化奖池成功！！！！！！');
                  return res.json(responseData);
                }).catch(function (error) {
                  if(error){
                    return res.json(ResponseUtil.addErrorMessage());
                  }

                });
              });
            //});
          });
        }).catch(function (error) {
          if(error){
            return res.json(ResponseUtil.addErrorMessage());
          }
        });
      });
    });

  }

};

