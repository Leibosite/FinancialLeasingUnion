/**
 * VoteRecordController
 *
 * @description :: Server-side logic for managing Voterecords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	check:function (req,res) {
    var openid = req.param('openid');
    VoteRecordService.checkVoteStatus(openid,res);
  },

  voteFirst: function (req,res) {
    var candidateID = req.param('candidateID');
    var openID = req.param('openid');
    var data   = req.param('data');
    VoteRecordService.updateWechatUserAndVoteRecode(candidateID,openID,data,res);
  },
  voteOther: function (req,res) {
    var candidateID = req.param('candidateID');
    var openID = req.param('openid');
    VoteRecordService.saveVoteRecord(candidateID,openID,res);
  },
  voteWechatUserList: function (req, res) {
    var candidateID = req.param('candidateID');
    var page        = req.param('page');
    VoteRecordService.wechatUserList(candidateID,page,res);
  }
};

