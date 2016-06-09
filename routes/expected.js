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
            var expectedArray = req.body.expected;
            var finalResult = [];
            var itemExpected = 0;
            expectedArray.forEach(function(tmpExpected) {
                var expected = new Expected();
                expected.tipo = tmpExpected.tipo;
                expected.materiale = tmpExpected.materiale;
                expected.qualita = tmpExpected.qualita;
                expected.scelta = tmpExpected.scelta;
                expected.finitura = tmpExpected.finitura;
                expected.coloreRal = tmpExpected.coloreRal;
                expected.pesoNetto = tmpExpected.pesoNetto;
                expected.spessore = tmpExpected.spessore;
                expected.larghezza = tmpExpected.larghezza;
                expected.lunghezza = tmpExpected.lunghezza;
                expected.numFogli = tmpExpected.numFogli;
                expected.prezzo = tmpExpected.prezzo;
                expected.superficie = tmpExpected.superficie;
                expected.fornitore = tmpExpected.fornitore;
                expected.dataPrevista = tmpExpected.dataPrevista;
                finalResult.push(expected);
                itemExpected++;
                expected.save(function(err,result) {
                    if (err) {
                        res.status(500).json({message: err, status: false});
                    }
                    if (itemExpected == expected.length) {
                        res.json({message: 'Expected salvati', status: true, data: finalResult});
                    }
                });
            });
        
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