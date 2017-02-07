/**
 * Created by luca on 20/05/16.
 */

var jwt = require('jsonwebtoken');
var cors = require('cors');
var checkToken = require('./middleware/checkUserToken.js');

module.exports = function (app, express) {

    app.use(cors());
    app.use(require('morgan')("dev"));
    app.use(checkToken);

    var router = express.Router();

    require('./controllers/authenticationController.js')(app, jwt, router);
    require('./controllers/orderController.js')(app, router);
    require('./controllers/productController.js')(app, router);
    require('./controllers/stockController.js')(app, router);
    require('./controllers/cutController')(app,router);
    require('./controllers/customerController.js')(app, router);
    require('./controllers/articleController.js')(app,router);
    require('./controllers/prodController.js')(app,router);
    require('./controllers/processController')(app,router);
    require('./controllers/expectedController')(app,router);
    require('./controllers/releaseController')(app,router);
    require('./controllers/virtualController')(app,router);

    app.use('/api', router);

};