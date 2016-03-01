/**
 * Created by leibosite on 2015/11/12.
 */

var API = require('wechat-api');
var api = new API(sails.config.wechatAppId, sails.config.wechatSecret);
var OAuth = require('wechat-oauth');
var client = new OAuth(sails.config.wechatAppId, sails.config.wechatSecret);
var ResponseUtil = require("../../util/ResponseUtil");
module.exports = {
  /**
   * 首次受到前端请求时进行用户验证
   * @param req
   * @param res
   */
  checkUser: function (req, res) {


  },
  /**
   * 微信授权和回调，微信有一个唯一的id是openid，它是辨别的唯一标识
   * 拦截用户请求，重定向到用户授权验证功能
   * @param req
   * @param res
   */
  oauthRedir: function (req, res) {
    sails.log.info("--------------{start}--|Function:oauthRedir()|------|获取用户请求的URL|------")

    var action = req.param('action');
    //sails.log.info('----action------',action);
    var activiytId = req.param('activityId');
    var url = '';
    if(activiytId){
      url = client.getAuthorizeURL(sails.config.wechatDomain + '/fetch/user'+'?action='+action+'&activityId='+activiytId, '', sails.config.oauthMode);
    }else{
      url = client.getAuthorizeURL(sails.config.wechatDomain + '/fetch/user'+'?action='+action, '', sails.config.oauthMode);
    }

    sails.log.info("URL: " + url);
    sails.log.info("--------------{end}--|Function:oauthRedir()|------|开始重定向到URL|------");
    res.redirect(url);
  },
  /**
   * 用户授权
   * @param req
   * @param res
   */
  oauthUser: function (req, res) {
    sails.log.info("--------------{start}--|Function:oauthUser()|------|开始验证用户接入的权限|------");

    RedirectService.error(res);
    return ;

    var code = req.param('code');
    var action = req.param('action');
    sails.log.info('action-----oauthUser----',action);
    if (!code) {
      sails.log.info("[bs]-------{code}----|code为空,重定向到/fetch/user再次获取code|");
      RedirectService.error(res);
      return ;
    }

    sails.log.info("--------[bs]-----------{code}-------------");
    sails.log.info(code);

    client.getAccessToken(code, function (error, result) {

      if(error || !result || !result.data){
        sails.log.error("--------------[bs]--------{getAccessToken error}--------|获取accessToken错误|-----------------");
        sails.log.error(error);
        RedirectService.error(res);
        return ;
      }

      sails.log.info("--------[bs]-----------{client.getAccessToken:result}-------------");
      sails.log.info(result);

      var accessToken = result.data.access_token;
      var openId = result.data.openid;

      sails.log.info("--------------[db]---[start]-----{find user by open_id}--------|通过open_id查询用户|-----------------");
      sails.log.info("--------------[bs]---[open_id]-----:"+openId);

      var data = {};
      data.openId = openId;
      var activityId = req.param('activityId');
      if(activityId){
        data.activeId = activityId;
      }

      WechatUsers.findOne({openid: openId},function (err,user) {

        if (!user || err) {
          sails.log.info("--------[bs]-----------{user is null}---------|数据库中不存在该用户,开始从微信端获取用户的基本信息|----");
          client.getUser(openId, function (err, result) {
            if(err || !result){
              sails.log.info("--------[bs]-----------{user is null}---------|查询user表发生错误|----");
              return res.redirect('/fetch/user');
            }

            var oauth_user = result;
            //新建用户
            sails.log.info("--------[bs]-----------{oauth_user is}---------|微信端获取用户信息为:|----");
            //sails.log.info(JSON.stringify(oauth_user));
            sails.log.info("--------------[db]---[start]-----{create user}--------|开始创建新用户|-----------------");
            WechatUsers.create({
              openid: openId,
              username: oauth_user.nickname,
              headImage: oauth_user.headimgurl,
              accessToken: accessToken
            },function(err,wechatUser){

              if(err || !wechatUser){
                sails.log.error("-----------[bs]-------{create user error}----------|创建用户失败|--------");
                sails.log.error(err);
                return res.redirect('/fetch/user');
              }
              sails.log.info("--------------[db]---[end]-----{create user}--------|结束创建新用户,创建的新用户为:|-----------------");
              //sails.log.info(JSON.stringify(wechatUser));
              //reUrl = sails.config.activityUrl + openId;
              //sails.log.info('redirect url:' + reUrl);
              RedirectService[action](data,res);
              return;

            });
          });
        } else {

          sails.log.info("--------[bs]-----------{user is exist}---------|数据库中存在该用户,开始更新用户的accessToken|----");
          // 更新用户AccessToken
          client.getUser(openId, function (err, oauth_user) {
            if (err || !oauth_user) {
              sails.log.info("--------[bs]-----------{user is null}---------|查询user表发生错误|----");
              RedirectService.error(res);
              return ;
            }

            WechatUsers.update({openid: openId}, {
              accessToken: accessToken,
              username: oauth_user.nickname,
              headImage:oauth_user.headimgurl
            },function(err, result) {
              if (err || !result || result.length===0 ) {
                sails.log.error("-----------[bs]-------{update user error}----------|更新用户失败|--------");
                sails.log.error(err);
                return res.redirect('/fetch/user');
              }

              sails.log.info("--------------[db]---[end]-----{update user}--------|结束更新用户,更新的新用户为:|-----------------");
              //sails.log.info(JSON.stringify(result));
              sails.log.info('redirect url:');
              RedirectService[action](data,res);
              return;

            });
          });
        }
      });
    });
  },

  /**
     * 获取用户授权处理后配置的信息
     * @param req
     * @param res
     */
  getAuthData : function (req, res) {
      var code = req.param('code');        //获取授权处理后的code值
      //TODO:活动的ID.
      //var url = req.param('url');          //获取动态加密的URL
      //var activityId = req.param('activityId');
      var openId = req.param('openId');
      var configUrl = decodeURIComponent(req.param('configUrl'));


      if(!openId || !configUrl){
        sails.log.info('params is error ! please check!');
        return res.json(ResponseUtil.addParamNotRight());
      }

      sails.log.info('------------------configUrl------------' + configUrl);

      var param = {
        //debug: false,
        //jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
        //url: sails.config.jssdkUrl + 'storeInformationId=' + storeInformationId + '&productIds=' + productIds
        url: configUrl
      };
      sails.log.info("--------------[bs]------------------ api.getJsConfig()--------param");
      sails.log.info(param);
      api.getJsConfig(param, function (err, config) {
        if (err){
          sails.log.error(err);
        }
        sails.log.info("--------------[bs]------------------ api.getJsConfig()--------config");
        sails.log.info(config);
        var responseData = ResponseUtil.addSuccessMessage();
        responseData.jssdk_config = config;
        sails.log.info("--------------{res}--|res|----|返回的API JSON数据为|--------");
        //sails.log.info(JSON.stringify(responseData));
        sails.log.info("--------------{end}--|Function:configParm()|----|结束获取微信配置参数|--------");

        Activities.findOne({activityState: 0},function (err, activity) {

          if (activity) {
            responseData.logo = sails.config.imageHostUrl + sails.config.logoUrl;
            responseData.activityTheme = activity.activityTheme;
            responseData.activityDesc = activity.activityDesc;
            sails.log.info('responseData---------',responseData);
          }
          return res.json(responseData);
        });

      });
  },

  /**
   * 获取投票候选人的活动分享信息
   * @param req
   * @param res
   */
  getVoteShareData : function (req, res) {

    var candidateID  = req.param('candidateID');
    var configUrl = decodeURIComponent(req.param('configUrl'));

    if(!configUrl){
      sails.log.info('params is error ! please check!');
      return res.json(ResponseUtil.addParamNotRight());
    }

    sails.log.info('------------------configUrl------------' + configUrl);

    var param = {
      //debug: false,
      //jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
      //url: sails.config.jssdkUrl + 'storeInformationId=' + storeInformationId + '&productIds=' + productIds
      url: configUrl
    };

    sails.log.info("--------------[bs]------------------ api.getJsConfig()--------param");
    sails.log.info(param);

    api.getJsConfig(param, function (err, config) {
      if (err){
        sails.log.error(err);
      }

      sails.log.info("--------------[bs]------------------ api.getJsConfig()--------config");
      sails.log.info(config);
      var responseData = ResponseUtil.addSuccessMessage();
      responseData.jssdk_config = config;
      sails.log.info("--------------{res}--|res|----|返回的API JSON数据为|--------");
      sails.log.info(JSON.stringify(responseData));
      sails.log.info("--------------{end}--|Function:configParm()|----|结束获取微信配置参数|--------");

      Candidate.findOne({id:candidateID}).populate('images',{sort:"rank ASC"}).exec(function(error,candidate){

        if (candidate && candidate.images.length>0) {

          var images = candidate.images;
          responseData.logo = sails.config.imageHostUrl + images[1].imageUrl;
          responseData.title = "为融资租赁女神们投票啦";
          //responseData.link = "https://mp.weixin.qq.com/misc/getqrcode?fakeid=3002346634&token=1356113921&style=1";
          //responseData.link = sails.config.wechatDomain+"?action=voteDetail&candidateID="+candidateID;
          //responseData.link = sails.config.voteDetails+"imgId="+candidate+"&detailsImg1="+images[2].imageUrl
          //  +"&detailsImg2="+images[3].imageUrl;
          sails.log.info('responseData---------',responseData);
          return res.json(responseData);

        }else{
          return res.json(responseData);
        }
      });
    });
  },

  /**
   * 获取投票首页的分享信息
   * @param req
   * @param res
   */
  getVoteFrontShareData : function (req, res) {


    //var candidateID  = req.param('candidateID');
    var configUrl = decodeURIComponent(req.param('configUrl'));


    if(!configUrl){
      sails.log.info('params is error ! please check!');
      return res.json(ResponseUtil.addParamNotRight());
    }

    sails.log.info('------------------configUrl------------' + configUrl);

    var param = {
      //debug: false,
      //jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
      //url: sails.config.jssdkUrl + 'storeInformationId=' + storeInformationId + '&productIds=' + productIds
      url: configUrl
    };
    sails.log.info("--------------[bs]------------------ api.getJsConfig()--------param");
    sails.log.info(param);

    api.getJsConfig(param, function (err, config) {
      if (err){
        sails.log.error(err);
      }

      sails.log.info("--------------[bs]------------------ api.getJsConfig()--------config");
      sails.log.info(config);
      var responseData = ResponseUtil.addSuccessMessage();
      responseData.jssdk_config = config;
      sails.log.info("--------------{res}--|res|----|返回的API JSON数据为|--------");
      sails.log.info(JSON.stringify(responseData));
      sails.log.info("--------------{end}--|Function:configParm()|----|结束获取微信配置参数|--------");
      responseData.logo = "http://101.200.180.17:50000" + sails.config.logoUrl;
      responseData.title = "为融资租赁女神们投票啦";
      //responseData.link = sails.config.wechatDomain+"?action=vote";
      sails.log.info('responseData---------',responseData);
      return res.json(responseData);
    });
  }
};
