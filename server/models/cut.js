/**
 * Created by luca on 24/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');

var Schema = mongoose.Schema;

var CutSchema = new Schema({
    anno: {type: Number},
    codice: {type: Number},
    clienteCod: {type: Number},
    note: {type: String},
    date: {type: Date},
    accepted: {type: Boolean, default: false},
    operator: {type: String},
    articles: [{ type: Schema.ObjectId, ref: 'Article'}],
    customer: {type: Schema.ObjectId, ref: 'Customer'}
});

cutModel = mongoose.model('Cut', CutSchema);
module.exports = cutModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        cutModel.findOne(query).lean().exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("Cut not found");
                err.status = 400;
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var cut = this.findOne({'_id': id});
        return cut;
    },

    findAll: function() {
        var deferred = Q.defer();
        cutModel.findAll().exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("Cuts not found");
                err.status = 400;
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findAllAccepted: function() {
        var deferred = Q.defer();
        cutModel.find({'accepted': true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("No cut accepted found");
                err.status = 400;
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    updateCut: function(cutId,query) {
        var deferred = Q.defer();
        cutModel.findByIdAndUpdate(cutId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    addArticleToCut: function(articleId,cutId) {
        var query = {$push: {'articles': articleId}};
        var cut = this.updateCut(articleId, query);
        return cut;
    },

    addCustomerToCut: function(customerId,cutId) {
        var query = {'customer': customerId};
        var cut = this.updateCut(customerId, query);
        return cut;
    },

    saveNewCut: function(cut) {
        var deferred = Q.defer();
        var newCut = new cutModel();
        newCut.ddt = order.ddt;
        newCut.codice(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newCut);
            }
        });
        return deferred.promise;
    },

};