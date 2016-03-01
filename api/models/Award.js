/**
* Award.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    awardLevel:{
      type:'integer',
      size:32
    },
    awardName:{
      type:'string',
      size:255
    },
    awardAmount:{
      type:'integer',
      size:32
    },
    state:{
      type:'integer',
      size:32
    },
    awardImage:{
      type:'text',
      defaultsTo:''
    },
    awardActivity:{
      model:'AwardActivity',
      size:64
    }

  }
};

