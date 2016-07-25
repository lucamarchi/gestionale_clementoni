/**
 * Created by luca on 07/07/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Cut = require('./../models/cut');
var Product = require('./../models/product');
var Schema = mongoose.Schema;

var ReleaseSchema = new Schema({
    trasportatore: {type: String},
    dataSpedizione: {type: Date},
    tipoMezzo: {type: String},
    materiale: {type: String},
    autista: {type: String},
    targa: {type: String},
    note: {type: String},
    pesoTotale: {type: Number},
    unita: {type: Number},
    productsId: [{ type: Schema.ObjectId, ref: 'Product'}],
    cutsId: [{ type: Schema.ObjectId, ref: 'Cut'}]
});

releaseModel = mongoose.model('Release', ReleaseSchema);
module.exports = releaseModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        releaseModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var release = this.findOne({'_id': id});
        return release;
    },

    findAll: function() {
        var deferred = Q.defer();
        releaseModel.find({}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    saveNewRelease: function(release) {
        var deferred = Q.defer();
        var newRelease = new releaseModel();
        newRelease.trasportatore = release.trasportatore;
        newRelease.dataSpedizione = release.dataSpedizione;
        newRelease.materiale = release.materiale;
        newRelease.tipoMezzo = release.tipoMezzo;
        newRelease.autista = release.autista;
        newRelease.targa = release.targa;
        newRelease.note = release.note;
        newRelease.pesoTotale = release.pesoTotale;
        newRelease.unita = release.unita;
        newRelease.save(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(newRelease);
            }
        });
        return deferred.promise;
    },

    updateRelease: function(releaseId, query) {
        var deferred = Q.defer();
        releaseModel.findByIdAndUpdate(releaseId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    addProductToRelease: function(releaseId,productId) {
        var query = {$push: {'productsId': productId}};
        var release = this.updateRelease(releaseId, query);
        return release;
    },

    addCutToRelease: function(releaseId,cutId) {
        var query = {$push: {'cutsId': cutId}};
        var release = this.updateRelease(releaseId, query);
        return release;
    },

    removeProductToRelease: function(releaseId,productId) {
        var deferred = Q.defer();
        var query = {$pull: {'productsId': productId}};
        releaseModel.findOneAndUpdate({'_id': releaseId},query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    removeCutToRelease: function(releaseId,cutId) {
        var deferred = Q.defer();
        var query = {$pull: {'cutsId': cutId}};
        releaseModel.findOneAndUpdate({'_id': releaseId},query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    deleteRelease: function(releaseId) {
        var deferred = Q.defer();
        var query = {'_id': releaseId};
        releaseModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

};