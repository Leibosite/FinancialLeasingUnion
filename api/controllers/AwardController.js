/**
 * AwardController
 *
 * @description :: Server-side logic for managing awards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	beginRaffle:function(req,res){
    var openId = req.param('openId');
    //sails.log.info("----");
    AwardService.beginRaffle(openId,res);
  },
    initRaffle: function (req, res) {
        var openId = req.param('openId');
        AwardService.initRaffle(openId, res);
    },

    myRaffle: function (req, res) {
        var openId = req.param('openId');
        AwardService.myRaffle(openId, res);
    }
};

