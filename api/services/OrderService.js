var nodemailer = require('nodemailer');
var moment = require('moment');

module.exports = {
	notifyExpiredOrders: function(orders, cb){
		var poolConfig = {
		    pool: true,
		    host: 'smtp.gmail.com',
		    port: 465,
		    secure: true, // use SSL
		    auth: {
		        user: 'akita.software@gmail.com',
		        pass: 'akitatest'
		    }
		};

		var transporter = nodemailer.createTransport(poolConfig);

		UserService.getSystemUserEmails(function(err, emails){
			if(err){
		        sails.log.debug(err);
				return cb(err);
		    }

		    if(!emails.length){
		    	return cb(null);
		    }

		    var recipients = _.map(emails, 'email').join(',');
		    sails.log.debug(recipients);

		    var orderRows = '';
		    for(var index in orders){
		    	orderRows += '<tr>' +
		    	'<td style="border: 1px solid black">' + orders[index].order.id + '</td>' +
		    	'<td style="border: 1px solid black">' + moment(orders[index].expirationDate).format('DD MMM YYYY') + '</td>' +
		    	'<td style="border: 1px solid black">' + orders[index].order.respondentFirstName + ' ' + orders[index].order.respondentLastName + '</td>' +
		    	'<td style="border: 1px solid black">' + orders[index].order.email + '</td>' + 
		    	'<td style="border: 1px solid black">' + orders[index].order.phoneNumber + '</td>' +
		    	'</tr>';
		    }

		    var expiryMonth = moment().add(1, 'month').format('MMMM YYYY');

		    var mailOptions = {
			    from: 'akita.software@gmail.com', // sender address 
			    //to: recipients, // list of receivers 
			    to: 'akita.software@gmail.com',
			    subject: 'Expiring Accounts for ' + expiryMonth, // Subject line 
			    //text: 'Hello World!', // plaintext body 
			    html: '<p>Here are the list of accounts that will expire in the next month, ' + expiryMonth + '</p>' +
			    '<table style="border-collapse: collapse; width: 100%;">' + 
			    '<tr>'+
			    '<td style="border: 1px solid black; width: 20%;">Transaction Id</td>' +
			    '<td style="border: 1px solid black">Renewal Date</td>' +
			    '<td style="border: 1px solid black">Respondent Name</td>' +
			    '<td style="border: 1px solid black">Email</td>' +
			    '<td style="border: 1px solid black">Phone</td>' +
			    '</tr>' +
			    orderRows + 
			    '</table>'
			};

			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        sails.log.debug(error);
					return callback(error);
			    }

			    cb(null);
			});
		});

		// async.eachSeries(orders, function(order, callback){
		// 	OrderStatus.findOne({name: 'Expired'}).exec(function(err, status){
		// 		if(err){
		// 			sails.log.debug(err);
		// 			callback(err);
		// 		}else{
		// 			Order.update({id: order.id}, {status: status.id}).exec(function(err, order){
		// 				if(err){
		// 					sails.log.debug(err);
		// 					callback(err);
		// 				}else{

		// 					UserService.getSystemUserEmails(function(err, emails){
		// 						if(err){
		// 					        sails.log.debug(err);
		// 							return callback(err);
		// 					    }

		// 					    if(!emails.length){
		// 					    	return callback(null);
		// 					    }

		// 					    var recipients = _.map(emails, 'email').join(',');
		// 					    sails.log.debug(recipients);

		// 					    var mailOptions = {
		// 						    from: 'akita.software@gmail.com', // sender address 
		// 						    //to: recipients, // list of receivers 
		// 						    to: 'akita.software@gmail.com',
		// 						    subject: 'Expiring Accounts', // Subject line 
		// 						    text: 'Hello World!', // plaintext body 
		// 						    html: '<b>Hello world</b>' // html body 
		// 						};

		// 						transporter.sendMail(mailOptions, function(error, info){
		// 						    if(error){
		// 						        sails.log.debug(error);
		// 								return callback(error);
		// 						    }

		// 						    callback(null);
		// 						});
		// 					});
		// 				}
		// 			});
		// 		}
		// 	});
		// }, function(err){
		// 	if(err){
		// 		cb(err);
		// 	}else{
		// 		cb(null);
		// 	}
		// });
	}
}