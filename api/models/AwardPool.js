/**
* AwardPool.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'award_pool',
  attributes: {

    award:{
      model:'Award',
      size:64,
      required:true
    },
    openid:{
      type:'string',
      size:255
    },
    isPress:{
      type:'integer',
      size:32
    }
  }
};

