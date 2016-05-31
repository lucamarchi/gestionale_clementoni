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
    articoli: [{ type: Schema.ObjectId, ref: 'Article'}],
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
        cutModel.find({}).exec(function(err,result) {
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
        var query = {$push: {'articoli': articleId}};
        var cut = this.updateCut(cutId, query);
        return cut;
    },

    addCustomerToCut: function(customerId,cutId) {
        var query = {'customer': customerId};
        var cut = this.updateCut(cutId, query);
        return cut;
    },

    saveNewCut: function(cut) {
        var deferred = Q.defer();
        var newCut = new cutModel();
        newCut.ddt = cut.ddt;
        newCut.clienteCod = cut.clienteCod;
        newCut.codice = cut.codice;
        newCut.anno = cut.anno;
        newCut.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newCut);
            }
        });
        return deferred.promise;
    },

    setCutAccepted: function(cutId) {
        var query = {$set: {'accepted': true}};
        var cut = this.updateCut(cutId,query);
        return cut;
    },

    lastCutCod: function() {
        var deferred = Q.defer();
        var date = new Date().getFullYear();
        cutModel.findOne({"anno": date}).sort({"codice": -1}).limit(1).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            }
            if(!result) {
                var cod = 0;
                deferred.resolve(cod);
            } else {
                var cod = result.codice;
                deferred.resolve(cod);
            }
        });
        return deferred.promise;
    }
};