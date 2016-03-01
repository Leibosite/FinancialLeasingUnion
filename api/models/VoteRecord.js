/**
* VoteRecord.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'vote_record',
  attributes: {
    candidate:{
      model:'candidate'
    },
    wechatUser:{
      model:'wechatUsers'
    },
    /*
      用户投票状态
      1 第一次投票
      2 第二次投票
      3 第三次投票
     */
    statusCode:{
      type:'integer',
      defaultsTo:1
    }
  }
};

