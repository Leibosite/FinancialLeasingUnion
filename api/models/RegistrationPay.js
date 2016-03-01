/**
* RegistrationPay.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'registration_pay',
  attributes: {
    openid:{
      type:'string',
      size:255
    },
    wechatUser:{
      model:'WechatUsers',
      size:64
    },
    time:{
      type:'integer',
      size:64,
      defaultsTo:(new Date()).valueOf()
    },
    state:{
      type:'integer',
      size:64,
      defaultsTo:0
    },
    payNumber:{
      type:'string',
      size:50
    },
    activity:{
      model:'Activities',
      size:64
    }
  }
};

