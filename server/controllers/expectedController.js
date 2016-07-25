/**
 * Created by luca on 07/06/16.
 */

var Expected = require('./../models/expected');
var Article = require('./../models/article');
var Customer = require('./../models/customer');
var configs = require('./../configs/url');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/expecteds', function(req,res,next) {
            Expected.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(404).json({
                            "success": false,
                            "message": "Expected not found",
                            "expected": []
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Expected list",
                            "expected": result
                        });
                    }
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        })

        .get('/expecteds/:expected_id', function(req,res,next) {
            var expectedId = req.params.expected_id;
            Expected.findById(expectedId)
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(404).json({
                            "success": false,
                            "message": "Expected not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Expected list",
                            "expected": result
                        });
                    }
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        })

        .post('/expecteds', function(req,res,next) {
            var expected = req.body.expected;
            var promises = [];
            expected.forEach(function(currExpected) {
                var newMethod = Expected.saveNewExpected(currExpected);
                promises.push(newMethod);
            });
            Q.all(promises).then(function(result) {
                res.status(200).json({
                    "success": true,
                    "message": "Expected saved",
                    "expected": result
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

