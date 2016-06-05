/**
 * Created by luca on 03/06/16.
 */

var Process = require('./../models/process');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes.get('/processes', function(req,res,next) {
        Process.findAll()
            .then(function(result) {
                if (!result || result.length == 0) {
                    res.status(404).json({
                        "success": false,
                        "message": "Processes not found"
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Processes list",
                        "processes": result
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
    });

    apiRoutes.get('/process/:process_id', function(req,res,next) {
        var processId = req.params.process_id;
        Process.findById(processId)
            .then(function(result) {
                if (!result) {
                    res.status(404).json({
                        "success": false,
                        "message": "Process not found"
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Process found",
                        "customer": result
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
    });

    apiRoutes.get('/process/figli/:process_id', function(req,res,next) {
        var processId = req.params.process_id;
        Process.findById(processId).then(function(process) {
            if (process.figli && process.figli.length > 0) {
                var figli = process.figli;
                var promises = [];
                figli.forEach(function(currFigli) {
                    var newMethod = Product.findById(currFigli);
                    promises.push(newMethod);
                });
                Q.all(promises).then(function(results) {
                    res.status(200).json({
                        "success": true,
                        "message": "Process found",
                        "process": process,
                        "figli": results
                    });
                });
            } else {
                res.status(200).json({
                    "success": true,
                    "message": "Process woth zero figli found",
                    "process": process
                });
            }
        }).catch(function(err) {
            res.status(500).json({
                "success": false,
                "message": "Internal server error",
                "err": err.message
            });
        })
    });

    /*apiRoutes.post('/process', function(req,res,next) {
        var numeroCollo = req.body.stock.numeroCollo;
        var isFiglio = false;
        var originalStock = req.body.stock;
        for (var i in numeroCollo) {
            if (numeroCollo[i] == "/") {
                isFiglio = true;
            }
        }
        if (isFiglio) {

        }
        
    });*/



};