/**
* AwardList.js
*
* @description :: 获奖名单表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'award_list',
  attributes: {

    awardActivity:{
      model:'AwardActivity',
      size:64,
      required:true
    },
    wechatUser:{
      model:'WechatUsers',
      size:64,
      required:true
    },
    award:{
      model:'Award',
      size:64,
      required:true
    },
    realname:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    company:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    position:{
      type:'string',
      size:100,
      defaultsTo:''
    }
  }
};

