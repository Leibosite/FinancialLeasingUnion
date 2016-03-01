/**
 * Created by leibosite on 15/11/11.
 */


module.exports = {


    addSuccessMessage: function () {
      var result = {};
      result.result_code = 200001;
      result.result_msg = "success";
      return result;
    },
    addErrorMessage:function(){
        var result = {};
        result.result_code = 200002;
        result.result_msg = "failure";
        return result;
    },
    addDetailErrorMessage:function(message){
      var result = {};

      if(!message){
        message = "";
      }

      result.result_code = 200002;
      result.result_msg = message;
      return result;
    },
    addParamNotRight:function(){
      var result = {};
      result.result_code = 200005;
      result.result_msg = "the request parameter is not right";
      return result;
    },
    addJSONParseError: function () {
    var result = {};
    result.result_code = 200007;
    result.result_msg = "model json parse error";
    return result;
  },
    addRecordNotExistError: function () {
      var result = {};
      result.result_code = 200008;
      result.result_msg = "the record can't find,it does not exist";
      return result;
    },
    addNotLoginError: function () {
      var result = {};
      result.result_code = 200009;
      result.result_msg = "you need to login";
      return result;
    },
    addRegisteredMistake:function(){
      var result = {};
      result.result_code = 400001;
      result.result_msg = "the mobile phone number has been registered";
      return result;
    },
    addLoginErrorMessage:function(){
      var result={};
      result.result_code = 400002;
      result.result_msg = "account or password is wrong!";
      return result;
    },
    addLoginPasswordMistake:function(){
      var result={};
      result.result_code = 400003;
      result.result_msg = "password mistake";
      return result;
    },
    addOriginalPasswordMistake:function(){
      var result = {};
      result.result_code = 400004;
      result.result_msg = "the original password mistake";
      return result;
    },
    addMobilePhoneNotExited:function(){
      var result = {};
      result.result_code = 400009;
      result.result_msg = "Found result is null or it's length is zero!";
      return result;
    },
    addExceptionMessageAndCode:function(code,message){
      var result = {};
      result.result_code = code;
      result.result_msg = message;
      return result;
    },
    addNotTimeToRaffle:function(){
      var result = {};
      result.result_code = 400010;
      result.result_msg = "It is not time to raffle!";
      return result;
    },
    addRaffleEnd:function(){
      var result = {};
      result.result_code = 400011;
      result.result_msg = "-------RAFFLE_END---|抽奖结束|-------";
      return result;
    },
    addAwardFindRROR:function(){
      var result = {};
      result.result_code = 400012;
      result.result_msg = "--------AwardFindRROR------";
      return result;
    },

    addMessageAndResultCode:function(code,message,result){

      result.result_code = code;
      result.result_msg = message;
    },
    missOpenId:{
      code : 20002,
      message : "miss open id please check!"
    },
    activitiesLengthIsZero:{
      code : 20003,
      message : "activities length is zero!"
    },
    missAward:{
      code : 20005,
      message : "miss award pool info, please check!"
    },
    missAwardActivity:{
      code : 20006,
      message : "miss award activity info, please check!"
    },
    createAwardActivityFailure: {
        code: 20007,
        message: "create award activity failure"
    },
    createAwardFailure: {
        code: 20008,
        message: "create award failure"
    },
    awardIdNotExists: {
        code: 20009,
        message: "request award id is not exists"
    },
    activitiesLengthIsFull:{
      code: 400013,
      message:"activities member is enough!"
    },

    addNotExitWechatUsers:function(){
      var result = {};
      result.result_code = 400014;
      result.result_msg = "the wechat user is not exit!";
      return result;
    },
    addNotAdmin:function(){
      var result = {};
      result.result_code = 400015;
      result.result_msg = "he is not admin! please check!s";
      return result;
    },
  addNotPay:function(){
    var result = {};
    result.result_code = 400016;
    result.result_msg = "he dose not pay! please check!";
    return result;
  },
  addNotRegister: function(){
    var result = {};
    result.result_code = 400017;
    result.result_msg = "he dose not register! please check!";
    return result;
  },
  addActivityNotExit: function(){
    var result = {};
    result.result_code = 400018;
    result.result_msg = "-----err------|没有当前活动|------";
    return result;
  },
  addNoRegistrationUsers: function(){
    var result = {};
    result.result_code = 400019;
    result.result_msg = "-----err------|没有签到的用户|------";
    return result;
  }
};

