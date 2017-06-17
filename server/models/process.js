/**
 * Created by luca on 03/06/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Schema = mongoose.Schema;
var Article = require('./article');
var Product = require('./product');

var ProcessSchema = new Schema({
    macchina: {type: String},
    operatore: {type: String},
    scarto: {type: Number},
    data: {type: Date, default: Date.now},
    figli: {type: Schema.ObjectId, ref: 'Product'},
    article: {type: Schema.ObjectId, ref: 'Article'},
    product: [{type: Schema.ObjectId, ref: 'Product'}]
});

processModel = mongoose.model('Process', ProcessSchema);
module.exports = processModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        processModel.findOne(query).lean().exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var query = {'_id': id};
        var process = this.findOne(query);
        return process;
    },

    findAll: function() {
        var deferred = Q.defer();
        processModel.find({}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("Process not found");
                err.status = 400;
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    saveNewProcess: function(process) {
        var deferred = Q.defer();
        var newProcess = new processModel();
        newProcess.macchina = process.machinery;
        newProcess.scarto = process.scarto;
        newProcess.operatore = process.operatore;
        newProcess.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newProcess);
            }
        });
        return deferred.promise;
    },

    updateProcess: function(processId,query) {
        var deferred = Q.defer();
        processModel.findByIdAndUpdate(processId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    setFiglioToProcess: function(processId,productId) {
        var query = {'figli': productId};
        var process = this.updateProcess(processId, query);
        return process;
    },

    setArticleToProcess: function(processId,articleId) {
        var query = {'article': articleId};
        var process = this.updateProcess(processId, query);
        return process;
    },

    addProductToProcess: function(processId,productId) {
        var query = {$push: {'product': productId}};
        var process = this.updateProcess(processId, query);
        return process;
    },

    findByArticle: function(articleId) {
        var deferred = Q.defer();
        processModel.find({'article': {$in: articleId}}).exec(function(err,results) {
            if (err) {
                deferred.reject(err);
            } else {
                if (results && results.length > 0) {
                    deferred.resolve(results);
                } else {
                    var err = new Error("Process with article not found");
                    err.status = 400;
                    deferred.reject(err);
                }
            }
        });
        return deferred.promise;
    },

    findByProduct: function(productId) {
        var deferred = Q.defer();
        processModel.find({'product': productId}).exec(function(err,results) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        });
        return deferred.promise;
    }


};