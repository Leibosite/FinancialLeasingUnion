/**
* Candidate.js
*
* @description ::
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name:{
      type:'string'
    },
    company:{
      type:'string'
    },
    position:{
      type:'string'
    },
    vote:{
      type:'integer',
      defaultsTo:0
    },
    images:{
      collection:'CandidateImage',
      via:'candidate'
    },
    description:{
      type:'string'
    }
  }
};

