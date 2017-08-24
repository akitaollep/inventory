/**
 * RoleController
 *
 * @description :: Server-side logic for managing roles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getRoles: function(req, res){
		Role.find().exec(function(err, roles){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}

			res.ok(roles);
		});
	}
};

