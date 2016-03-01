/**
* AwardActivity.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'award_activity',
  attributes: {
    name:{
      type:'string',
      size:255
    },
    description:{
      type:'string',
      size:255
    },
    startTime:{
      type:'datetime'
    },
    poolSize:{
      type:'integer',
      size:32
    },
    activity:{
      model:'Activities',
      size:64,
      required:true
    },
    //0当前活动，1为历史活动
    state:{
      type:'integer',
      size:32
    },
    awards: {
        collection: 'Award',
        via: 'awardActivity'
    }
  }
};

