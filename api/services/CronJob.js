var CronJob = require('cron').CronJob;
var moment = require('moment');

module.exports = {
    startCRONJob: function(){
        sails.log.debug('Creating CRON jobs');
        var job = new CronJob('01 00 00 01 * *', function(){
            sails.log.debug('Getting expired orders');

            async.waterfall([
                function(callback){
                    Order.find({select:['id']}).where({type: ['Renewal', 'Interment'], status: 'Ordered'}).exec(function(err, orders){
                        callback(err, _.map(orders, 'id'));
                    });
                },
                function(orders, callback){
                    if(!orders.length){
                        return callback();
                    }

                    //orders = _.map(orders, 'id');
                    var expiryDate = moment().add(1, 'month').startOf('month').format('YYYY-MM-DD');

                    async.parallel([
                        function(cb){
                            RenewalOrder.update({
                                order: orders,
                                expirationDate: {
                                    '<' : expiryDate
                                }
                            }, {
                                status: 'Expired'
                            }).exec(function(err, renewals){
                                if(err){
                                    return cb(err);
                                }

                                renewals = _.map(renewals, 'id')
                                RenewalOrder.find({id: renewals}).populate('order').exec(function(err, populatedRenewals){
                                    cb(err, populatedRenewals);
                                });
                            });
                        },
                        function(cb){
                            IntermentOrder.update({
                                order: orders,
                                expirationDate: {
                                    '<' : expiryDate
                                }
                            }, {
                                status: 'Expired'
                            }).exec(function(err, renewals){
                                if(err){
                                    return cb(err);
                                }

                                renewals = _.map(renewals, 'id')
                                IntermentOrder.find({id: renewals}).populate('order').exec(function(err, populatedRenewals){
                                    cb(err, populatedRenewals);
                                });
                            });
                        }
                    ], function(err, results){
                        var orders = _.flatten(results);
                        //sails.log.debug(orders);
                        OrderService.notifyExpiredOrders(orders, function(err){
                            callback(err);
                        });
                    });
                }

            ], function(err, result){
                if(err){
                    sails.log.error(err);
                }
            });
        }, function(){
            //Any cleanups should be located here
        },
        true,
        'Asia/Manila',
        this,
        true
        );
    }
};