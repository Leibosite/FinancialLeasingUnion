/**
* FinancingApply.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName:'financing_apply',
  attributes: {

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
    mobile:{
      type:'string',
      size:11,
      defaultsTo:''
    },
    email:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    contactPerson:{
      type:'string',
      size:100,
      defaultsTo:''
    },
    regtime:{
      type:'integer',
      size:64
    },
    industry:{
      type:'string',
      size:'100'
    },
    applyState:{
      type:'integer',
      size:32
    },
    asset:{
      type:'string',
      size:50
    },
    annualTurnover:{
      type:'string',
      size:50
    },
    intendFinancingAmount:{
      type:'string',
      size:50
    },
    companyDetail:{
      type:'text'
    },
    applyTimer:{
      type:'integer',
      size:64
    },
    wechatUser:{
      model:'WechatUsers',
      size:64
    }
  }
};

