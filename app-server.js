var express = require('express')
	, http = require('http')
	, path = require('path')
	, config = require('./config.js')
	, mongoose = require('mongoose')
	;

//Connect to database
console.log("+Connecting to MongoDB...");
if (process.env.MONGOLAB_URI) {
	mongoose.connect(process.env.MONGOLAB_URI);	
} else {
	mongoose.connect('localhost', 'diabetes_genie');	
}

mongoose.connection.on('error', console.error.bind(console, 'Connection Error'));
mongoose.connection.once('open', function callback() {

	//Connected
	console.log('++ Connected to DB');

	var app = require('./express.js')(mongoose.connection);

	// Require all the Model files
	config.getGlobbedFiles('./models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Require all the Routes files
	config.getGlobbedFiles('./routes/**/*.server.routes.js').forEach(function(routesPath) {
		require(path.resolve(routesPath))(app);
	});

	//Get the port
	var anonPort = 3000;
	/*if (process.env.ENVIRONMENT === 'production' || process.env.ENVIRONMENT === 'staging') {
		anonPort = process.env.PORT;

	//Development
	} else {
		anonPort = 3000;
	}*/

	//Start web server
	http.createServer(app).listen(anonPort, function(){
		console.log('Express server listening on port ' + anonPort);
	});
});