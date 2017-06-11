/**
 * Created by luca on 06/06/17.
 */

var Q = require('q');
var _ = require('lodash');
var Article = require('./../models/article');
var Product = require('./../models/product');
var Expected = require('./../models/expected');

module.exports = {

    groupProducts: function() {
        var defer = Q.defer();
        var tmpGroupedProducts = [];
        Product.findAll().then(function(products) {
            _.each(products, function(currProduct) {
                var index = checkIndexObj(tmpGroupedProducts,_.get(currProduct, 'tipo'), _.get(currProduct, 'qualita'),
                _.get(currProduct, 'spessoreNominale'), _.get(currProduct, 'materiale'));
                if (index == -1) {
                    var tmpObjProduct = createObjProduct(currProduct);
                    tmpGroupedProducts.push(tmpObjProduct);
                } else {
                    var tmpGroupProduct = tmpGroupedProducts[index]['data'];
                    var indexData = checkIndexData(tmpGroupProduct, _.get(currProduct, 'lunghezza'), _.get(currProduct, 'larghezzaNominale'), _.get(currProduct, 'tipo'));
                    if (indexData == -1) {
                        var tmpObj = createDataObjProd(currProduct);
                        tmpGroupedProducts[index]['data'].push(tmpObj);
                    } else {
                        tmpGroupedProducts[index]['data'][indexData]['data']['products'].push(currProduct);
                    }
                }
            });
            defer.resolve(tmpGroupedProducts);
        }).catch(function(err) {
            defer.reject(err);
        });
        return defer.promise;
    },

    groupExpecteds: function(tmpGroupedProducts) {
        var defer = Q.defer();
        Expected.findAll().then(function(expecteds) {
            _.each(expecteds, function(currExpected) {
                var index = checkIndexObj(tmpGroupedProducts,_.get(currExpected, 'tipo'), _.get(currExpected, 'qualita'),
                    _.get(currExpected, 'spessore'), _.get(currExpected, 'materiale'));
                if (index == -1) {
                    var tmpObjProduct = createObjExpected(currExpected);
                    tmpGroupedProducts.push(tmpObjProduct);
                } else {
                    var tmpGroupExpected = tmpGroupedProducts[index]['data'];
                    var indexData = checkIndexData(tmpGroupExpected, _.get(currExpected, 'lunghezza'), _.get(currExpected, 'larghezza'), _.get(currExpected, 'tipo'));
                    if (indexData == -1) {
                        var tmpObj = createDataObjExpe(currExpected);
                        tmpGroupedProducts[index]['data'].push(tmpObj);
                    } else {
                        tmpGroupedProducts[index]['data'][indexData]['data']['expecteds'].push(currExpected);
                    }
                }
            });
            defer.resolve(tmpGroupedProducts);
        }).catch(function(err) {
            defer.reject(err);
        });
        return defer.promise;
    },

    groupArticles: function(tmpGroupedExpecteds) {
        var defer = Q.defer();
        Article.findAllWithLength().then(function (articles) {
            _.each(articles, function (currArticle) {
                var index = checkIndexObj(tmpGroupedExpecteds, _.get(currArticle, 'tipo'), _.get(currArticle, 'qualita'),
                    _.get(currArticle, 'spessore'), _.get(currArticle, 'materiale'));
                if (index == -1) {
                    var tmpObjArticle = createObjArticle(currArticle);
                    tmpGroupedExpecteds.push(tmpObjArticle);
                } else {
                    var tmpGroupArticle = tmpGroupedExpecteds[index]['data'];
                    var indexData = checkIndexData(tmpGroupArticle, _.get(currArticle, 'lunghezzaAssegnata'), _.get(currArticle, 'larghezzaAssegnata'), _.get(currArticle, 'tipo'));
                    if (indexData == -1) {
                        var tmpObj = createDataObjArt(currArticle);
                        tmpGroupedExpecteds[index]['data'].push(tmpObj);
                    } else {
                        tmpGroupedExpecteds[index]['data'][indexData]['data']['articles'].push(currArticle);
                    }
                }
            });
            defer.resolve(tmpGroupedExpecteds);
        }).catch(function (err) {
            defer.reject(err);
        });
        return defer.promise;
    }

};

var checkIndexObj = function(tmpObj,tipo,qualita,spessore,materiale) {
    var count = 0;
    var lastCount = 0;
    var check = false;
    _.each(tmpObj, function(currObj) {
        if (_.get(currObj,'tipo') == tipo && _.get(currObj,'qualita') == qualita &&
            _.get(currObj,'spessore') == spessore && _.get(currObj,'materiale') == materiale) {
            lastCount = count;
            check = true;
        }
        count++;
    });
    if (check) {
        return lastCount;
    } else return -1;
};

var checkIndexData = function(tmpObj, lunghezza, larghezza, tipo) {
    var count = 0;
    var lastCount = 0;
    var check = false;
    _.each(tmpObj, function(currObj) {
        if ((_.get(currObj,'lunghezza') == lunghezza && _.get(currObj,'larghezza') == larghezza) ||
            ((tipo == "coil" || tipo == "pacco") && _.get(currObj, 'larghezza'))) {
            lastCount = count;
            check = true;
        }
        count++;
    });
    if (check) {
        return lastCount;
    } else return -1;
};

var createObjProduct = function(currProduct) {
    var tmpObjProduct = {
        'tipo': _.get(currProduct, 'tipo'),
        'qualita': _.get(currProduct, 'qualita'),
        'spessore': _.get(currProduct, 'spessoreNominale'),
        'materiale':_.get(currProduct, 'materiale')
    };
    var dataObj = {
        'larghezza': _.get(currProduct, 'larghezzaNominale'),
        'data': {
            'products': [currProduct],
            'articles': [],
            'expecteds': []
        }
    };
    if (!(_.get(currProduct, 'tipo') == "coil" || _.get(currProduct, 'tipo') == "pacco"))
        _.set(dataObj, 'lunghezza', _.get(currProduct, 'lunghezza'));
    _.set(tmpObjProduct, 'data', [dataObj]);
    return tmpObjProduct;
};

var createObjExpected = function(currExpected) {
    var tmpObjExpected = {
        'tipo': _.get(currExpected, 'tipo'),
        'qualita': _.get(currExpected, 'qualita'),
        'spessore': _.get(currExpected, 'spessore'),
        'materiale':_.get(currExpected, 'materiale')
    };
    var dataObj = {
        'larghezza': _.get(currExpected, 'larghezza'),
        'data': {
            'products': [],
            'articles': [],
            'expecteds': [currExpected]
        }
    };
    if (!_.get(currExpected, 'tipo') == "coil" || !_.get(currExpected, 'tipo') == "pacco")
        _.set(dataObj, 'lunghezza', _.get(currExpected, 'lunghezza'));
    _.set(tmpObjExpected, 'data', [dataObj]);
    return tmpObjExpected;
};

var createObjArticle = function(currArticle) {
    var tmpObjArticle = {
        'tipo': _.get(currArticle, 'tipo'),
        'qualita': _.get(currArticle, 'qualita'),
        'spessore': _.get(currArticle, 'spessore'),
        'materiale':_.get(currArticle, 'materiale')
    };
    var dataObj = {
        'larghezza': _.get(currArticle, 'larghezzaAssegnata'),
        'data': {
            'products': [],
            'articles': [currArticle],
            'expecteds': []
        }
    };
    if (!(_.get(currArticle, 'tipo') == "coil" || _.get(currArticle, 'tipo') == "pacco"))
        _.set(dataObj, 'lunghezza', _.get(currArticle, 'lunghezzaAssegnata'));
    _.set(tmpObjArticle, 'data', [dataObj]);
    return tmpObjArticle;
};

var createDataObjProd = function(currProduct) {
    var dataObj = {
        'larghezza': _.get(currProduct, 'larghezzaNominale'),
        'data': {
            'products': [currProduct],
            'articles': [],
            'expecteds': []
        }
    };
    if (!(_.get(currProduct, 'tipo') == "coil" || _.get(currProduct, 'tipo') == "pacco"))
        _.set(dataObj, 'lunghezza', _.get(currProduct, 'lunghezza'));
    return dataObj;
};

var createDataObjExpe = function(currExpected) {
    var dataObj = {
        'larghezza': _.get(currExpected, 'larghezza'),
        'data': {
            'products': [],
            'articles': [],
            'expecteds': [currExpected]
        }
    };
    if (!(_.get(currExpected, 'tipo') == "coil" || _.get(currExpected, 'tipo') == "pacco"))
        _.set(dataObj, 'lunghezza', _.get(currExpected, 'lunghezza'));
    return dataObj;
};

var createDataObjArt = function(currArticle) {
    var dataObj = {
        'larghezza': _.get(currArticle, 'larghezzaAssegnata'),
        'data': {
            'products': [],
            'articles': [currArticle],
            'expecteds': []
        }
    };
    if (!(_.get(currArticle, 'tipo') == "coil" || _.get(currArticle, 'tipo') == "pacco"))
        _.set(dataObj, 'lunghezza', _.get(currArticle, 'lunghezzaAssegnata'));
    return dataObj;
};