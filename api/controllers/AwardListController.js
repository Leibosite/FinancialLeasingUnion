/**
 * AwardListController
 *
 * @description :: Server-side logic for managing awardlists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  list:function(req,res){
    var openId = req.param('openId');
    //sails.log.info("----");
    AwardService.list(req,res);
  }
};

