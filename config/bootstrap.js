/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
//var later = require('later');
module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  // will fire every 5 minutes
  //var textSched = later.parse.text('every 5 seconds');

  // execute logTime one time on the next occurrence of the text schedule
  //later.setTimeout(logTime, textSched);

  // execute logTime for each successive occurrence of the text schedule
  //later.setInterval(logTime, textSched);

  // function to execute
  //function logTime() {
  //  console.log(new Date());
  //}

  // clear the interval timer when you are done
  //timer2.clear();
  //timer.clear();

  cb();
};
