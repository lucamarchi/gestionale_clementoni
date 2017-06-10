/**
 * Created by luca on 27/01/17.
 */

var Q = require('q');
var _ = require('lodash');
var Product = require('./../models/product');
var Expected = require('./../models/expected');
var Article = require('./../models/article');
var virtualController = require('./../controllers/virtualController');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/virtual', function(req,res,next) {
            var data = {};
            virtualController.groupProducts().then(function(groupProduct) {
                virtualController.groupExpecteds(groupProduct).then(function(groupExpected) {
                    virtualController.groupArticles(groupExpected).then(function(groupTotal) {
                        data.virtual = groupTotal;
                        res.status(200).json({
                            "success": true,
                            "message": "Virtual list",
                            "data": data
                        });
                    });
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        });

};