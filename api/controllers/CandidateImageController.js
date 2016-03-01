/**
 * CandidateImageController
 *
 * @description :: Server-side logic for managing Candidateimages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var FileUtil = require('../util/FileUtil');
var ResponseUtil = require('../util/ResponseUtil');


module.exports = {
  /**
   * 上传商品图片，商品图片分为：
   * @param req
   * @param res
   */
  upload: function (req,res) {

    var dirName = FileUtil.imageFoldPath+FileUtil.uploadCandidateImageDir;


    req.file('file').upload({
      maxBytes:5000000,
      dirname:dirName
    }, function (err,uploadImageFiles) {

      if (err || uploadImageFiles.length == 0) {
        return res.json(ResponseUtil.addErrorMessage());
      }

      var imageFileName = uploadImageFiles[0].fd;

      var pathArr = imageFileName.split('/');
      var imageName = pathArr[pathArr.length - 1];

      var imagePath = FileUtil.uploadCandidateImageDir + imageName;
      var responseData = {
        result_code:200001,
        result_msg:"success",
        image: imagePath
      };
      res.json(responseData);
    });
  }
};

