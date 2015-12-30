/**
 * Restaurants model 
 *
 * @author  Shah Newaz Khan
 */

var mongoose = require('mongoose');

var RestoSchema = new mongoose.Schema({
	name: {
		type:String,
		required: true,
		unique:true
	},
	budget: {
		type:Number,
		required: true
	},
	phone: String,
	address: String,
	img: String,
	cuisine: String,
	rating: Number
});

module.exports = mongoose.model('Restaurants', RestoSchema);