/**
 * ActivitiesController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var FileUtil = require('../util/FileUtil');
var ResponseUtil = require('../util/ResponseUtil');
var gm = require('gm');
var Promise = require('bluebird');
var fs = require("fs");
module.exports = {
	list:function(req,res){
    var openId = req.param("openId");
    //var page = req.param("page");
    ActivitiesService.list(openId,res);
  },

  activityDetail:function(req,res){
    var activityId = req.param('activityId');
    var openId = req.param('openId');
    ActivitiesService.activityDetail(openId,activityId,res);
  },

  generateSignQr:function(req,res){
    var activityId = req.param('activityId');
    ActivitiesService.generateSignQr(activityId,res);
  },
  generateRegistrationExcel: function(req,res){
    var activityId = req.param('activityId');
    ActivitiesService.generateRegistrationExcel(activityId,res);
  },
  /**
   * 上传商品图片，商品图片分为：
   * origin(大于640x640),medium(640x640),small(300x300),icon(300x300,质量压缩到10%)
   * @param req
   * @param res
   */
  upload: function (req,res) {

    var dirName = FileUtil.imageFoldPath+FileUtil.uploadActivityImageDir;

    function errorResponse(err){
      if (err) {
        sails.log.error(err);
        return res.json(ResponseUtil.addErrorMessage());
      }
    }

    req.file('file').upload({
      maxBytes:5000000,
      dirname:dirName
    }, function (err,uploadImageFiles) {
      if(err){
        errorResponse(err);
      }


      if (uploadImageFiles.length == 0) {
        return res.json(ResponseUtil.addErrorMessage());
      }

      var imageFileName = uploadImageFiles[0].fd;

      var pathArr = imageFileName.split('/');
      var imageName = pathArr[pathArr.length - 1];
      var imageNameArr = imageName.split('.');

      var originImagePath = imageNameArr[0] + "_origin." + imageNameArr[1];

      var originImageDir = dirName+"origin/";



      fs.exists(originImageDir, function (result) {



        function dealImage(){

          var originAbsolutePath = originImageDir+originImagePath;


          var imageHttpPath = FileUtil.uploadActivityImageDir + "origin/"+ originImagePath;;
          //谷雨测试版 为8
          //融租为   26
         // imageHttpPath = imageHttpPath.substring(sails.config.subStringLength,imageHttpPath.length);
          sails.log.info('imageHttppath---------',imageHttpPath);

          gm(imageFileName)
            .autoOrient()
            .write(originAbsolutePath, function (err) {

              if(err){
                return errorResponse(err);
              }

              fs.unlink(imageFileName, function () {

                var responseData = {
                  result_code: 200001,
                  result_msg: "success",
                  image: imageHttpPath,
                  width: 300,
                  height: 200,
                  format: imageNameArr[1]
                };
                res.json(responseData);
              });
            });
        }

        if(result){
          dealImage();
        }else{
          fs.mkdir(originImageDir,0777, function (err) {


            errorResponse(err);

            dealImage();
            //fs.mkdir(mediumImageDir,0777, function (err) {
            //
            //  errorResponse(err);
            //
            //  fs.mkdir(smallImageDir,0777,function(err){
            //
            //    errorResponse(err);
            //
            //    fs.mkdir(iconImageDir,0777, function (err) {
            //
            //      errorResponse(err);
            //
            //      dealImage();
            //    });
            //
            //  });
            //
            //});
          });
        }
      });
    });
  }
};

