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

    require('./routes/authenticationRoute.js')(app, jwt, router);
    require('./routes/orderRoute.js')(app, router);
    require('./routes/productRoute.js')(app, router);
    require('./routes/cutRoute')(app,router);
    require('./routes/customerRoute.js')(app, router);
    require('./routes/articleRoute.js')(app,router);
    require('./routes/prodRoute.js')(app,router);
    require('./routes/processRoute')(app,router);
    require('./routes/expectedRoute')(app,router);
    require('./routes/releaseRoute')(app,router);
    require('./routes/virtualRoute')(app,router);

    app.use('/api', router);

};