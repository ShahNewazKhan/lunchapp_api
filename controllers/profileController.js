'use strict';

var Profile = require('../models/Profile/Profile');
var bcrypt = require('bcrypt');
var sendgrid_api_key = "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";
var sendgrid  = require('sendgrid')(sendgrid_api_key);

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

	if(req.body.email.length > 0)
	{
		getProfileByEmail(req, res);
	}
	else
	{
		getProfileByUserName(req, res);
	}
	
};

function getProfileByEmail(req, res)
{
	if(req.body.email && req.body.password)
	{
		Profile.findOne({'email':req.body.email.toLowerCase(), 'password':req.body.password}, function(err, profile)
		{
			if(err)
				res.send(err);
			
			if(profile.active == true){
				res.json({message: 'Succesfull login', profile: profile});	
			}else if(profile.active == false){
				res.json({message: 'Please activate account'});
			}else{
				res.json({message: 'Incorect credentials'});
			}
			
		});	
	}
	else
	{
		res.json({"message":"Incomplete credentials"});
	}	
}
function getProfileByUserName(req, res)
{

	if(req.body.username && req.body.password)
	{

		Profile.findOne({'username':req.body.username.toLowerCase(), 'password':req.body.password}, function(err, profile)
		{
			if(err)
				res.send(err);

			if(profile == null){
				res.json({message: 'Incorrect credentials'});
			}else if(profile.active == true){
				res.json({message: 'Succesfull login', profile: profile});	
			}else if(profile.active == false){
				res.json({message: 'Please activate account'});
			}
			
		});	
	}
	else
	{
		res.json({"message":"Incomplete credentials"});
	}
	
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

	var profile = new Profile(tmp);

	profile.active = false;
	profile.activationCode = randomString(32);

	if(profile.username && profile.password)
	{
		
		profile.username = profile.username.toLowerCase();
		profile.email = profile.email.toLowerCase();

		// Username && password not null | Save to db
		profile.save(function(err, profile)
		{
			if(err)
			{
				console.log(err);
				res.send(err);
			}
			else
			{
				sendActivationEmail(profile);
				res.send({"message":"Profile created", "profile": profile});
			}
		});
	}
	else
	{
		// Username or pass not provided | Do not save to db
		res.json({"message":"Incomplete credentials"})
	}

	
};

function randomString(length) 
{
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    
    return result;
}

function sendActivationEmail(profile)
{
	var email   = new sendgrid.Email({
		to: profile.email,
		from: 'info@shahnewazkhan.ca',
		fromname: 'My Diabetes Genie Team',
		subject: 'New Account Activation',
		text: 'Please click the link below to activate your account',
		html: ' <a href="http://107.170.255.42:3000/api/v1/profile/activate/' + profile._id + '/' + profile.activationCode + '">ACTIVATE NEW ACCOUNT</a>'
	});

	sendgrid.send(email, function(err, json){

  		if (err) { return console.error(err); }

	});
	
}

/**
 * @api {get} /profile/activate/:profile_id/:activationCode Activate new profile
 * @apiName ActivateProfile
 * @apiGroup Profile
 *
 * @apiParam {String} profile_id The profile id 
 * @apiParam {String} activationCode The activation code for the profile 
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message":"Profile activated",
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
exports.activate = function(req, res)
{
	Profile.findOne({'_id':req.params.profile_id, 'activationCode':req.params.activationCode}, function(err, profile)
	{
		if(err)
			res.send(err);

		if(profile){

			profile.active = true;

			profile.save(function(err, profile)
			{
				if(err)
				{
					console.log(err);
					res.send(err);
				}
				else
				{
					sendActivatedEmail(profile);
					res.send({"message":"Profile activated"});
				}
			});
			
		}else{
			//TODO: Send invalid activation email
			res.send('No profile found');
		}
		
	});	
}

function sendActivatedEmail(profile)
{
	var email   = new sendgrid.Email({
		to: profile.email,
		from: 'info@shahnewazkhan.ca',
		fromname: 'My Diabetes Genie Team',
		subject: 'New Account Activated',
		text: 'New account activated',
		html: '<h1><strong>Congratulations!</strong></h1> ' + 
			  '<br/><h3>Your My Diabetes Genie Account has been activated! <br />' +
			  '<br/>Please login with the following credentials: </h3> <br /><br />' +
			  '<h4>'+
			  'Username: ' + profile.username + '<br />' +
			  'Password: ' + profile.password +
			  '</h4>'
	});

	sendgrid.send(email, function(err, json){

  		if (err) { return console.error(err); }
  		console.log("Email sent")
  		console.log(json);

	});
	
}
/**
 * @api {update} /profile Update profile
 * @apiName Update profile
 * @apiGroup Profile
 *
 * @apiExample {json} Example Request:
 * {
 * 	"profile_id":"560381b762b09b1e37005036",
 * 	"email": "henrik33@sedin.ca",	
 * }
 *
 * @apiParam {String} profile_id Users profile id
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     		"message":"Profile updated",
 *     		"profile":
 *     		{
 *     			"__v":0,
 *     			"_id":"560381b762b09b1e37005036",
 *     			"email":"henrik33@sedin.ca",
 *     			"dob": 1443479478748,
 * 	      		"gender": "male",
 * 	        	"weight": 160,
 * 	          	"weightUnit": 1,
 * 	           	"diabetesType": "Type 1",
 * 	           	"a1c": true,
 * 	            "a1cDate": 1443479478748
 *     		}
 *     }
 */
exports.update = function(req, res)
{
	var query = {"_id": req.body.profile_id};
	var update = {};
	var options = {new: true};
	var keys = Object.keys(req.body);

	for (var i in keys){
		update[keys[i]] = req.body[keys[i]];
	}
	
	Profile.findOneAndUpdate(query, update, options, function(err, profile)
	{
		if(err)
		{
			console.log('Error updating profile > ' + err);
			res.send(err);
		}
		else
		{
			res.json({"message": "Profile updated", "profile": profile});
		}
	});
};

/**
 * @api {delete} /profile/:id Delete profile
 * @apiName Delete profile
 * @apiGroup Profile
 *
 * @apiExample {url} Example Request: 
 * 
 * http://107.170.255.42:3000/api/v1/profile/560381b762b09b1e37005036
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     	"message":"Profile deleted",
 *     		
 * }
 */
exports.delete = function(req, res)
{
	Profile.findByIdAndRemove(req.params.id, {}, function(err){
		if(err){
			console.log(err);
			res.send('Error deleting profile > ', + err );
		}else{
			res.send({'message':'Profile deleted'});
			console.log('Profile deleted');
		}
	});
}