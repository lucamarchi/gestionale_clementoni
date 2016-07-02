/**
 * Created by luca on 20/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Product = require('./product');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var OrderSchema = new Schema({
    ddt: {type: Number, require: true},
    fornitore: {type: String},
    dataDdt: {type: Date},
    dataArrivo: {type: Date, default: Date.now },
    productsId: [{ type: Schema.ObjectId, ref: 'Product'}],
});

var orderModel = mongoose.model('Order', OrderSchema);
module.exports = orderModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        orderModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    findById: function(id) {
        var order = this.findOne({'_id': id});
        return order;
    },

    findAll: function() {
        var deferred = Q.defer();
        orderModel.find({}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    saveNewOrder: function(order) {
        var deferred = Q.defer();
        var newOrder = new orderModel();
        newOrder.ddt = order.ddt;
        newOrder.fornitore = order.fornitore;
        newOrder.dataDdt = order.dataDdt;
        newOrder.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newOrder);
            }
        });
        return deferred.promise;
    },


    updateOrder: function(orderId, query) {
        var deferred = Q.defer();
        orderModel.findByIdAndUpdate(orderId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    addProductToOrder: function(orderId,productId) {
        var query = {$push: {'productsId': productId}};
        var order = this.updateOrder(orderId, query);
        return order;
    },

    deleteOrder: function(orderId) {
        var deferred = Q.defer();
        var query = {'_id': orderId};
        orderModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    removeProductToOrder: function(productId) {
        var deferred = Q.defer();
        var query = {$pull: {'productsId': productId}};
        orderModel.findOneAndUpdate({productsId: productId},query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    modifyOrder: function(orderId, order) {
        var deferred = Q.defer();
        var query = {'_id': orderId};
        orderModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.ddt = order.ddt;
                    result.fornitore = order.fornitore;
                    result.dataDdt = order.dataDdt;
                }
                result.save(function(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(result);
                    }
                });
            }
        });
        return deferred.promise;
    }
};