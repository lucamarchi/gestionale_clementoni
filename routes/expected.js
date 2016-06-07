/**
 * Created by luca on 06/06/16.
 */

var express = require('express');

module.exports = function() {

    var router = express.Router();
    var Expected = require('./../app/models/expected');

    router.route('/expected')
        .get(function (req, res) {
            Expected.find({}, function (err, results) {
                if (err)
                    res.status(500).json({message: err, status: false});
                res.json({data: results, status: true});
            });
        })
        
        .post(function(req,res) {
            var tmpExpected = req.body.expected;
            var expected = new Expected();
            expected.matricola = tmpExpected.matricola;
            expected.tipo = tmpExpected.tipo;
            expected.materiale = tmpExpected.materiale;
            expected.qualita = tmpExpected.qualita;
            expected.scelta = tmpExpected.scelta;
            expected.finitura = tmpExpected.finitura;
            expected.coloreRal = tmpExpected.coloreRal;
            expected.pesoLordo = tmpExpected.pesoLordo;
            expected.pesoNetto = tmpExpected.pesoNetto;
            expected.spessore = tmpExpected.spessore;
            expected.larghezza = tmpExpected.larghezza;
            expected.classeLarghezza = tmpExpected.classeLarghezza;
            expected.lunghezza = tmpExpected.lunghezza;
            expected.numFogli = tmpExpected.numFogli;
            expected.prezzo = tmpExpected.prezzo;
            expected.difetti = tmpExpected.difetti;
            expected.stabilimento = tmpExpected.stabilimento;
            expected.stato = tmpExpected.stato;
            expected.anno = tmpExpected.anno;
            expected.superficie = tmpExpected.superficie;
            expected.ddt = tmpExpected.ddt;
            expected.fornitore = tmpExpected.fornitore;
            expected.dataDdt = tmpExpected.dataDdt;
            expected.save(function(err,result) {
                if (err) {
                    res.status(500).json({message: err, status: false});
                }
                res.json({message: 'Expected salvato', status: true, data: result});
            })
        
    });

    router.route('/expected/:expected_id')
        .get(function (req,res) {
            Expected.findById(req.params.expected_id, function(err,result) {
                if (err)
                    return res.status(500).json({message: err, status: false});
                res.json({data: result, status: true});
            })
        });

    return router;
};