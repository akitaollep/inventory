module.exports = {
	getSystemUserEmails : function(cb){
		// Status.find({select:['id']}).where({name: ['New', 'Active']}).exec(function(err, status){
		// 	if(err){
		// 		sails.log.debug(err);
		// 		return cb(err);
		// 	}

		// 	if(!status.length){
		// 		return cb(null, []);
		// 	}

		// 	User.find({select:['email']}).where({status: _.map(status, 'id')}).exec(function(err, emails){
		// 		if(err){
		// 			sails.log.debug(err);
		// 			return cb(err);
		// 		}

		// 		cb(null, emails);
		// 	});
		// });

		User.find({select:['email']}).where({status: ['New', 'Active']}).exec(function(err, emails){
			if(err){
				sails.log.debug(err);
				return cb(err);
			}

			cb(null, emails);
		});
	}
}