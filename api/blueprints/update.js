/**
 * Created by leibosite on 15/11/11.
 */
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil'),
  _ = require('lodash');
var ResponseUtil = require('../util/ResponseUtil');

module.exports = function updateRecord(req,res) {

  try{

    var modelJson = req.param("model");

    if(!modelJson){
      return res.json(ResponseUtil.addParamNotRight());
    }

    var record = JSON.parse(modelJson);
    var id = record.id;
    delete record.id;
    var updateData = record;
    var Model = actionUtil.parseModel(req);

    if(Model.identity === 'activities'){
      if((typeof record.activityDetail == 'string')){
        //将 文本中的所有的空格 替换为 +
        var detail = record.activityDetail.replace(/\s/g,"+");
        record.activityDetail = new Buffer(detail,'base64').toString();
        sails.log.info(record.activityDetail);
      }else{
        sails.log.error('activity detail is not a string');
        return res.json(ResponseUtil.addErrorMessage());
      }
    }

    Model.update({id:id},updateData, function (err,updateRecord) {
      if (err) {
        sails.log.error(err);
        return res.json(ResponseUtil.addErrorMessage());
      }

      sails.log.info(updateRecord);

      return res.json(ResponseUtil.addSuccessMessage());
    });


  }catch(e){
      return res.json(ResponseUtil.addJSONParseError());
  }

};
