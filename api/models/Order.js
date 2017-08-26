/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'orders',
    attributes: {
        id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        orderDate: {
            type: 'datetime',
            required: true
        },
        respondentFirstName: {
            type: 'string',
            columnName: 'respondent_first_name'
        },
        respondentLastName: {
            type: 'string',
            columnName: 'respondent_last_name'
        },
        respondentMiddleName: {
            type: 'string',
            columnName: 'respondent_middle_name'
        },
        deceasedFirstName: {
            type: 'string',
            columnName: 'deceased_first_name'
        },
        deceasedLastName: {
            type: 'string',
            columnName: 'deceased_last_name'
        },
        deceasedMiddleName: {
            type: 'string',
            columnName: 'deceased_middle_name'
        },
        address: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        phoneNumber: {
            type: 'string'
        },
        mobileNumber: {
            type: 'string'
        },
        type: {
            type: 'string',
            enum: ['Renewal', 'Disinterment', 'Interment', 'Lot Sales', 'Tomb Marker / Lapida', 'Chapel', 'Others'],
            required: true
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
        status: {
            type: 'string',
            enum: ['Ordered', 'Expired', 'Partially Paid', 'Fully Paid', 'Deleted'],
            required: true
        },
        receipts: {
            collection: 'Receipt',
            via: 'order'
        },
        disintermentOrders: {
            collection: 'DisintermentOrder',
            via: 'order'
        },
        intermentOrders: {
            collection: 'IntermentOrder',
            via: 'order'
        },
        lapidaOrders: {
            collection: 'LapidaOrder',
            via: 'order'
        },
        lotSalesOrders: {
            collection: 'LotSalesOrder',
            via: 'order'
        },
        otherOrders: {
            collection: 'OtherOrder',
            via: 'order'
        },
        renewalOrders: {
            collection: 'RenewalOrder',
            via: 'order'
        }
    }
};