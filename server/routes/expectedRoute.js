/**
 * Created by luca on 07/06/16.
 */

var Q = require('q');
var expectedController = require('./../controllers/expectedController');
var Expected = require('./../models/expected');


module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/expecteds', function(req,res,next) {
            var data = {};
            Expected.findAll().then(function(result) {
                data.expected = result;
                res.status(200).json({
                    "success": true,
                    "message": "Expected list",
                    "data": data
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .get('/expecteds/:expected_id', function(req,res,next) {
            var expectedId = req.params.expected_id;
            var data = {};
            Expected.findById(expectedId).then(function(result) {
                data.expected = result;
                res.status(200).json({
                    "success": true,
                    "message": "Expected list",
                    "data": data
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .post('/expecteds', function(req,res,next) {
            var expected = req.body.expected;
            var data = {};
            var promises = expectedController.createExpecteds(expected)
            Q.all(promises).then(function(result) {
                data.expecteds = result;
                res.status(200).json({
                    "success": true,
                    "message": "Expected saved",
                    "data": data
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .put('/expecteds/:expected_id', function(req,res,next) {
            var expected = req.body.expected;
            var expectedId = req.params.expected_id;
            var data = {};
            Expected.modifyExpected(expectedId,expected).then(function(expected) {
                data.expected = expected;
                res.status(200).json({
                    "success": true,
                    "message": "Expected modified",
                    "data": data
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .delete('/expecteds/:expected_id', function(req,res,next) {
            var expectedId = req.params.expected_id;
            Expected.deleteExpected(expectedId).then(function(err,result) {
                res.status(200).json({
                    "success": true,
                    "message": "Expected deleted"
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })
};

