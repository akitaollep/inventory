/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

//var bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');

module.exports = {
    attributes: {
        id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        username: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            minLength: 6,
            required: true
        },
        firstName: {
            type: 'string',
            columnName: 'firstname'
        },
        lastName: {
            type: 'string',
            columnName: 'lastname'
        },
        role: {
            type: 'string',
            enum: ['Admin', 'Encoder'],
            required: true
        },
        status: {
            type: 'string',
            enum: ['New', 'Active', 'Deleted'],
            required: true
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    },
    beforeUpdate: function(user, cb) {
        if(user.password){
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        console.log(err);
                        cb(err);
                    } else {
                        user.password = hash;
                        cb();
                    }
                });
            });
        }else{
            cb();
        }
    }
};

