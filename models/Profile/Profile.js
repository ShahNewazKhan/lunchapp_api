/**
 * Profile model 
 *
 * @author  Shah Newaz Khan
 */

var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
	username: {
		type:String,
		required: true,
		unique:true
	},
	email: {
		type:String,
		required: true,
		unique: true

	},
	password: {
		type:String,
		required: true
	},
	dob: Date,
	gender: String,
	weight: Number,
	weightUnit: Number,
	diabetesType: String,
	a1c: Boolean,
	a1cDate: Date,
	active: Boolean,
	activationCode: String

});

module.exports = mongoose.model('Profile', ProfileSchema);