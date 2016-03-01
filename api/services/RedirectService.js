/**
 * Created by jcy on 16/1/18.
 */
module.exports = {
  registration: function (data,res) {
    sails.log.info("---------|跳转到活动报名URL|--------------");
    var reUrl = sails.config.activityUrl + data.openId;
    sails.log.info(reUrl);
    res.redirect(reUrl);
  },
  initRaffle: function (data,res) {
    sails.log.info("---------|跳转到抽奖初始化URL|--------------");
    var reUrl = sails.config.initRaffle + data.openId;
    sails.log.info(reUrl);
    res.redirect(reUrl)
  },
  historyActivities: function (data,res) {
    sails.log.info("---------|跳转到历史活动列表URL|--------------");
    var reUrl = sails.config.historyActivitiesUrl + data.openId;
    sails.log.info(reUrl);
    res.redirect(reUrl)
  },
  financingApply: function (data,res) {
    sails.log.info("---------|跳转到融租申请URL|--------------");
    var reUrl = sails.config.financingApplyUrl + data.openId;
    sails.log.info(reUrl);
    res.redirect(reUrl)
  },
  sign: function (data,res) {
    sails.log.info("---------|跳转到签到URL|--------------");
    var reUrl = sails.config.registrationUrl + data.openId+'&activityId='+data.activityId;
    sails.log.info(reUrl);
    res.redirect(reUrl);
  },
  vote: function (data,res) {
    sails.log.info("---------|跳转到投票URL|------------");
    var reUrl = sails.config.voteUrl + data.openId;
    sails.log.info(reUrl);
    res.redirect(reUrl);
  },
  voteDetail:function(data,res){

    sails.log.info("---------|跳转到投票详情URL|------------");
    Candidate.findOne({id:data.candidateID}).populate('images',{sort:"rank ASC"}).exec(function(error,candidate){

      if(error || !candidate){

      }
      var images = candidate.images;
      var reUrl = sails.config.voteDetails+"imgId="+data.candidateID
        +"&detailsImg1="+images[2].imageUrl
        +"&detailsImg2="+images[3].imageUrl;
        +"&openId="+data.openId;
      sails.log.info(reUrl);
      res.redirect(reUrl);
    });
  },
  error:function(res){
    sails.log.info("---------|跳转到错误页面URL|------------");
    var reUrl = sails.config.errorUrl;
    sails.log.info(reUrl);
    res.redirect(reUrl);
  }
};
