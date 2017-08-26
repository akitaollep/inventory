/**
 * ReceiptController
 *
 * @description :: Server-side logic for managing receipts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var pdf = require('html-pdf');
var fs = require('fs');
var moment = require('moment');
var formatNumber = require('format-number');
var numbered = require('numbered');

module.exports = {
	getReceipt: function(req, res){
		Receipt.findOne({id: req.params.id}).exec(function(err, receipt){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}

			res.ok(receipt);
		});
	},
	getReceipts: function(req, res){
		Receipt.find({order: req.params.orderId}).exec(function(err, receipts){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}

			//res.json(orders);
			res.ok(receipts);
		});
	},
	saveReceipt: function(req, res){
		var receipt = {
			receiptDate: (req.body.receiptDate) ? new Date(req.body.receiptDate) : undefined,
			sales: (req.body.sales) ? req.body.sales : undefined,
			vat: (req.body.vat) ? req.body.vat : undefined,
			amount: (req.body.amount) ? req.body.amount : undefined,
			order: (req.body.order) ? req.body.order : undefined,
			notes: (req.body.notes) ? req.body.notes : undefined
		};

		Receipt.create(receipt).exec(function(err, result){
			if(err){
				sails.log.error(err);

				if(err.message.indexOf('A record with that `orNumber` already exists') > -1){
					return res.badRequest('A Receipt with that OR Number already exists');
				}else{
					return res.badRequest(err.message);
				}
			}

			sails.log.debug('Created receipt: ' + JSON.stringify(result));
			Receipt.findOne({id: result.id}).populate('order').exec(function(err, receipt){
				if(err){
					sails.log.error(err);
					return res.serverError();
				}

				res.json(receipt);
			});
		});
	},
	issueOR: function(req, res){
		sails.log.debug('receipt id: ' + req.params.receiptId);
		sails.log.debug('or: ' + req.body.orNumber);

		Receipt.update({id: req.params.receiptId}, {
			orNumber: (req.body.orNumber) ? req.body.orNumber : undefined
		}).exec(function(err, result){
			if(err){
				sails.log.error(err);

				if(err.message.indexOf('A record with that `orNumber` already exists') > -1){
					return res.badRequest('A Receipt with that OR Number already exists');
				}else{
					return res.badRequest(err.message);
				}
			}

			sails.log.debug('Issued OR receipt: ' + JSON.stringify(result));
			Order.findOne({id: result[0].order}).populate('receipts').exec(function(err, order){
				if(err){
					sails.log.error(err);
					return res.serverError();
				}

				res.json(order.receipts);
			});
		});
	},
	printReceipt: function(req, res){
		async.waterfall([
			function(callback){
				Receipt.findOne({id: req.params.id})
				.populate('order')
				.exec(function(err, receipt){
					callback(err, receipt);
				});
			}
		], function(err, receipt){
			if(err){
				sails.log.error(err);
				return res.serverError();
			}

			receipt.receiptDate = moment(receipt.receiptDate).format('MM/DD/YYYY');
			//receipt.amount = parseFloat(receipt.amount).toFixed(2);
			//receipt.amountInWords = numbered.stringify(parseFloat(receipt.amount).toFixed(2));

			var wholeNumber = parseInt(receipt.amount);
			var decimalNumber = parseFloat(receipt.amount) % 1;
			decimalNumber = parseInt(decimalNumber * 100);
			var wholeNumberInWords = numbered.stringify(wholeNumber);
			var decimalNumberInWords = numbered.stringify(decimalNumber);

			receipt.amountInWords = wholeNumberInWords + ' pesos';
			if(decimalNumber > 0){
				receipt.amountInWords += ' and ' + decimalNumberInWords + ' centavos';
			}

			receipt.amount = formatNumber()(parseFloat(receipt.amount).toFixed(2));

			sails.hooks.http.app.render('sample', {receipt: receipt}, function(err, html){
				if(err){
					sails.log.error(err);
					return res.serverError();
				}

				var config = {
					height: '6.5in',
					width: '9.5in'
				};

				pdf.create(html, config).toStream(function(err, stream){
					if(err){
						sails.log.error(err);
						return res.serverError();
					}

					stream.pipe(res);
				});
			});
		});
	}
};

