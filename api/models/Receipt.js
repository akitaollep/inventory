/**
 * Receipt.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'receipts',
  	attributes: {
  		id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        orNumber: {
            type: 'string',
            unique: true
        },
        receiptDate: {
            type: 'datetime'
        },
        sales: {
            type: 'float'
        },
        vat: {
            type: 'float'
        },
        discount: {
            type: 'float'
        },
        amount: {
            type: 'float'
        },
        order: {
            model: 'Order'
        },
        notes: {
            type: 'string'
        }
  	}
};

