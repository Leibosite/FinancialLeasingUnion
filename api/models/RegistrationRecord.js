/**
* RegistrationRecord.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'registration_record',
  attributes: {

    activity:{
      model:'Activities',
      size:64,
      required:true
    },
    wechatUser:{
      model:'WechatUsers',
      size:64,
      required:true
    },
    //0表示未支付，1表示支付
    isPay:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    //0表示未签到，1表示签到
    isRegistration:{
      type:'integer',
      size:32,
      defaultsTo:0
    },
    ticket:{
      type:'text',
      defaultsTo:''
    }
  }
};

