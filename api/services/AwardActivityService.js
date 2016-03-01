var ResponseUtil = require('../util/ResponseUtil');
var Promise = require('bluebird');
var moment = require('moment');
module.exports = {

  /**
   * 创建抽奖活动
   * @param data
   * @param res
   * @returns {Promise.<T>}
   */
    createActivity: function (data, res) {
        var awardActivityId = 0;
        data = JSON.parse(data);
        return AwardActivity.create({ name: data.name, description: data.description, startTime: new Date(data.time),
          poolSize: data.poolSize, state: data.state, activity: data.activity })
          .then(function (awardActivityResult) {
            if (!data.hasOwnProperty('name') || !data.hasOwnProperty('description') || !data.hasOwnProperty('time') ||
              !data.hasOwnProperty('poolSize') || !data.hasOwnProperty('state') || !data.hasOwnProperty('activity')) {
                throw new Error('the request parameter is not right');
            }
            else if (!awardActivityResult) {
                throw new Error('create award activity failure');
            }
            awardActivityId = awardActivityResult.id;
        }).then(function () {
            if (!data.hasOwnProperty('awards')) {
                throw new Error('the request parameter is not right');
            }
            return Promise.map(data.awards, function (award) {
                if (!award.hasOwnProperty('awardLevel') || !award.hasOwnProperty('awardName') || !award.hasOwnProperty('awardAmount') ||
                  !award.hasOwnProperty('state')) {
                    throw new Error('the request parameter is not right');
                }
                return Award.create({ awardLevel: award.awardLevel, awardName: award.awardName, awardAmount: award.awardAmount, state: award.state, awardActivity: awardActivityId }).then(function (awardResult) {
                    if (!awardResult) {
                        throw new Error('create award failure');
                    }
                })
            })
        }).then(function () {
            return res.json(ResponseUtil.addSuccessMessage());
        }).catch(function (err) {
            sails.log.info(err);
            var responseData = {};
            if (err.message === 'the request parameter is not right') {
                responseData = ResponseUtil.addParamNotRight();
            }
            else if (err.message === 'create award activity failure') {
                responseData = ResponseUtil.createAwardActivityFailure;
            }
            else if (err.message === 'create award failure') {
                responseData = ResponseUtil.createAwardFailure;
            }
            else {
                responseData = ResponseUtil.addErrorMessage();
            }
            return res.json(responseData);
        })
    },

  /**
   * update 抽奖活动
   * @param data
   * @param res
   * @returns {*|Promise.<T>}
   */
    updateActivity: function (data, res) {
        data = JSON.parse(data);
        return AwardActivity.findOne({ id: data.awardActivityId }).populate('awards').then(function (awardActivity) {
            if (!data.hasOwnProperty('name') || !data.hasOwnProperty('description') || !data.hasOwnProperty('time') || !data.hasOwnProperty('poolSize') || !data.hasOwnProperty('state') || !data.hasOwnProperty('activity') || !awardActivity) {
                throw new Error('the request parameter is not right');
            }
            awardActivity.name = data.name;
            awardActivity.description = data.description;
            awardActivity.startTime = new Date(data.time);
            awardActivity.poolSize = data.poolSize;
            awardActivity.state = data.state;
            awardActivity.activity = data.activity;
            //TODO:
            return awardActivity.save(function (newAwardActivityResult) {
                return Promise.map(data.awards, function (award) {
                    return Award.findOne({ id: award.awardId }).then(function (awardResult) {
                        if (!awardResult) {
                            return Award.create({ awardLevel: award.awardLevel, awardName: award.awardName, awardAmount: award.awardAmount, state: award.state, awardActivity: awardActivity.id }).then(function (newAward) {

                            });
                        }
                        awardResult.awardLevel = award.awardLevel;
                        awardResult.awardName = award.awardName;
                        awardResult.awardAmount = award.awardAmount;
                        awardResult.state = award.state;
                        awardResult.awardActivity = awardActivity.id;
                        return awardResult.save(function (newAwardResult) {

                        });
                    });
                }).then(function () {
                    var responseData = ResponseUtil.addSuccessMessage();
                    responseData.datas = awardActivity;
                    return res.json(responseData);
                }).catch(function (err) {
                    var responseData = {};
                    if (err.message === 'the request parameter is not right') {
                        responseData = ResponseUtil.addParamNotRight();
                    }
                    else if (err.message === 'request award id is not exists') {
                        responseData = ResponseUtil.awardIdNotExists;
                    }
                    else {
                        responseData = ResponseUtil.addErrorMessage();
                    }
                    return res.json(responseData);
                });
            });
        });
    },

  /**
   * list 抽奖活动
   * @param res
   * @returns {Promise.<T>}
   */
    list: function (res) {
        var tempAwardActivityInfos = [];
        return AwardActivity.find().populate('awards').populate('activity').then(function (awardActivityResults) {
            return Promise.map(awardActivityResults, function (awardActivityResult) {

                var awards = [];
                return Promise.map(awardActivityResult.awards, function (award) {
                    awards.push({
                        awardId: award.id,
                        awardLevel: award.awardLevel,
                        awardName: award.awardName,
                        awardAmount: award.awardAmount,
                        state: award.state
                    });
                }).then(function () {
                    var activity = awardActivityResult.activity;
                    for(var i in activity){
                      var temp = i.toString();
                      if(temp === 'id' || temp === 'activityTheme'){
                        continue;
                      }
                      delete activity[i];
                    }
                    tempAwardActivityInfos.push({
                        id: awardActivityResult.id,
                        name: awardActivityResult.name,
                        description: awardActivityResult.description,
                        time: moment(new Date(awardActivityResult.startTime)).format("YYYY-MM-DD HH:mm"),
                        poolSize: awardActivityResult.poolSize,
                        state: awardActivityResult.state,
                        awards: awards,
                        activity: activity
                    });
                });
            });
        }).then(function () {
            var responseData = ResponseUtil.addSuccessMessage();
            responseData.datas = tempAwardActivityInfos;
            res.json(responseData);
        }).catch(function (err) {
            sails.log.info(err);
            res.json(ResponseUtil.addErrorMessage());
        });
    }
}
