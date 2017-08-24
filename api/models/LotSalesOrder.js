/**
 * LotSalesOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'lotSalesOrders',
    attributes: {
        order: {
            model: 'Order',
            required: true
        },
        paymentMode: {
          type: 'string',
          enum: ['3 months', '6 months', '1 year', '2 years', '3 years', '4 years', '5 years'],
          required: true
        }
    }
};

