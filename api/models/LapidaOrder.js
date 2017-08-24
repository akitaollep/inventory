/**
 * LapidaOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'lapidaOrders',
  	attributes: {
  		order: {
            model: 'Order',
            required: true
        },
        lapidaSize: {
        	type: 'string',
        	enum: ['30 x 40', '40 x 50', '50 x 60']
        },
        lapidaOption: {
        	type: 'string',
        	enum: ['Ordinary', 'Ordinary with picture', 'Black Granite', 'Black Granite with picture']
        },
        name: {
        	type: 'string',
        	required: true
        },
        dateOfBirth: {
        	type: 'datetime',
        	required: true
        },
        dateOfDeath: {
        	type: 'datetime',
        	required: true
        },
        message: {
        	type: 'string',
        	required: true
        }
  	}
};

