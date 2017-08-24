/**
 * RenewalOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'renewalOrders',
  	attributes: {
  		order: {
            model: 'Order',
            required: true
        },
        date: {
            type: 'datetime',
            required: true
        },
        expirationDate: {
            type: 'datetime',
            required: true
        },
        type: {
        	type: 'string',
        	enum: ['Memorial Lot', 'Tomb', 'Vault', 'Apartment', 'Ossuary', 'Columbary']
        },
        property: {
        	type: 'string'
        },
        lotType: {
        	type: 'string',
        	enum: ['ML (Manoling Lot)', 'PL (Paquito Lot)']
        }
  	}
};

