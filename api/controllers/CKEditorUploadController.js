/**
 * Created by leibosite on 2015/12/8.
 */

var FileUtil = require('../util/FileUtil');
var path = require('path');
module.exports = {

  uploadFile: function(req,res){
    //var upload = req.param('upload');

    sails.log.info('------------------start upload image------------------');
    function errorResponse(err){
      if (err) {
        sails.log.error(err);
        return res.json(ResponseUtil.addErrorMessage());
      }
    }

    var pathSep = path.sep;
    var callbackCkEditorNum = req.param('CKEditorFuncNum');
    var baseImageUrl = FileUtil.imageFoldPath+FileUtil.uploadActivityImageDir;
    var dirName = baseImageUrl;

    req.file('upload').upload({
      maxBytes:5000000,
      dirname:dirName
    }, function (err,uploadImageFiles) {

      if (err) {
        errorResponse(err);
      }
      //sails.log.info(uploadImageFiles);
      if (uploadImageFiles.length == 0) {
        return res.json(ResponseUtil.addErrorMessage());
      }

      var imageUrl = uploadImageFiles[0].fd;
      var imageUrlNameArr = imageUrl.split(pathSep);
      var imagePath = FileUtil.uploadActivityImageDir + imageUrlNameArr[imageUrlNameArr.length - 1];

      var data_src = sails.config.imageHostUrl + imagePath;
      var imageCallFunctionUrl = sails.config.imageDominUrl+'/rongzl_admin/src/index.html#/imageCallFunction/';
      var callbackParams = callbackCkEditorNum + '=+=' + data_src;

      sails.log.info('------data_src-------',data_src);
      sails.log.info('------imageCallFunctionUrl------',imageCallFunctionUrl);
      sails.log.info('------callbackParams--------',callbackParams);
      return res.redirect(imageCallFunctionUrl + encodeURIComponent(encodeURIComponent(callbackParams)));
    });
  }
}
