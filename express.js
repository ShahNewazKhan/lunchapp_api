// Express 4

var express = require('express')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, session = require('express-session')
	, compression = require('compression')
	, methodOverride = require('method-override')
	, multer = require('multer')
	, helmet = require('helmet')
	, mongoose = require('mongoose')
	, MongoStore = require('connect-mongo')(session) 
	;

module.exports = function(mongooseConnection) {

	var app = express();

	//Cache length for static files
	var staticMaxAge = 31557600000; //one year
	if (!process.env.MONGOHQ_URL) {
		staticMaxAge = 1200000;
	}

	app.set('showStackError', true);

	var rootDirName = __dirname;
	/*console.log("++ Views: %s", rootDirName + '/views');
	app.set('views', rootDirName + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));*/

	//Static files
	/*console.log("++ Static: %s", rootDirName + '/public');
	app.use(express.static(rootDirName + '/public', { maxAge: staticMaxAge })); */

	app.use(compression());

	//body parsers
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	//app.use(multer({ dest: './public/uploads/uploading/'}));
	app.use(methodOverride());

	app.use(cookieParser());

	//Session
	if (mongooseConnection) {
		console.log("++ Configuring Session to use MongoDB");
		app.use(
			session({
				cookie: { maxAge : 1200000 },  //in milliseconds
				resave: false,
				saveUninitialized: false,
				secret: 'hat ball bridge 3ER5t6y',
				store: new MongoStore({ mongooseConnection: mongooseConnection })
			})
		);
	}

	// Express Router
	var router = express.Router();
	app.use(router);

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	return app;
}