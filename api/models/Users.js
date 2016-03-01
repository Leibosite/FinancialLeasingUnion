/**
* Users.js
*
* @description :: 系统用户表
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    username:{
      type:'string',
      size:50,
      required:true
    },
    password:{
      type:'string',
      size:50,
      required:true
    },
    token:{
      type:'string',
      size:50,
      unique:true
    },
    openId:{
      type:'string',
      size:255
    }

  }
};

