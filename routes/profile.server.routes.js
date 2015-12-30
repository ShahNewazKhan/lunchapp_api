module.exports = function(app){

	// Profile routes
	var profilesController = require('../controllers/profileController.js');

	app.route('/api/v1/profile')
		.post(profilesController.post)
		.put(profilesController.update);

	app.route('/api/v1/profile/:id')
		.delete(profilesController.delete);

	app.route('/api/v1/profile/getProfile')
		.post(profilesController.get);

	app.route('/api/v1/profile/activate/:profile_id/:activationCode')
		.get(profilesController.activate);
};