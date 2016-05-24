/**
 * Created by luca on 24/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Stock = require('./stock');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    codArticolo: {type: Number},
    tipo: {type: String},
    note: {type: String},
    materiale: {type: String},
    sottoTipo: {type: String},
    quantita: {type: Number},
    prezzo: {type: String},
    spessore: {type: Number},
    lunghezza: {type: Number},
    larghezza: {type: Number},
    peso: {type: Number},
    dataConsegna: {type: Date},
    scarto: {type: Number, default: 0},
    stato: {type: String},
    stockId: {type: Schema.ObjectId, ref: 'Stock'},
    ordineCod: {type: Number},
    clienteCod: {type: Number}
});

articleModel = mongoose.model('Article', ArticleSchema);
module.exports = articleModel;

module.exports = {

    findOne: function(query) {

    },

    findById: function(id) {

    },

    findAll: function() {

    },

    findByStatus: function() {

    },

    findAllWithStatus: function() {

    },

    saveNewArticle: function(article) {

    },

    updateArticle: function(articleId,query) {

    },

    addStockToArticle: function(articleId,stockId) {

    },

    setArticleComplete: function(articleId) {

    }
};