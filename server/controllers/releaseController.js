/**
 * Created by luca on 18/04/17.
 */

var Q = require('q');
var Release = require('./../models/release');
var Article = require('./../models/article');


module.exports = {

    createRelease: function(release) {
        var deferred = Q.defer();
        Release.saveNewRelease(release).then(function(currRelease) {
            Release.findNewNumeroRelease().then(function(number) {
                var query = {'numero': number};
                Release.updateRelease(currRelease._id, query).then(function(result) {
                    deferred.resolve(result);
                });
            });
        }).catch(function(err) {
           deferred. reject(err);
        });
        return deferred.promise;
    },

    addProductsToRelease: function(release,products) {
        var deferred = Q.defer();
        var promises = [];
        var pesoTotale = 0;
        products.forEach(function(currProduct) {
            var newMethod = Release.addProductToRelease(release._id,currProduct._id);
            pesoTotale += currProduct.pesoNetto;
            promises.push(newMethod);
        });
        promises.push(Release.addPesoTotaleToRelease(release._id,pesoTotale));
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    createTriplaArticlesToRelease: function(release,articles) {
        var deferred = Q.defer();
        var promises = [];
        articles.forEach(function(currArticle) {
            var peso = currArticle.pesoSelezionato;
            var quantita = currArticle.quantitaSelezionata;
            var unita = currArticle.unita;
            var triplaArticle = { "article": currArticle._id, "quantita": quantita, "unita": unita, "peso": peso };
            var newMethod = Release.addArticleToRelease(release.id,triplaArticle);
            var newMethodStat = Article.setArticleStatusEvas(currArticle._id, "assegnato");
            var newMethodScalaArt = Article.updatePesoAttualeArticle(currArticle._id,currArticle.pesoAttuale);
            promises.push(newMethod);
            promises.push(newMethodStat);
            promises.push(newMethodScalaArt);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    removeRelease: function(releaseId) {
        var deferred = Q.defer();
        var promises = [];
        Release.findById(releaseId).then(function(release) {
            if (release && release.articlesId && release.articlesId.length > 0) {
                var articles = result.articlesId;
                articles.forEach(function(currArticle) {
                    var newMethod = Article.setArticleStatusEvas(currArticle.article,"libero");
                    promises.push(newMethod);
                });
            }
            promises.push(Release.deleteRelease(releaseId));
            Q.all(promises).then(function(result) {
                deferred.resolve(result);
            });
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    setReleaseComplete: function(releaseId) {
        var deferred = Q.defer();
        Release.setReleaseComplete(releaseId).then(function(result) {
            if (result.articlesId && result.articlesId.length > 0) {
                var articles = result.articlesId;
                var promises = [];
                articles.forEach(function (currArticle) {
                    var newMethod1 = Article.setArticleStatusEvas(currArticle.article, "evaso");
                    var newMethod2 = Article.setArticleStatusProd(currArticle.article, "evaso");
                    promises.push(newMethod1);
                    promises.push(newMethod2)
                });
                Q.all(promises).then(function (res) {
                    deferred.resolve(res);
                });
            } else {
                deferred.resolve(result);
            }
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    retrieveArticles: function(release) {
        var deferred = Q.defer();
        var triples = release.articlesId;
        var promises = [];
        triples.forEach(function(currElem) {
            promises.push(Article.findById(currElem.article));
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

};