/**
 * RegistrationRecordController
 *
 * @description :: Server-side logic for managing Registrationrecords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getUserInfo:function(req,res){
    var openId = req.param("openId");
    RegistrationRecordService.getUserInfo(openId,res);
  },
  activityRegisration:function(req,res){
    var openId = req.param('openId');
    var data = req.param('data');
    var activity=req.param('activity');
    sails.log.info('--------');
    RegistrationRecordService.regisration(openId,data,activity,res);
  },
  activityNewRegisration:function(req,res){
    var openId = req.param('openId');
    //var activityId = req.param('activityId');
    //sails.log.info('--------');
    RegistrationRecordService.NewRegisration(openId,res);
  },
  list:function(req,res){
    RegistrationRecordService.list(res);
  },
  listForServer : function(req,res){
    RegistrationRecordService.listForServer(res);
  },
  ticket: function(req,res){
    var openId = req.param('openId');
    var activityId = req.param('activityId');
    RegistrationRecordService.getTicket(openId, activityId, res);
  },
  checkRegistration: function(req,res){
    var openId = req.param('openId');
    var data = req.param('data');
    RegistrationRecordService.checkRegistration(openId,data,res);
  },
  sign:function(req,res){
    var openId = req.param('openId');
    var activityId = req.param('activityId');
    RegistrationRecordService.sign(openId,activityId,res);
  }
};

