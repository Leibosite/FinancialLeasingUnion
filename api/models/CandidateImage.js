/**
* CandidateImage.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName:'candidate_image',
  attributes: {
    /*
    * 头像 1
    * 首图 2
    * 副图 3
    * */
    imageUrl:'string',
    rank:'integer',
    candidate:{
      model:'candidate',
      size:64
    }
  }
};

