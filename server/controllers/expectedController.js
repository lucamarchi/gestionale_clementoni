/**
 * Created by luca on 04/04/17.
 */

var Q = require('q');
var Expected = require('./../models/expected');

module.exports = {

    createExpecteds: function(expecteds) {
        var deferred = Q.defer();
        Q.all(expecteds.map(function(currExpected) {
            return Expected.saveNewExpected(currExpected);
        })).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    modifyOrDeleteExpected: function(expecteds) {
        var deferred = Q.defer();
        var promises = [];
        expecteds.forEach(function(currExpected) {
            var newMethod;
            if (currExpected.pesoSaldo <= 0) {
                newMethod = Expected.deleteExpected(currExpected._id);
            } else {
                newMethod = Expected.modifyExpected(currExpected._id, currExpected);
            }
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

};