/**
 * Created by leibosite on 2015/11/11.
 */
var ResponseUtil = require("../util/ResponseUtil.js");
var uuid = require('node-uuid');

module.exports = {
  /**
   * 用户登录
   * @param username
   * @param password
   * @param req
   * @param res
   */
  login:function(username,password,req,res){
    Users.findOne({username:username,password:password}).exec(function(err,user){
      sails.log.info(username,password);
      if(err){
        sails.log.error(err);
        return res.json(ResponseUtil.addErrorMessage());
      }
      if(!user){
        sails.log.info("your username or password is wrong,please check!");
        return res.json(ResponseUtil.addLoginErrorMessage());
      }else{
        sails.log("user : ",user," login in");
        /*RegistrationRecord.findOne({id:1}).populate("activity").populate("wechatUser").exec(function(err,registration){

          sails.log.info(registration);

        });*/
        var token = uuid.v4();
        user.token = token;
        user.save(function (err) {
          if(err){
            return res.json(ResponseUtil.addErrorMessage());
          }

          var responseData = ResponseUtil.addSuccessMessage();
          responseData.token = token;
          return res.json(responseData);
        });
      }
    });
  },
  /**
   * 修改密码
   * @param username
   * @param password
   * @param newPassword
   * @param res
   */
  updatePassword:function(username,password,newPassword,res){
    Users.findOne({username:username,password:password}).exec(function(err,user){
      if(err){
        sails.log.error(err);
        return res.json(ResponseUtil.addErrorMessage());
      }
      if(!user){
        sails.log.info("your username or password is wrong,please check!");
        return res.json(ResponseUtil.addLoginErrorMessage());
      }else{

        Users.update({id:user.id},{password:newPassword}).exec(function(err,user){
          if(err){
            sails.log.error(err);
            return res.json(ResponseUtil.addErrorMessage());
          }
          if(user){
            return res.json(ResponseUtil.addSuccessMessage());
          }
        })

      }
    });
  }
};
