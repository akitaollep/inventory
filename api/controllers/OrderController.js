/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var pdf = require('html-pdf');
var fs = require('fs');
var moment = require('moment');

module.exports = {
	getOrder: function(req, res){
		Order.findOne({id: req.params.id})
		.populate('disintermentOrders')
		.populate('intermentOrders')
		.populate('lapidaOrders')
		.populate('lotSalesOrders')
		.populate('otherOrders')
		.populate('renewalOrders')
		.populate('receipts')
		.exec(function(err, order){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}

			if(order.disintermentOrders.length){
				order.orderDetails = order.disintermentOrders[0];
			}else if(order.intermentOrders.length){
				order.orderDetails = order.intermentOrders[0];
			}else if(order.lapidaOrders.length){
				order.orderDetails = order.lapidaOrders[0];
			}else if(order.lotSalesOrders.length){
				order.orderDetails = order.lotSalesOrders[0];
			}else if(order.otherOrders.length){
				order.orderDetails = order.otherOrders[0];
			}else if(order.renewalOrders.length){
				order.orderDetails = order.renewalOrders[0];
			}

			sails.log.info(order);
			res.ok(order);
		});
	},
	getOrders: function(req, res){
		var subfilter = {};

		if(req.query && req.query.type && req.query.type == 'renewals'){
			Order.find({
				type: ['Renewal', 'Interment', 'Disinterment'],
				status : ['Ordered', 'Expired']
			})
			.populate('disintermentOrders')
			.populate('intermentOrders')
			.populate('lapidaOrders')
			.populate('lotSalesOrders')
			.populate('otherOrders')
			.populate('renewalOrders')
			.exec(function(err, orders){
				if(err){
					sails.log.error(err);
					return res.serverError();
				}

				var result = [];
				var expirationDateLimit = moment().add(1, 'month').startOf('month').format('YYYY-MM-DD');

				for(var index in orders){
					var order = orders[index];

					//sails.log(order);

					//if(order.type == 'Renewal' || order.type == 'Interment' || order.type == 'Disinterment'){
					if(order.type == 'Renewal' || order.type == 'Interment'){
						if(order.intermentOrders.length){
							order.orderDetails = order.intermentOrders[0];
						}else if(order.renewalOrders.length){
							order.orderDetails = order.renewalOrders[0];
						}

						if(order.orderDetails && moment(order.orderDetails.expirationDate).isBefore(expirationDateLimit)){
							result.push(order);
						}
					}else{
						continue;
					}
				}

				res.ok(result);
			});
		}else{
			sails.log.debug('Start of call: ' + new Date());
			Order.find({
				status : ['Ordered', 'Expired']
			})
			.populate('disintermentOrders')
			.populate('intermentOrders')
			.populate('lapidaOrders')
			.populate('lotSalesOrders')
			.populate('otherOrders')
			.populate('renewalOrders')
			.exec(function(err, orders){
				if(err){
					sails.log.error(err);
					return res.serverError();
				}

				for(var index in orders){
					var order = orders[index];

					if(order.disintermentOrders.length){
						order.orderDetails = order.disintermentOrders[0];
					}else if(order.intermentOrders.length){
						order.orderDetails = order.intermentOrders[0];
					}else if(order.lapidaOrders.length){
						order.orderDetails = order.lapidaOrders[0];
					}else if(order.lotSalesOrders.length){
						order.orderDetails = order.lotSalesOrders[0];
					}else if(order.otherOrders.length){
						order.orderDetails = order.otherOrders[0];
					}else if(order.renewalOrders.length){
						order.orderDetails = order.renewalOrders[0];
					}
				}

				sails.log.debug('End of call: ' + new Date());
				res.ok(orders);
			});
		}
	},
	saveOrder: function(req, res){
		var order = {
			orderDate: (req.body.orderDate) ? new Date(req.body.orderDate) : undefined,
			deceasedFirstName: (req.body.deceasedFirstName) ? req.body.deceasedFirstName : undefined,
			deceasedLastName: (req.body.deceasedLastName) ? req.body.deceasedLastName : undefined,
			deceasedMiddleName: (req.body.deceasedMiddleName) ? req.body.deceasedMiddleName : undefined,
			respondentFirstName: (req.body.respondentFirstName) ? req.body.respondentFirstName : undefined,
			respondentLastName: (req.body.respondentLastName) ? req.body.respondentLastName : undefined,
			respondentMiddleName: (req.body.respondentMiddleName) ? req.body.respondentMiddleName : undefined,
			address: (req.body.address) ? req.body.address : undefined,
			email: (req.body.email) ? req.body.email : undefined,
			phoneNumber: (req.body.phoneNumber) ? req.body.phoneNumber : undefined,
			mobileNumber: (req.body.mobileNumber) ? req.body.mobileNumber : undefined,
			sales: (req.body.sales) ? req.body.sales : undefined,
			vat: (req.body.vat) ? req.body.vat : undefined,
			amount: (req.body.amount) ? req.body.amount : undefined,
			type: (req.body.type) ? req.body.type : undefined
		};

		sails.log.debug('Saving order: ' + JSON.stringify(order));

		if(!order.orderDate){
			sails.log.error('Order Date cannot be null');
			return res.badRequest('Order Date cannot be empty');
		}

		if(req.params.id){
			async.waterfall([
				function(callback){
					Order.update({id:req.params.id}, order).exec(function(err, result){
						if(!err){
							sails.log.debug('Updated order: ' + JSON.stringify(result));
						}
						
						callback(err, result);
					});
				},
				function(savedOrder, callback){
					if(savedOrder && savedOrder.length){
						Order.findOne({id: savedOrder[0].id})
						.populate('disintermentOrders')
						.populate('intermentOrders')
						.populate('lapidaOrders')
						.populate('lotSalesOrders')
						.populate('otherOrders')
						.populate('renewalOrders')
						.exec(function(err, order){
							callback(err, order);
						});
					}else{
						callback('An error has occurred while saving the order: Error 700');
					}
				},
				function(savedOrder, callback){
					if(!savedOrder){
						return callback('An error has occurred while saving the order: Error 700');
					}

					var OrderType = undefined;
					var attrs = undefined;
					var id = undefined;

					switch(savedOrder.type){
						case 'Renewal':
							OrderType = RenewalOrder;

							if(savedOrder.renewalOrders.length){
								id = savedOrder.renewalOrders[0].id;
							}

							attrs = {
								order: savedOrder.id,
								date: (req.body.orderDetails.date) ? new Date(req.body.orderDetails.date) : undefined,
								expirationDate: (req.body.orderDetails.expirationDate) ? new Date(req.body.orderDetails.expirationDate) : undefined,
								lotType: (req.body.orderDetails.lotType) ? req.body.orderDetails.lotType : undefined,
								property: (req.body.orderDetails.property) ? req.body.orderDetails.property : undefined,
								type: (req.body.orderDetails.type) ? req.body.orderDetails.type : undefined
							};

							// if(!attrs.date){
							// 	sails.log.error('Date cannot be null');
							// 	return res.badRequest('Date cannot be empty');
							// }

							// if(!attrs.expirationDate){
							// 	sails.log.error('Expiration Date cannot be null');
							// 	return res.badRequest('Expiration Date cannot be empty');
							// }

							break;
						case 'Disinterment':
							OrderType = DisintermentOrder;

							if(savedOrder.disintermentOrders.length){
								id = savedOrder.disintermentOrders[0].id;
							}

							attrs = {
								order: savedOrder.id,
								date: (req.body.orderDetails.date) ? new Date(req.body.orderDetails.date) : undefined,
								//expirationDate: (req.body.orderDetails.expirationDate) ? new Date(req.body.orderDetails.expirationDate) : undefined,
								lotType: (req.body.orderDetails.lotType) ? req.body.orderDetails.lotType : undefined,
								property: (req.body.orderDetails.property) ? req.body.orderDetails.property : undefined
							};

							if(!attrs.date){
								sails.log.error('Date cannot be null');
								return res.badRequest('Date cannot be empty');
							}

							break;
						case 'Interment':
							OrderType = IntermentOrder;

							if(savedOrder.intermentOrders.length){
								id = savedOrder.intermentOrders[0].id;
							}

							attrs = {
								order: savedOrder.id,
								date: (req.body.orderDetails.date) ? new Date(req.body.orderDetails.date) : undefined,
								expirationDate: (req.body.orderDetails.expirationDate) ? new Date(req.body.orderDetails.expirationDate) : undefined,
								lotType: (req.body.orderDetails.lotType) ? req.body.orderDetails.lotType : undefined,
								property: (req.body.orderDetails.property) ? req.body.orderDetails.property : undefined,
								type: (req.body.orderDetails.type) ? req.body.orderDetails.type : undefined
							};

							if(!attrs.date){
								sails.log.error('Date cannot be null');
								return res.badRequest('Date cannot be empty');
							}

							if(!attrs.expirationDate){
								sails.log.error('Expiration Date cannot be null');
								return res.badRequest('Expiration Date cannot be empty');
							}

							break;
						case 'Lot Sales':
							OrderType = LotSalesOrder;

							if(savedOrder.lotSalesOrders.length){
								id = savedOrder.lotSalesOrders[0].id;
							}

							attrs = {
								order: savedOrder.id,
								paymentMode: (req.body.orderDetails.paymentMode) ? req.body.orderDetails.paymentMode : undefined
							};
							break;
						case 'Tomb Marker / Lapida':
							OrderType = LapidaOrder;

							if(savedOrder.lapidaOrders.length){
								id = savedOrder.lapidaOrders[0].id;
							}

							attrs = {
								order: savedOrder.id,
								size: (req.body.orderDetails.size) ? req.body.orderDetails.size : undefined,
								options: (req.body.orderDetails.options) ? req.body.orderDetails.options : undefined,
								name: (req.body.orderDetails.name) ? req.body.orderDetails.name : undefined,
								dateOfBirth: (req.body.orderDetails.dateOfBirth) ? new Date(req.body.orderDetails.dateOfBirth) : undefined,
								dateOfDeath: (req.body.orderDetails.dateOfDeath) ? new Date(req.body.orderDetails.dateOfDeath) : undefined,
								message: (req.body.orderDetails.message) ? req.body.orderDetails.message : undefined
							};
							break;
						case 'Others':
							OrderType = OtherOrder;

							if(savedOrder.otherOrders.length){
								id = savedOrder.otherOrders[0].id;
							}

							attrs = {
								order: savedOrder.id,
								type: (req.body.orderDetails.otherType) ? req.body.orderDetails.otherType : undefined
							};
							break;
					}

					if(OrderType){
						OrderType.update(id, attrs).exec(function(err, result){
							if(!err){
								sails.log.debug('Created order type: ' + JSON.stringify(result));
							}
							
							callback(err, savedOrder);
						});
					}else{
						callback(null, savedOrder);
					}
				},
				function(savedOrder, callback){
					if(!savedOrder){
						return callback('An error has occurred while saving the order: Error 700');
					}

					Order.findOne({id: savedOrder.id})
					.populate('disintermentOrders')
					.populate('intermentOrders')
					.populate('lapidaOrders')
					.populate('lotSalesOrders')
					.populate('otherOrders')
					.populate('renewalOrders')
					.exec(function(err, order){
						callback(err, order);
					});
				}
			], function(err, result){
				if(err){
					sails.log.error(err);
					return res.serverError(err);
				}
				res.json(result);
			});

		}else{
			order.status = 'Ordered';

			async.waterfall([
				function(callback){
					Order.create(order).exec(function(err, result){
						if(!err){
							sails.log.debug('Created order: ' + JSON.stringify(result));
						}
						
						callback(err, result);
					});
				},
				function(savedOrder, callback){
					var OrderType = undefined;
					var attrs = undefined;

					switch(savedOrder.type){
						case 'Renewal':
							OrderType = RenewalOrder;
							attrs = {
								order: savedOrder.id,
								date: (req.body.intermentDate) ? new Date(req.body.intermentDate) : undefined,
								expirationDate: (req.body.expirationDate) ? new Date(req.body.expirationDate) : undefined,
								lotType: (req.body.lotType) ? req.body.lotType : undefined,
								property: (req.body.property) ? req.body.property : undefined,
								type: (req.body.intermentType) ? req.body.intermentType : undefined
							};

							if(!attrs.date){
								sails.log.error('Date cannot be null');
								return res.badRequest('Date cannot be empty');
							}

							if(!attrs.expirationDate){
								sails.log.error('Expiration Date cannot be null');
								return res.badRequest('Expiration Date cannot be empty');
							}

							break;
						case 'Disinterment':
							OrderType = DisintermentOrder;
							attrs = {
								order: savedOrder.id,
								date: (req.body.orderDate) ? new Date(req.body.orderDate) : undefined,
								//expirationDate: (req.body.expirationDate) ? new Date(req.body.expirationDate) : undefined,
								lotType: (req.body.lotType) ? req.body.lotType : undefined,
								property: (req.body.property) ? req.body.property : undefined,
								type: (req.body.intermentType) ? req.body.intermentType : undefined
							};

							if(!attrs.date){
								sails.log.error('Date cannot be null');
								return res.badRequest('Date cannot be empty');
							}

							break;
						case 'Interment':
							OrderType = IntermentOrder;
							attrs = {
								order: savedOrder.id,
								date: (req.body.intermentDate) ? new Date(req.body.intermentDate) : undefined,
								expirationDate: (req.body.expirationDate) ? new Date(req.body.expirationDate) : undefined,
								lotType: (req.body.lotType) ? req.body.lotType : undefined,
								property: (req.body.property) ? req.body.property : undefined,
								type: (req.body.intermentType) ? req.body.intermentType : undefined
							};

							if(!attrs.date){
								sails.log.error('Date cannot be null');
								return res.badRequest('Date cannot be empty');
							}

							if(!attrs.expirationDate){
								sails.log.error('Expiration Date cannot be null');
								return res.badRequest('Expiration Date cannot be empty');
							}

							break;
						case 'Lot Sales':
							OrderType = LotSalesOrder;
							attrs = {
								order: savedOrder.id,
								paymentMode: (req.body.paymentMode) ? req.body.paymentMode : undefined
							};
							break;
						case 'Tomb Marker / Lapida':
							OrderType = LapidaOrder;
							attrs = {
								order: savedOrder.id,
								lapidaSize: (req.body.lapidaSize) ? req.body.lapidaSize : undefined,
								lapidaOption: (req.body.lapidaOption) ? req.body.lapidaOption : undefined,
								name: (req.body.name) ? req.body.name : undefined,
								dateOfBirth: (req.body.dateOfBirth) ? new Date(req.body.dateOfBirth) : undefined,
								dateOfDeath: (req.body.dateOfDeath) ? new Date(req.body.dateOfDeath) : undefined,
								message: (req.body.message) ? req.body.message : undefined
							};
							break;
						case 'Others':
							OrderType = OtherOrder;
							attrs = {
								order: savedOrder.id,
								type: (req.body.otherType) ? req.body.otherType : undefined
							};
							break;
					}

					if(OrderType){

						sails.log.debug(attrs);

						OrderType.create(attrs).exec(function(err, result){
							if(!err){
								sails.log.debug('Created order type: ' + JSON.stringify(result));
							}
							
							callback(err, savedOrder);
						});
					}else{
						callback(null, savedOrder);
					}
				},
				function(savedOrder, callback){
					Order.findOne({id: savedOrder.id}).exec(function(err, order){
						callback(err, order);
					});
				}
			], function(err, result){
				if(err){
					sails.log.error(err);

					sails.log.debug('Destroying saved order: ' + result.id);
					Order.destroy({id: result.id}).exec(function(err){
						return res.serverError();
					});
				}

				res.json(result);
			});
		}
	},
	generateReceipt: function(req, res){
		sails.hooks.views.render('sample', {layout: 'sample'}, function(err, html){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}

			pdf.create(html).toStream(function(err, stream){
				stream.pipe(res);
			});
		});
	},
	deleteOrder: function(req, res){
		Order.update({id: req.params.id}, {status: 'Deleted'}).exec(function(err, order){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}else{
				res.ok(order);
			}
		});
	},
	getTypes: function(req, res){
		res.ok(Order._attributes.type.enum);
	},
	getOrderTypes: function(req, res){
		res.ok(RenewalOrder._attributes.type.enum);
	},
	getLotTypes: function(req, res){
		res.ok(RenewalOrder._attributes.lotType.enum);
	},
	getPaymentModes: function(req, res){
		res.ok(LotSalesOrder._attributes.paymentMode.enum);
	},
	getLapidaSize: function(req, res){
		res.ok(LapidaOrder._attributes.lapidaSize.enum);
	},
	getLapidaOptions: function(req, res){
		res.ok(LapidaOrder._attributes.lapidaOption.enum);
	}
};