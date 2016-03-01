/**
* WechatUsers.js
*
* @description :: 微信用户表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'wechat_user',
  attributes: {
    username:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    realname:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    mobile:{
      type:'string',
      size:11,
      defaultsTo:''
    },
    wechatAccout:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    email:{
      type:'string',
      size:100,
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
    },
    openid:{
      type:'string',
      size:255
    },
    accessToken:{
      type:'string',
      size:255,
      defaultsTo:''
    },
    headImage:{
      type: 'text',
      defaultsTo:''
    },
    isAdmin:{
      type:'integer',
      size:32,
      defaultsTo:0
    }
  }
};

