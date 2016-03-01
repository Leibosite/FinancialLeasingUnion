/**
 * Created by leibosite on 15/11/11.
 */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil'),
  _ = require('lodash');
var ResponseUtil = require('../util/ResponseUtil');
var FileUtil     = require('../util/FileUtil');

module.exports = function destroyRecord(req,res) {

  var id = req.param("id");

  if(!id){
    return res.json(ResponseUtil.addParamNotRight());
  }

  var Model = actionUtil.parseModel(req);

  Model.destroy({id:id}, function (err,destroyRecord) {
    if (err) {
      sails.log.error(err);
      return res.json(ResponseUtil.addErrorMessage());
    }

    if(Model.identity === 'candidateimage'){
      sails.log.info(destroyRecord[0].imageUrl);
      var filePath = FileUtil.baseFilePath + destroyRecord[0].imageUrl;
      FileUtil.deleteFile(filePath,"delete candidate image success");
    }

    sails.log.info(destroyRecord);

    return res.json(ResponseUtil.addSuccessMessage());
  });

};
