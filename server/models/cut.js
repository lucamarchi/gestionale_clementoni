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
    nomeCliente: {type: String},
    date: {type: Date},
    accepted: {type: Boolean, default: false},
    operator: {type: String},
    articoli: [{ type: Schema.ObjectId, ref: 'Article'}],
    customer: {type: Schema.ObjectId, ref: 'Customer'},
    region: {type: String},
    provincia: {type: String},
    pesoTotale: {type: Number, default: 0},
    flag: {type: Boolean, default: false}
});

cutModel = mongoose.model('Cut', CutSchema);
module.exports = cutModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        cutModel.findOne(query).lean().exec(function(err,result) {
            if (err) {
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
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    deleteCut: function(id) {
        var deferred = Q.defer();
        var query = {'_id': id};
        cutModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
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
        newCut.clienteCod = cut.clienteCod;
        newCut.codice = cut.codice;
        newCut.anno = cut.anno;
        newCut.date = cut.date;
        newCut.note = cut.note;
        newCut.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newCut);
            }
        });
        return deferred.promise;
    },

    modifyCut: function(cutId,cut) {
        var deferred = Q.defer();
        var query = {'_id': cutId};
        cutModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.date = cut.date;
                    result.note = cut.note;
                }
                result.save(function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(result);
                    }
                });
            }
        });
        return deferred.promise;
    },

    removeArticleToCut: function(articleId) {
        var deferred = Q.defer();
        var query = {$pull: {'articoli': articleId}};
        cutModel.findOneAndUpdate({articoli: articleId},query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    setCutReady: function(cutId) {
        var query = {$set: {'flag': true}};
        var cut = this.updateCut(cutId,query);
        return cut;
    },

    findByArticle: function(articleId) {
        var query = {"articoli": articleId};
        var cut = this.findOne(query);
        return cut;
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
    },

    setOperatorToCut: function(cutId,operator) {
        var query = {$set: {'operator': operator}};
        var cut = this.updateCut(cutId,query);
        return cut;
    },

    addRegionToCut: function(cutId,region) {
        var query = {$set: {'region': region}};
        var cut = this.updateCut(cutId,query);
        return cut;
    },

    addNomeClienteToCut: function(cutId,nomeCliente) {
        var query = {$set: {'nomeCliente': nomeCliente}};
        var cut = this.updateCut(cutId,query);
        return cut;
    },

    addPRToCut: function(cutId,pr) {
        var query = {$set: {'provincia': pr}};
        var cut = this.updateCut(cutId,query);
        return cut;
    },

    findByRegion: function(region) {
        var deferred = Q.defer();
        var query = {'region': region};
        cutModel.find(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    increasePeso: function(cutId,peso) {
        var query = {$inc: {'pesoTotale': peso}};
        var cut = this.updateCut(cutId,query);
        return cut;
    }
    

};