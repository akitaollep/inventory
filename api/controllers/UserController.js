/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUser: function(req, res){
		User.findOne({id: req.params.id}).exec(function(err, user){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}

			res.ok(user);
		});
	},
	getUsers: function(req, res){
		User.find({ or : [{status: 'New'}, {status: 'Active'}] }).exec(function(err, users){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}else{
				res.ok(users);
			}
		});

		// async.waterfall([
		// 	function(callback){
		// 		Status.find({ or : [{name: 'New'}, {name: 'Active'}]}).exec(function(err, statuses){
		// 			if(err){
		// 				sails.log.error(err);
		// 				callback(err);
		// 			}else{
		// 				callback(null, statuses);
		// 			}
		// 		});
		// 	},
		// 	function(statuses, callback){
		// 		var arrQuery = [];

		// 		for(var index in statuses){
		// 			var query = {status: statuses[index].id};
		// 			arrQuery.push(query);
		// 		}

		// 		User.find({ or : arrQuery }).populate('role').exec(function(err, users){
		// 			if(err){
		// 				sails.log.error(err);
		// 				callback(err);
		// 			}else{
		// 				callback(null, users);
		// 			}
		// 		});
		// 	}
		// ], function(err, result){
		// 	if(err){
		// 		sails.log.error(err);
		// 		return res.serverError();
		// 	}else{
		// 		res.ok(result);
		// 	}
		// });
	},
	saveUser: function(req, res){
		var user = {
			id: (req.body.id) ? req.body.id : undefined,
			username: (req.body.username) ? req.body.username : undefined,
			email: (req.body.email) ? req.body.email : undefined,
			firstName: (req.body.firstName) ? req.body.firstName : undefined,
			lastName: (req.body.lastName) ? req.body.lastName : undefined,
			role: (req.body.role) ? req.body.role : undefined
		};

		if(user.id){
			User.update({id: user.id}, user).exec(function(err, result){
				if(err){
					sails.log.error(err);
					return res.serverError();
				}

				User.find().exec(function(err, users){
					if(err){
						sails.log.error(err);
						return res.serverError();
					}

					res.ok(users);
				});
			});
		}else{
			user.password = (req.body.password) ? req.body.password : undefined;
			user.status = 'New';

			User.create(user).exec(function(err, result){
				if(err){
					sails.log.error(err);
					return res.serverError();
				}else{
					User.findOne({id: result.id}).exec(function(err, user){
						if(err){
							sails.log.error(err);
							return res.serverError();
						}

						res.json(user);
					});
				}
			});

			// async.waterfall([
			// 	function(callback){
			// 		Status.findOne({name: 'New'}).exec(function(err, status){
			// 			if(err){
			// 				sails.log.error(err);
			// 				callback(err);
			// 			}else{
			// 				user.status = status.id;
			// 				callback(null, null);
			// 			}
			// 		});
			// 	},
			// 	function(obj, callback){
			// 		User.create(user).exec(function(err, result){
			// 			if(err){
			// 				sails.log.error(err);
			// 				callback(err);
			// 			}else{
			// 				User.findOne({id: result.id}).populate('role').exec(function(err, user){
			// 					if(err){
			// 						sails.log.error(err);
			// 						callback(err);
			// 					}

			// 					callback(null, user);
			// 				});
			// 			}
			// 		});
			// 	}
			// ], function(err, result){
			// 	if(err){
			// 		sails.log.error(err);
			// 		return res.serverError();
			// 	}else{
			// 		res.json(result);
			// 	}
			// });
		}
	},
	changePassword: function(req, res){
		sails.log.debug(req.body);
		User.update({id: req.user.id}, {password: req.body.newPassword}).exec(function(err, user){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}else{
				res.ok(user);
			}
		});
	},
	deleteUser: function(req, res){
		async.waterfall([
			function(callback){
				sails.log.debug('Searching for user admin role');
				User.findOne({id: req.params.id}).exec(function(err, user){
					if(err){
						sails.log.error(err);
						callback(err);
					}else{
						if(user.username == 'admin' && user.role == 'Admin'){
							callback('Cannot delete admin user');
						}else{
							callback(null, user);
						}
					}
				});
			},
			function(user, callback){
				sails.log.debug('Updating for user status');
				User.update({id: req.params.id}, {status: 'Deleted'}).exec(function(err, user){
					if(err){
						sails.log.error(err);
						callback(err);
					}else{
						callback(null, user);
					}
				});
			}


			// function(callback){
			// 	sails.log.debug('Searching for deleted status');
			// 	Status.findOne({name: 'Deleted'}).exec(function(err, status){
			// 		if(err){
			// 			sails.log.error(err);
			// 			callback(err);
			// 		}else{
			// 			callback(null, status);
			// 		}
			// 	});
			// },
			// function(status, callback){
			// 	sails.log.debug('Searching for user admin role');
			// 	User.findOne({id: req.params.id}).populate('role').exec(function(err, user){
			// 		if(err){
			// 			sails.log.error(err);
			// 			callback(err);
			// 		}else{
			// 			if(user.username == 'admin' && user.role.name == 'Admin'){
			// 				callback('Cannot delete admin user');
			// 			}else{
			// 				callback(null, status);
			// 			}
			// 		}
			// 	});
			// },
			// function(status, callback){
			// 	sails.log.debug('Updating for user status');
			// 	User.update({id: req.params.id}, {status: status.id}).exec(function(err, user){
			// 		if(err){
			// 			sails.log.error(err);
			// 			callback(err);
			// 		}else{
			// 			callback(null, user);
			// 		}
			// 	});
			// }
		], function(err, result){
			if(err){
				sails.log.error(err);
				return res.badRequest(err);
			}else{
				res.ok(result);
			}
		});
	},
	getUserRoles: function(req, res){
		res.ok(User._attributes.role.enum);
	}
};

