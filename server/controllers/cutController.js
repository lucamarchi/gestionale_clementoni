/**
 * Created by luca on 05/04/17.
 */

var Q = require('q');
var Cut = require('./../models/cut');
var Article = require('./../models/article');
var articleController = require('./../controllers/articleController');
var request = require('./../controllers/requestController');

module.exports = {

    retrieveNewCuts: function() {
        var deferred = Q.defer();
        Cut.lastCutCod().then(function (result) {
            var date = new Date().getFullYear();
            var newCod = result + 1;
            request.findNewCuts(date, newCod).then(function (cuts) {
                var finalCuts = [];
                if (cuts && cuts.length > 0) {
                    Q.all(cuts.map(function(currCut) {
                        return Cut.saveNewCut(currCut).then(function (cut) {
                            finalCuts.push(cut);
                            return Q.all(currCut.articoli.map(function (currArticle) {
                                return Article.saveNewArticle(currArticle).then(function (article) {
                                    return Cut.increasePeso(cut.id, article.pesoAttuale).then(function(res) {
                                        return Cut.addArticleToCut(article.id, cut.id)
                                    });
                                });
                            }));
                        });
                    })).then(function() {
                        deferred.resolve(finalCuts);
                    });
                } else deferred.resolve(finalCuts);
            });
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    acceptedCut: function(cutId, operator) {
        var deferred = Q.defer();
        Cut.setCutAccepted(cutId).then(function(cut) {
            Cut.setOperatorToCut(cutId, operator).then(function(result) {
                deferred.resolve(result);
            });
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    checkArticlesInCut: function(articleId) {
        var deferred = Q.defer();
        Cut.findByArticle(articleId).then(function(cut) {
            if ((cut && cut !== null) && (cut.articoli && cut.articoli.length > 0)) {
                var articles = cut.articoli;
                articleController.checkArticlesLength(articles).then(function(result) {
                    if (result == true) {
                        Cut.setCutReady(cut._id).then(function() {
                            deferred.resolve(true);
                        });
                    } else {
                        deferred.resolve(false);
                    }
                });
            } else deferred.resolve(false);
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    }

};