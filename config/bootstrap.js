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

module.exports.bootstrap = function(cb) {

    async.series([
        function(callback){
            var adminUser = {
                email: 'akita.software@gmail.com',
                password: 'admin123',
                role: 'Admin',
                username: 'admin',
                firstname: 'Admin',
                lastname: 'Admin',
                status: 'Active'
            };
            User.findOrCreate({
                email: 'akita.software@gmail.com'
            }, adminUser).exec(function(err, user) {
                if (err) {
                    sails.log.error(err);
                } else {
                    sails.log.info('Admin user created');
                }
                callback(null);
            });
        }
    ], function(err, result) {
        if(err){
            sails.log.error(err);
            return;
        }else{
            //CronJob.startCRONJob();
            // It's very important to trigger this callback method when you are finished
            // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
            cb();
        }
    });
};