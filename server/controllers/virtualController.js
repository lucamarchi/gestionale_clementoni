/**
 * Created by luca on 06/06/17.
 */

var Q = require('q');
var _ = require('lodash');
var Article = require('./../models/article');
var Product = require('./../models/product');
var Expected = require('./../models/expected');

module.exports = {

    groupProductByProps: function() {
        var deferred = Q.defer();
        var groupedStocks = [];
        Product.findAll().then(function(stocks) {
            if (stocks.length == 0) {
                deferred.resolve([groupedStocks]);
            } else {
                groupedStocks = groupByMulti(stocks,["tipo","qualita","spessoreEffettivo","materiale"]);
                deferred.resolve(groupedStocks);
            }
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    groupArticlesByProps: function() {
        var deferred = Q.defer();
        var groupedArticle = [];
        Article.findAllWithLength().then(function(articles) {
            if (articles.length == 0) {
                deferred.resolve([groupedArticle]);
            } else {
                groupedArticle = groupByMulti(articles,["tipo","qualita","spessore","materiale"]);
                deferred.resolve(groupedArticle);
            }
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    groupExpectedsByProps: function() {
        var deferred = Q.defer();
        var groupedExpected = [];
        Expected.findAll().then(function(expecteds) {
            if (expecteds.length == 0) {
                deferred.resolve([groupedExpected]);
            } else {
                groupedExpected = groupByMulti(expecteds,["tipo","qualita","spessore","materiale"]);
                deferred.resolve(groupedExpected);
            }
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    mergeDifferentGroups: function(stocks,articles,expecteds) {
        var tmpGroup = [];
        _.each(stocks,function(currStockBlock) {
            var tableElem = groupRowTableStock(currStockBlock);
            tmpGroup.push(tableElem);
        });
        for (var i=0; i<articles.length; i++) {

        }
    }

};

var groupByMulti = function(list,values) {
    var grouped = [];
    _.each(list, function(currElem) {
        var index = checkIndex(grouped,currElem,values);
        if (index == -1) {
            grouped.push([currElem]);
        } else {
            grouped[index].push(currElem);
        }
    });
    return grouped;
};

var checkIndex = function(grouped,element,properties) {
    var index = -1;
    var count = 0;
    _.each(grouped, function(currElem) {
        var elem = _.sample(currElem);
        var check = true;
        for (var i=0; i<properties.length && check; i++) {
            if (_.get(elem,properties[i]) == _.get(element,properties[i])) {
                check = true;
            } else check = false;
        }
        if (check) index = count;
        count++;
    });
    return index;
};

var groupRowTableStock = function(table) {
    
};
