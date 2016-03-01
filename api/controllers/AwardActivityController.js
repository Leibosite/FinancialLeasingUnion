/**
 * AwardActivityController
 *
 * @description :: Server-side logic for managing awardactivities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createActivity: function (req, res) {
        var data = req.param('data');
        AwardActivityService.createActivity(data, res);
    },
    
    updateActivity: function (req, res) {
        var data = req.param('data');
        AwardActivityService.updateActivity(data, res);
    },
    
    list: function (req, res) {
        AwardActivityService.list(res);
    }
};

