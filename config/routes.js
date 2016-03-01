/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    controller: 'WechatOauthController',
    action: 'oauthRedirect'
  },
  'post /login':{
    controller:'UsersController',
    action:'login'
  },
  'get /fetch/user': {
    controller: 'WechatOauthController',
    action: 'oauthUser'
  },
  'get /activity/list':{
    controller:'ActivitiesController',
    action:'list'
  },
  /*'get /activity/redirectList':{
    controller:'ActivitiesController',
    action:'redirectList'
  }*/
  /*'get /registration/record':{
    controller:'RegistrationRecordController',
    action:'getUserInfo'
  },*/
  'post /registration/confirm':{
    controller:'RegistrationRecordController',
    action:'activityRegisration'
  },
  'get /registration/latestActivity':{
    controller:'RegistrationRecordController',
    action:'activityNewRegisration'
  },
  //获取用户授权
  'get /getAuthData':{
    controller:'WechatOauthController',
    action:'getAuthData'
  },
  'get /awardList/list':{
  controller:'AwardListController',
    action:'list'
  },
  //微信支付通知
  'post /registrationPay/notify':{
    controller:'RegistrationPayController',
    action:'wechatNofify'
  },
  //微信支付
  'get /registrationPay/pay':{
    controller:'RegistrationPayController',
    action:'registrationPay'
  },
  //微信支付结果查询
  'get /registrationPay/query':{
    controller:'RegistrationPayController',
    action:'queryPayResult'
  },
  'post /financingApply/mobileCreate':{
    controller:'FinancingApplyController',
    action:'apply'
  },
  'get /financingApply/wechatList':{
    controller:'FinancingApplyController',
    action:'wechatList'
  },
  'post /financingApply/wechatUpdate':{
    controller:'FinancingApplyController',
    action:'wechatUpdate'
  },
  'get /registrationRecord/getUserInfo':{
    controller:'RegistrationRecordController',
    action:'getUserInfo'
  },
  'post /financingApply/wechatPublish':{
    controller:'FinancingApplyController',
    action:'wechatPublish'
  }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
