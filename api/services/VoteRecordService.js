/**
 * Created by jcy on 16/1/15.
 */
var ResponseUtil = require("../util/ResponseUtil.js");
module.exports = {
  checkVoteStatus: function (openid,res) {

    WechatUsers.findOne({openid:openid}, function (error,wechatUser) {
      if(error || !wechatUser){
        sails.log.error('find wechat user error');
        return res.json(ResponseUtil.addErrorMessage());
      }

      //sails.log.info()
      VoteRecord.find({wechatUser:wechatUser.id})
        .sort('createdAt DESC')
        .limit(1)
        .exec(function (error,records) {

          if(error){
            sails.log.error('find vote record error',error);
            return res.json(ResponseUtil.addErrorMessage());
          }

          var record = records[0];
          var responseData = {};
          if(record){
            sails.log.info(record);
            sails.log.info(record.statusCode);
            if(record.statusCode <3){
              responseData.check_code = 20004;
              res.json(responseData);
            }else{
              responseData.check_code = 20005;
              res.json(responseData);
            }

          }else{
            responseData.check_code = 20003;
            responseData.wechatUser = wechatUser;
            res.json(responseData);
          }

        });

    });
  },

  updateWechatUserAndVoteRecode: function (candidateID,openID,data,res) {

    try{
        var wechatUserInfo = JSON.parse(data);

       /*
        * 姓名 realname
        * 电话 mobile
        * 邮箱 email
        * 单位 company
        * 职务 position
        * */
        WechatUsers.findOne({openid:openID}).exec(function (error,wechatUser) {

          if (error || !wechatUser) {
            return res.json(ResponseUtil.addErrorMessage());
          }

          wechatUser.realname = wechatUserInfo.realname;
          wechatUser.mobile   = wechatUserInfo.mobile;
          wechatUser.company  = wechatUserInfo.company;
          wechatUser.position = wechatUserInfo.position;
          wechatUser.email    = wechatUserInfo.email;

          wechatUser.save(function (error,record) {
            if(error || !record){
              return res.json(ResponseUtil.addErrorMessage());
            }

            VoteRecord.create({
              candidate:candidateID,
              wechatUser:wechatUser.id,
              statusCode:1})
              .exec(function (error,result){

              if(error || !result){
                return res.json(ResponseUtil.addErrorMessage());
              }

              Candidate.findOne({id:candidateID}, function (error,candidate) {
                if(error){
                  return res.json(ResponseUtil.addErrorMessage());
                }

                candidate.vote = candidate.vote + 1;
                candidate.save(function (error) {
                  if(error){
                    return res.json(ResponseUtil.addErrorMessage());
                  }
                  return res.json(ResponseUtil.addSuccessMessage());
                });
              });
            });

          });

        });

    }catch(e){
      return res.json(ResponseUtil.addErrorMessage());
    }
  },

  saveVoteRecord:function(candidateID,openID,res){

    WechatUsers.findOne({openid:openID}).exec(function (error,wechatUser){

      if(error || !wechatUser){
        return res.json(ResponseUtil.addErrorMessage());
      }

      VoteRecord.find({
        candidate:candidateID,
        wechatUser:wechatUser.id
      }).exec(function (error,record) {
        if(error){
          return res.json(ResponseUtil.addErrorMessage());
        }
        var responseData = {};
        if(record && record.length > 0){
          responseData.check_code = 20006;
          return res.json(responseData);
        }else{

          VoteRecord.find({
            wechatUser:wechatUser.id
          }).sort('createdAt DESC')
            .limit(1)
            .exec(function(error,records){
              if(error){
                return res.json(ResponseUtil.addErrorMessage());
              }

              var voteRecord = records[0];
              var statusCode = 0;
              if(voteRecord.statusCode === 1){
                statusCode = 2;
              }else{
                statusCode = 3;
              }

              VoteRecord.create({
                candidate:candidateID,
                wechatUser:wechatUser.id,
                statusCode:statusCode}).exec(function (error,result) {

                if(error || !result){
                  return res.json(ResponseUtil.addErrorMessage());
                }

                Candidate.findOne({id:candidateID}, function (error,candidate) {
                  if(error){
                    return res.json(ResponseUtil.addErrorMessage());
                  }

                  candidate.vote = candidate.vote + 1;
                  candidate.save(function (error) {
                    if(error){
                      return res.json(ResponseUtil.addErrorMessage());
                    }
                    return res.json(ResponseUtil.addSuccessMessage());

                  });
                });

              });
            });
        }
      });
    });
  },
  wechatUserList:function (candidateID,page,res) {
    VoteRecord.find({candidate:candidateID})
      .populate('wechatUser')
      .limit(120)
      .skip((page-1)*120)
      .sort('id DESC')
      .exec(function (error, records) {

        if(error){
          return res.json(ResponseUtil.addErrorMessage());
        }

        return res.json(records);
    });
  }
};
