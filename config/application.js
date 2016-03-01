/**
 * Created by leibosite on 2015/11/12.
 */
module.exports={

  logoUrl:'/financial/logo/logo.png',
  oauthMode:'snsapi_userinfo',
  imageHeight:250,
  imageWidth:450,
  //sentinelHost:'127.0.0.1',
  //sentinelPort:6380,
  //redisMasterName:'master_6381',



  //融资联盟线上版

   imageHostUrl:"http://101.200.180.17:50000",
   imageDominUrl:"http://www.leasingplaza.com:50000",

   wechatAppId:'wx1138147a5d79c45d',
   partnerKey:'qwertyuiopasdfghjklzxcvbnm123456',//财付通商户权限密钥Key
   mchId:'1284214101',//商户号
   hostIp:'101.200.180.17',

   wechatSecret:'e42e0f180b223b791d264f668fe8b8e7',
   wechatDomain:'http://www.leasingplaza.com:50001',
   activityUrl:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/join_event.html?openId=',
   initRaffle:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/lottery_main.html?openId=',
   historyActivitiesUrl:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/activity_list.html?openId=',
   financingApplyUrl:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/demand-list.html?openId=',
   registrationUrl:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/activity-scan-mark.html?openId=',
   notifyUrl:'http://www.leasingplaza.com:50001/registrationPay/notify',
   voteUrl:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/vote-list.html?openId=',
   errorUrl:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/error.html',
   voteDetails:'http://www.leasingplaza.com:50000/financial-leasing-union-front/views/vote-details.html?',


  //日本服务器测试版
  //imageHostUrl:"http://106.187.96.60:8088",
  //imageDominUrl:"http://wechat.yuetech.com.cn/rongZL",
  //
  //partnerKey:'qwertyuiopasdfghjklzxcvbnm123456',
  //mchId:'1234611402',
  //wechatAppId:'wx61e6a632b58aaff3',
  //hostIp:'101.200.174.126',
  //
  //wechatSecret:'223efc5d0a70e8c647577da646c89c55',
  //wechatDomain:'http://wechat.yuetech.com.cn:50001',
  //activityUrl:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/join_event.html?'+'openId=',
  //initRaffle:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/lottery_main.html?'+'openId=',
  //historyActivitiesUrl:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/activity_list.html?'+'openId=',
  //financingApplyUrl:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/demand-list.html?'+'openId=',
  //registrationUrl:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/activity-scan-mark.html?'+'openId=',
  //notifyUrl:'http://wechat.yuetech.com.cn/registrationPay/notify',
  //voteUrl:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/vote-list.html?openId=',
  //voteDetails:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/vote-details.html?',
  //errorUrl:'http://wechat.yuetech.com.cn/financial-leasing-union-front/views/error.html',

  pageNumber:3,
  timeout:1800000,
  openIds:{},
  counterRaffle:0,
  reqIds:{},
  activityStartTimer:0

};
