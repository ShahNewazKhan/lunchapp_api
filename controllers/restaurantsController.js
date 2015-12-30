'use strict';

var Restaurants = require('../models/Restaurants/Restaurants');

/**
 * @api {post} /profile/getProfile Get profile by email
 * @apiName GetProfile
 * @apiGroup Profile
 *
 * @apiParam {String} email Users email address
 * @apiParam {String} password Users password
 *
 * @apiExample {json} Example Request:
 * {
 * 		"email":"henrik@sedin.ca",
 * 		"username": "",
 * 		"password":"supersecret"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  	"message":"Succesfull login",
 *     	"profile":
 *     	{
 *     		"__v":0,
 *     		"username":"Henrik",
 *     		"email":"henrik@sedin.ca",
 *     		"password":"supersecret",
 *     		"_id":"560381b762b09b1e37005036"
 *     	}     	
 * }
 */
exports.get = function(req, res)
{

	Restaurants.find({}, function(err, docs) {
	    if (!err){ 
	        console.log(docs);
	        res.send({"restaurants": docs});
	    } else {throw err;}
	});
	
	
};


/**
 * @api {post} /profile/ Create a new profile
 * @apiName PostProfile
 * @apiGroup Profile
 *
 * @apiExample {json} Example Request:
 * {
 * 	"username": "Henrik",
 * 	"email": "henrik@sedin.ca",
 * 	"password": "supersecret",
 * 	"dob": 1443479478748,
 * 	"gender": "male",
 * 	"weight": 160,
 * 	"weightUnit": 1,
 * 	"diabetesType": "Type 1",
 * 	"a1c": true,
 * 	"a1cDate": 1443479478748
 * 	
 * }
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message":"Profile created",
 * 	"profile":
 * 	{
 * 		"__v":0,"
 * 		"username":"Henrik",
 *     	"email":"henrik@sedin.ca",
 *     	"password":"supersecret",
 *     	"dob": 1443479478748,
 * 	    "gender": "male",
 * 	    "weight": 160,
 * 	    "weightUnit": 1,
 * 	    "diabetesType": "Type 1",
 * 	    "a1c": true,
 * 	    "a1cDate": 1443479478748,
 *     	"_id":"560381b762b09b1e37005036"
 * }
 */
exports.post = function(req, res)
{
	var tmp = {};
	var keys = Object.keys(req.body);

	for (var i in keys){
		tmp[keys[i]] = req.body[keys[i]];
	}

	var restaurant = new Restaurants(tmp);

	if(restaurant.name)
	{
		// Restaurant has name save to db
		restaurant.save(function(err, restaurant)
		{
			if(err)
			{
				console.log(err);
				res.send(err);
			}
			else
			{
				res.send({"message":"Restaurant entry created", "restaurant": restaurant});
			}
		});
	}
	else
	{
		// Username or pass not provided | Do not save to db
		res.json({"message":"Incomplete parameters"})
	}

	
};



exports.update = function(req, res)
{
	var query = {"_id": req.body.restaurant_id};
	var update = {};
	var options = {new: true};
	var keys = Object.keys(req.body);

	for (var i in keys){
		update[keys[i]] = req.body[keys[i]];
	}
	
	Restaurants.findOneAndUpdate(query, update, options, function(err, profile)
	{
		if(err)
		{
			console.log('Error updating restaurant > ' + err);
			res.send(err);
		}
		else
		{
			res.json({"message": "Restaurant updated", "profile": profile});
		}
	});
};


exports.delete = function(req, res)
{
	Restaurants.findByIdAndRemove(req.params.id, {}, function(err){
		if(err){
			console.log(err);
			res.send('Error deleting restaurant > ', + err );
		}else{
			res.send({'message':'Profile deleted'});
			console.log('Profile deleted');
		}
	});
}