/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var ResponseUtil = require('../util/ResponseUtil');
var moment = require('moment');
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  var token = req.param('token');
  if(!token){
    sails.log.info('there is no token');
    return res.json(ResponseUtil.addNotLoginError());
  }

  Users.findOne({token:token}).exec(function (err,result) {
    if(err || !result){
      sails.log.info('login error',err);
      return res.json(ResponseUtil.addNotLoginError());
    }
    var timestamp = new Date().getTime();
    var tokenTimestamp = result.updatedAt.getTime();
    var timeout = timestamp - tokenTimestamp;
    sails.log.info('login timeout :',timeout);
    if(timeout > sails.config.timeout){
      //sails.log.info('login timeout ');
      return res.json(ResponseUtil.addNotLoginError());
    }

    Users.update({id:result.id},result).exec(function (err,user) {
      if(err){
        return res.json(ResponseUtil.addNotLoginError());
      }
      return next();
    });
  });
};
