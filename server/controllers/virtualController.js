/**
 * Created by luca on 27/01/17.
 */

var Stock = require('./../models/stock');
var Product = require('./../models/product');
var Expected = require('./../models/expected');
var Article = require('./../models/article');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/virtual', function(req, res, next) {
            var virtual = [];
            Stock.findAll()
                .then(function(stocks) {
                    var stockGrouped;
                    if (stocks.length > 0) {
                        stockGrouped = groupStockElems(stocks);
                        stockGrouped.forEach(function(currStock) {
                            var tmp = [currStock,[],[]];
                            virtual.push(tmp);
                        });
                    };
                    Article.findAllWithLength().then(function(articles) {
                        var articleGrouped;
                        if (articles.length > 0) {
                            articleGrouped = groupArticleElems(articles);
                        } else {
                            articleGrouped = [];
                        }
                        if (articleGrouped.length > 0) {
                            articleGrouped.forEach(function(currArt) {
                                virtual = mergeStockAndArt(virtual,currArt);
                            })
                        }
                        Expected.findAll().then(function(expecteds) {
                            var expectedGrouped;
                            if (expecteds.length > 0) {
                                expectedGrouped = groupExpectedElems(expecteds);
                            } else {
                                expectedGrouped = [];
                            }
                            if (expectedGrouped.length > 0) {
                                expectedGrouped.forEach(function(currExp) {
                                    virtual = mergeExpAndArt(virtual,currExp);
                                })
                            }
                            var lastVirtual = [];
                            for (var i=0; i<virtual.length; i++) {
                                var elem = virtual[i];
                                var sortStock = [];
                                if (elem[0].length > 0) {
                                    for (var j = 0; j < elem[0].length; j++) {
                                        var indexSortStock = getIndexSortStock(sortStock, elem[0][j]);
                                        if (indexSortStock == -1) {
                                            sortStock.push([elem[0][j]]);
                                        } else {
                                            sortStock[indexSortStock].push(elem[0][j]);
                                        }
                                    }
                                }
                                var sortArticle = [];
                                if (elem[1].length > 0) {
                                    for (var j = 0; j < elem[1].length; j++) {
                                        var indexSortArticle = getIndexSortArticle(sortArticle, elem[1][j]);
                                        if (indexSortArticle == -1) {
                                            sortArticle.push([elem[1][j]]);
                                        } else {
                                            sortArticle[indexSortArticle].push(elem[1][j]);
                                        }
                                    }
                                }
                                var sortExpected = [];
                                if (elem[2].length > 0) {
                                    for (var j = 0; j < elem[2].length; j++) {
                                        var indexSortExpected = getIndexSortExpected(sortArticle, elem[2][j]);
                                        if (indexSortExpected == -1) {
                                            sortExpected.push([elem[2][j]]);
                                        } else {
                                            sortExpected[indexSortExpected].push(elem[2][j]);
                                        }
                                    }
                                }
                                var finalMergeElem = newMergeElements(sortStock,sortArticle,sortExpected);
                                lastVirtual.push(finalMergeElem);
                            }
                            res.status(200).json({
                                "success": true,
                                "message": "Virtual stock",
                                "virtual": lastVirtual
                            })
                        });
                    });

                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        });

    var getIndexSortStock = function(sortStock,elem) {
        var index = -1;
        for (var i=0; i<sortStock.length; i++) {
            if (sortStock[i][0].lunghezza == elem.lunghezza && sortStock[i][0].larghezzaEffettiva == elem.larghezzaEffettiva) {
                index = i;
            }
        }
        return index;
    }

    var getIndexSortArticle = function(sortArticle,elem) {
        var index = -1;
        for (var i=0; i<sortArticle.length; i++) {
            if (sortArticle[i][0].lunghezzaAssegnata == elem.lunghezzaAssegnata && sortArticle[i][0].lunghezzaAssegnata == elem.lunghezzaAssegnata) {
                index = i;
            }
        }
        return index;
    }

    var getIndexSortExpected = function(sortExpected,elem) {
        var index = -1;
        for (var i=0; i<sortExpected.length; i++) {
            if (sortExpected[i][0].lunghezza == elem.lunghezza && sortExpected[i][0].lunghezza == elem.lunghezza) {
                index = i;
            }
        }
        return index;
    }

    var newMergeElements = function(sortStock, sortArticle, sortExpected) {
        var elem = []
        for (var i=0; i<sortStock.length; i++) {
            var indexMergeF = findStockIndexMerge(elem,sortStock[i][0]);
            if (indexMergeF == -1) {
                elem.push([sortStock[i],[],[]]);
            } else {
                elem[indexMergeF][0].push(sortStock[i]);
            }
        }
        for (var i=0; i<sortArticle.length; i++) {
            var indexMergeS = findArtIndexMerge(elem,sortArticle[i][1]);
            if (indexMergeS == -1) {
                elem.push([[],sortArticle[i],[]]);
            } else {
                elem[indexMergeS][1].push(sortArticle[i]);
            }
        }
        for (var i=0; i<sortExpected.length; i++) {
            var indexMergeT = findExpIndexMerge(elem,sortExpected[i][2]);
            if (indexMergeT == -1) {
                elem.push([[],sortExpected[i],[]]);
            } else {
                elem[indexMergeT][2].push(sortExpected[i]);
            }
        }
        return elem;
    }

    var findArtIndexMerge = function(elem,art) {
        var index = -1;
        for (var i=0; i<elem.length && art !=undefined; i++) {
            if (art.larghezzaAssegnata == elem[i][0].larghezzaEffettiva && art.lunghezzaAssegnata == elem[i][0].lunghezza) {
                index = i;
            }
        }
        return index;
    }

    var findExpIndexMerge = function(elem,exp) {
        var index = -1;
        for (var i=0; i<elem.length && exp; i++) {
            if ((exp.larghezza == elem[i][0].larghezzaEffettiva && exp.lunghezza == elem[i][0].lunghezza) ||
                (exp.larghezza == elem[i][1].larghezzaEffettiva && exp.lunghezzaAssegnata == elem[i][1].lunghezzaAssegnata)) {
                index = i;
            }
        }
        return index;
    }

    var findStockIndexMerge = function(elem,stock) {
        var index = -1;
        for (var i=0; i<elem.length && stock; i++) {
            if (stock.larghezzaEffettiva == elem[i][0].larghezzaEffettiva && stock.lunghezza == elem[i][0].lunghezza) {
                index = i;
            }
        }
        return index;
    }

    var findStockIndexMerge = function(elem,stock) {
        var index = -1;
        for (var i=0; i<elem.length && elem; i++) {
            if (stock.larghezzaEffettiva == elem[i][0].larghezzaEffettiva && stock.lunghezza == elem[i][0].lunghezza) {
                index = i;
            }
        }
        return index;
    }

    var mergeElements = function(sortStock,sortArticle,sortExpected) {
        var elem = [];
        for (var i=0; i<sortStock.length; i++) {
            var check = false;
            for (var j=0; j<sortArticle.length && !check; j++) {
                if (sortStock[i][0].lunghezza == sortArticle[j][0].lunghezzaAssegnata && sortStock[i][0].larghezzaEffettiva == sortArticle[j][0].larghezzaEffettiva) {
                    elem.push([sortStock[i],sortArticle[j],[]]);
                    check = true;
                    sortStock.splice(i,1);
                    sortArticle.splice(j,1);
                }
            }
        }
        if (sortStock.length > 0) {
            for (var i=0; i<sortStock.length; i++) {
                elem.push([sortStock[i],[],[]]);
            }
        }
        if (sortArticle.length > 0) {
            for (var i=0; i<sortArticle.length; i++) {
                elem.push([[],sortArticle[i],[]]);
            }
        }
        for (var i=0; i<sortExpected.length; i++) {
            var check = false;
            for (var j=0; j<elem.length && !check; j++) {
                if (sortExpected[i][0].lunghezza == elem[j][0].lunghezza && sortStock[i][0].larghezza == sortArticle[j][0].larghezzaEffettiva) {
                    elem[j][2].push(sortExpected[i]);
                    check = true;
                    sortExpected.splice(i,1);
                }
            }
        }
        if (sortExpected.length > 0) {
            for (var i=0; i<sortExpected.length; i++) {
                elem.push([[],[],[sortExpected[i]]]);
            }
        }
        return elem;
    }

    var mergeStockAndArt = function(virtual,currArt) {
        var art = currArt[0];
        var check = false;
        for (var i=0; i<virtual.length; i++) {
            if (virtual[i][0].length > 0) {
                var test = virtual[i][0][0];
                if (test.tipo == art.tipo && test.qualita == art.qualita
                    && test.spessoreEffettivo == art.spessore
                    && test.materiale == art.materiale) {
                    if (virtual[i][1].length == 0) {
                        virtual[i][1] = currArt;
                    } else {
                        virtual[i][1] = pushAll(virtual[i][1], currArt);
                    }
                    check = true;
                }
            }
        }
        if (!check) {
            virtual.push([[],currArt,[]]);
        }
        return virtual;
    }

    var mergeExpAndArt = function(virtual,currExp) {
        var exp = currExp[0];
        var check = false;
        for (var i=0; i<virtual.length; i++) {
            var checkLocal = false;
            if (virtual[i][0].length > 0) {
                var test = virtual[i][0][0];
                if (test.tipo == exp.tipo && test.qualita == exp.qualita
                    && test.spessoreEffettivo == exp.spessore
                    && test.materiale == exp.materiale) {
                    if (virtual[i][2].length == 0) {
                        virtual[i][2] = currExp;
                    } else {
                        virtual[i][2] = pushAll(virtual[i][2], currExp);
                    }
                    check = true;
                    checkLocal = true;
                }
            }
            if (!checkLocal) {
                if (virtual[i][0].length > 0) {
                    var testNew = virtual[i][0][1];
                    if (testNew.tipo == exp.tipo && testNew.qualita == exp.qualita
                        && testNew.spessore == exp.spessore
                        && testNew.materiale == exp.materiale) {
                        if (virtual[i][2].length == 0) {
                            virtual[i][2] = currExp;
                        } else {
                            virtual[i][2] = pushAll(virtual[i][2], currExp);
                        }
                        check = true;
                    }
                }
            }
        }
        if (!check) {
            virtual.push([[],currExp,[]]);
        }
        return virtual;
    }

    var pushAll = function(art,currArt) {
        for (var i=0; i<currArt.length; i++) {
            art.push(currArt[i]);
        }
        return art;
    }

    var mergeAllGroup = function(stockGrouped,articleGrouped,expectedGrouped) {
        var group = [];
        var tmpGroup = [];
        for (var i=0; i<stockGrouped.length; i++) {
            var testStock = stockGrouped[i][0];
            var testArticleGroupIndex = findArticleGroupByStock(testStock,articleGrouped);
            var testExpectedGroupIndex = findExpectedGroupByStock(testStock,expectedGrouped);
            if (testArticleGroupIndex > 0 && testExpectedGroupIndex > 0) {
                var articleGroup = articleGrouped.splice(testArticleGroupIndex,1);
                var expectedGroup = expectedGrouped.splice(testExpectedGroupIndex,1);
                var tmp = [stockGrouped[i],articleGroup,expectedGroup];
                tmpGroup.push(tmp);
            } else if (testArticleGroupIndex > 0 && testExpectedGroupIndex == -1) {
                var articleGroup = articleGrouped.splice(testArticleGroupIndex,1);
                var tmp = [stockGrouped[i],articleGroup,[]];
                tmpGroup.push(tmp);
            } else if (testArticleGroupIndex == -1 && testExpectedGroupIndex > 0) {
                var expectedGroup = expectedGrouped.splice(testExpectedGroupIndex,1);
                var tmp = [[],articleGroup,expectedGroup];
                tmpGroup.push(tmp);
            } else if (testArticleGroupIndex == -1 && testExpectedGroupIndex == -1) {
                var tmp = [stockGrouped[i],[],[]];
                tmpGroup.push(tmp);
            }
        }
        var tmpArt = [];
        if (articleGrouped.length > 0) {
            for (var i=0; i<articleGrouped.length; i++) {
                var tmp = [[],articleGrouped[i],[]];
                tmpArt.push(tmp);
            }
        }
        var tmpExp = [];
        if (expectedGrouped.length > 0) {
            for (var i=0; i<expectedGrouped.length; i++) {
                var tmp = [[],[],expectedGrouped[i]];
                tmpExp.push(tmp);
            }
        }
        var mergedLastElem = mergeLastExprAndArt(tmpArt,tmpExp);
        return group;
    }

    var mergeLastExprAndArt = function(tmpArt,tmpExpr) {
        var merge = [];
        if (tmpArt.length > 0 && tmpExpr.length > 0) {
            for (var i=0; i<tmpArt.length; i++) {
                var index = checkArtExpIndex(tmpArt[i][1],tmpExpr);
                if (index > 0) {
                    var tmp = [[],tmpArt[i],tmpExpr[i]];
                    merge.push(tmp);
                } else {

                }
            }
        }
    }

    var checkArtExpIndex = function(art,tmpExpr) {
        var index = -1;
        for (var i=0; i<tmpExpr.length; i++) {
            if (art.tipo == tmpExpr[i][2].tipo && art.qualita == tmpExpr[i][2].qualita
            && art.spessoreEffettivo == tmpExpr[i][2].spessore
            && art.materiale == tmpExpr[i][2].materiale) {
                index = i;
            }
        }
        return index;
    }

    var findArticleGroupByStock = function(testStock,articleGrouped) {
        var index = -1;
        for (var i=0; i<articleGrouped.length; i++) {
            var art = articleGrouped[i][0];
            if (testStock.tipo == art.tipo && testStock.qualita == art.qualita
                && testStock.spessoreEffettivo == art.spessore
                && testStock.materiale == art.materiale) {
                index = i;
            }
        };
        return index;
    }

    var findExpectedGroupByStock = function(testStock,expectedGrouped) {
        var index = -1;
        for (var i=0; i<expectedGrouped.length; i++) {
            var art = expectedGrouped[i][0];
            if (testStock.tipo == art.tipo && testStock.qualita == art.qualita
                && testStock.spessoreEffettivo == art.spessore
                && testStock.materiale == art.materiale) {
                index = i;
            }
        };
        return index;
    }

    var groupStockElems = function(result) {
        var groupStock = [];
        result.forEach(function(currStock) {
            var index = checkIndexStock(groupStock,currStock);
            if (index == -1) {
                groupStock.push([currStock]);
            } else {
                groupStock[index].push(currStock);
            }
        });
        return groupStock;
    }

    var checkIndexStock = function(groupStock, currStock) {
        var index = -1;
        for (var i=0; i<groupStock.length; i++) {
            var testStock = groupStock[i][0];
            if (testStock.tipo == currStock.tipo && testStock.qualita == currStock.qualita
                && testStock.spessoreEffettivo == currStock.spessoreEffettivo
                    && testStock.materiale == currStock.materiale) {
                index = i;
            }
        }
        return index;
    }

    var groupArticleElems = function(articles) {
        var groupArticle = [];
        articles.forEach(function(currArticle) {
            var index = checkIndexArticle(groupArticle,currArticle);
            if (index == -1) {
                groupArticle.push([currArticle]);
            } else {
                groupArticle[index].push(currArticle);
            }
        });
        return groupArticle;
    }

    var checkIndexArticle = function(groupArticle, currArticle) {
        var index = -1;
        for (var i=0; i<groupArticle.length; i++) {
            var testArticle = groupArticle[i][0];
            if (testArticle.tipo == currArticle.tipo && testArticle.qualita == currArticle.qualita
                && testArticle.spessore == currArticle.spessore
                && testArticle.materiale == currArticle.materiale) {
                index = i;
            }
        }
        return index;
    }

    var groupExpectedElems = function(expecteds) {
        var groupExpected = [];
        expecteds.forEach(function(currExpected) {
            var index = checkIndexExpected(groupExpected,currExpected);
            if (index == -1) {
                groupExpected.push([currExpected]);
            } else {
                groupExpected[index].push(currExpected);
            }
        });
        return groupExpected;
    }

    var checkIndexExpected = function(groupExpected, currExpected) {
        var index = -1;
        for (var i=0; i<groupExpected.length; i++) {
            var testExpected = groupExpected[i][0];
            if (testExpected.tipo == currExpected.tipo && testExpected.qualita == currExpected.qualita
                && testExpected.spessore == currExpected.spessore
                && testExpected.materiale == currExpected.materiale) {
                index = i;
            }
        }
        return index;
    }

};