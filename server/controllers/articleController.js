/**
 * Created by luca on 05/04/17.
 */

var Q = require('q');
var Article = require('./../models/article');
var Cut = require('./../models/cut');

module.exports = {

    retrieveArticles: function(articlesId) {
        var deferred = Q.defer();
        var promises = [];
        articlesId.forEach(function(currArticle) {
            var newMethod = Article.findById(currArticle);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    setArticleInit: function(articleId,status) {
        var deferred = Q.defer();
        var promises = [];
        promises.push(Article.setArticleStatusProd(articleId,status));
        promises.push(Article.setArticleStatusEvas(articleId,status));
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },


    setArticlesInit: function(articlesId,status) {
        var deferred = Q.defer();
        var promises = [];
        articlesId.forEach(function(currArticle) {
            var newMethodProd = Article.setArticleStatusProd(currArticle,status);
            var newMethodEvas = Article.setArticleStatusEvas(currArticle,status);
            promises.push(newMethodProd);
            promises.push(newMethodEvas);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    setArrayArticlesStatusProd: function(articlesId,status) {
        var deferred = Q.defer();
        var promises = [];
        articlesId.forEach(function(currArticle) {
            var newMethod = Article.setArticleStatusProd(currArticle._id,status);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    setArticlesStatusProd: function(articlesId,status) {
        var deferred = Q.defer();
        var promises = [];
        articlesId.forEach(function(currArticle) {
            var newMethod = Article.setArticleStatusProd(currArticle,status);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    setArticlesStatusEvas: function(articlesId,status) {
        var deferred = Q.defer();
        var promises = [];
        articlesId.forEach(function(currArticle) {
            var newMethod = Article.setArticleStatusEvas(currArticle,status);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    deleteArticle: function(articleId) {
        var deferred = Q.defer();
        var promises = [
            Article.deleteArticle(articleId),
            Cut.removeArticleToCut(articleId)
        ];
        Q.all(promises).then(function() {
            deferred.resolve();
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    deleteArticles: function(articlesId) {
        var deferred = Q.defer();
        var promises = [];
        articlesId.forEach(function(currArticle) {
           var newMethod = Article.deleteArticle(currArticle);
            promises.push(newMethod);
        });
        Q.all(promises).then(function() {
            deferred.resolve();
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    checkArticlesLength: function(articlesId) {
        var deferred = Q.defer();
        var promises = [];
        articlesId.forEach(function(currArticle) {
            var newMethod = Article.findById(currArticle);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(articles) {
            var check = true;
            articles.forEach(function(currArticles) {
                if (!currArticles.lunghezzaAssegnata && !currArticles.larghezzaAssegnata && !currArticles.qualita) {
                    check = false;
                }
            });
            deferred.resolve(check);
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    }

};