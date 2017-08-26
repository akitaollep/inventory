/**
 * Payment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  	tableName: 'payments',
  	attributes: {
  		id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        sales: {
            type: 'float'
        },
        vat: {
            type: 'float'
        },
        amount: {
            type: 'float'
        },
        category: {
            model: 'Order'
        }
  	}
};

