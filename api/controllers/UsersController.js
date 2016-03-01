/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login:function(req,res){
    var name = req.param("username");
    var password = req.param("password");
    UserService.login(name,password,req,res);
  },
  updatePassword:function(req,res){
    var name = req.param("username");
    var password = req.param("password");
    var newPassword = req.param("newPassword");
    UserService.updatePassword(name,password,newPassword,res);
  }
};

