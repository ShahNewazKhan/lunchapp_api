module.exports = function(app){

	// Profile routes
	var restaurantsController = require('../controllers/restaurantsController.js');

	app.route('/api/v1/restaurant')
		.post(restaurantsController.post)
		.put(restaurantsController.update)
		.get(restaurantsController.get);

	app.route('/api/v1/restaurant/:id')
		.delete(restaurantsController.delete);
};