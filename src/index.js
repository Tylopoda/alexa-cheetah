/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Nest status"
 *  Alexa: "The temperature downstairs is 55. The temperature is set to 60. The temperature upstairs is 58. The temperature is set to 55!"
 */

/**
 * App ID for the skill
 */

 //TODO: self landing page

var APP_ID = "amzn1.echo-sdk-ams.app.e5cffef4-0ce6-45be-a58b-2f83d3c6c72c"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var https = require('https');
var url = require('url');

/**
 * CheetahSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var CheetahSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

var typeMap = {
	'run' : 'Running',
	'walk' : 'Walking',
	'cycle' : 'Cycling',
	'swim' : 'Swimming',
	'hike' : 'Hiking',
	'go' : 'All',
	'move' : 'All',
	'do' : 'All',
	'ran' : 'Running',
	'walked' : 'Walking',
	'cycled' : 'Cycling',
	'swam' : 'Swimming',
	'hiked' : 'Hiking',
	'swum' : 'Swimming',
	'gone' : 'All',
	'moved' : 'All',
	'did' : 'All',
	'running' : 'Running',
	'walking' : 'Walking',
	'cycling' : 'Cycling',
	'swimming' : 'Swimming',
	'hiking' : 'Hiking',
	'moving' : 'All',
	'exercise' : 'All',
	'exercising' : 'All',
	'exercised' : 'All',
	'activity' : 'All'
};

var pastTenseActivityMap = {
	'run' : 'ran',
	'walk' : 'walked',
	'cycle' : 'cycled',
	'swim' : 'swam',
	'hike' : 'hiked',
	'go' : 'went',
	'move' : 'moved',
	'do' : 'did',
	'ran' : 'ran',
	'walked' : 'walked',
	'cycled' : 'cycled',
	'swam' : 'swam',
	'hiked' : 'hiked',
	'swum' : 'swum',
	'gone' : 'went',
	'moved' : 'moved',
	'did' : 'did',
	'running' : 'ran',
	'walking' : 'walked',
	'cycling' : 'cycled',
	'swimming' : 'swam',
	'hiking' : 'hiked',
	'moving' : 'moved',
	'exercise' : 'exercised',
	'exercising' : 'exercised',
	'exercised' : 'exercised',
	'activity' : 'did'
}

// Extend AlexaSkill
CheetahSkill.prototype = Object.create(AlexaSkill.prototype);
CheetahSkill.prototype.constructor = CheetahSkill;

CheetahSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("CheetahSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

CheetahSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("CheetahSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId + ", accessToken: " + session.user.accessToken);
    var speechOutput = "Welcome to Cheetah for Runkeeper. I can help you get data from Runkeeper. Try asking how far did I run today. How can I help you?";
    var repromptText = "Welcome to Cheetah for Runkeeper. I can help you get data from Runkeeper. Try asking how far did I run today. How can I help you?";
    response.ask(speechOutput, repromptText);
};

CheetahSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("CheetahSkill onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

CheetahSkill.prototype.intentHandlers = {
    // register custom intent handlers
    "StatusIntent": function (intent, session, response) {
    	if(!session.user.accessToken) { 
    		response.tellWithLinkAccount("You must have a Runkeeper account to use this skill. Please use the Alexa app to link your Amazon account with your Runkeeper Account.");
    	} else { 
    		//console.log(session.user.accessToken);
    		var activity = intent.slots.activity.value;

			if(!activity) { 
				activity = "activity";
			}

    		var day = intent.slots.day.value;
    		if(!day) { 
    			var date = new Date();
    			var day = "" + date.getUTCFullYear()
        			+ '-' + (date.getUTCMonth() < 10? "0" : "") + ( date.getUTCMonth() + 1 )
        			+ '-' + (date.getUTCDate() < 10 ? "0" : "") + ( date.getUTCDate() );
    		}
    		var fromDay = day;
    		var toDay = day;

			if(day.indexOf("W") > 0) { //2016-W22
				var a = day.split("-W");
				var y = a[0];
				var w = a[1];
				console.log("year", y);
				console.log("week", w);
				console.log("date", d);
				var d = getDateOfISOWeek(w, y);
				console.log("date", d);
				fromDay = "" + d.getUTCFullYear() + '-' + (d.getUTCMonth() < 10? "0" : "") + ( d.getUTCMonth() + 1 ) + '-' + (d.getUTCDate() < 10 ? "0" : "") + ( d.getUTCDate() );
				var ed = d;
				ed.setDate(ed.getDate() + 6);
				console.log("edate", ed);
				toDay = "" + ed.getUTCFullYear() + '-' + (ed.getUTCMonth() < 10? "0" : "") + ( ed.getUTCMonth() + 1 ) + '-' + (ed.getUTCDate() < 10 ? "0" : "") + ( ed.getUTCDate() );

			}
    		else if(day.length < 8) { //2016-05 not 2016-05-05 or 2016-W22
    			fromDay += "-01";
    			toDay += "-31";
    		}


			getMilesFromServer(session.user.accessToken, fromDay, toDay, function(body) {
				//console.log("Status onResponse from runkeeper: " + body);
				var bod = JSON.parse(body);
				var items = bod.items;
				var type = typeMap[activity];
				var activityPastTense = pastTenseActivityMap[activity];
				var responseString = "";
				var totalDistance = 0;
				for (i in items) {  
					var val = items[i]; 				
					
					//console.log("name", val.type);
					//console.log("distance", val.total_distance);
					
					if(type == 'All' || val.type == type) {
						totalDistance += val.total_distance;
					}					
				}
				responseString = "You " + activityPastTense + " " + Math.round(totalDistance * 0.000621371 * 100) / 100 + " miles on " + day + "." ;
				
				response.tellWithCard(responseString, "Cheetah for Runkeeper", responseString);
			}, function() {
				response.tellWithLinkAccount("You must have a Runkeeper account to use this skill. Please use the Alexa app to link your Amazon account with your Runkeeper Account.");
			});
    	}
        
    },
    
    "AMAZON.HelpIntent": function (intent, session, response) {
    	//TODO
        response.ask("I am Cheetah for Runkeeper. I can help you get your data from Runkeeper. Try asking how far did I run today to get your running distance for today, or how many miles did I hike yesterday. How can I help you?", "I am Cheetah for Runkeeper. I can help you get your data from Runkeeper. Try asking how far did I run today to get your running distance for today, or how many miles did I hike yesterday. How can I help you?");
    },
     "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

function doRequest(options, eventCallback, requestNo, data, onUnAuthCallback) {
	console.log("calling ", options.path);
	if(requestNo > 5) {
		console.log("too many redirects");
		return;
	}
	  
	  var req = https.request(options, function(res) {
			var body = '';
			var redirect = false;
		  console.log("statusCode: ", res.statusCode);
		  console.log("headers: ", res.headers);

	  
	  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers && res.headers.location) {
	    var location = res.headers.location;
	    console.log('redirect', location);
	    redirect = true;
	  
		  var redirectURI = url.parse(location);
		  console.log('redirect URI', redirectURI);
		  
		  options.hostname = redirectURI.hostname;
		  options.port = redirectURI.port;
		  options.path = redirectURI.pathname;
		  
	    
	    doRequest(options, eventCallback, requestNo + 1, data, onUnAuthCallback);
	  } else if (res.statusCode === 401) {
		  redirect = true;
		  if(req._auth) {
		    var authHeader = req._auth.onResponse(res);
		    if (authHeader) {
		      req.setHeader('authorization', authHeader);
		      var location = res.headers.location;
			    console.log('redirect', location);
			  
				  var redirectURI = new URI(location);
				  console.log('redirect URI', redirectURI);
			      options.hostname = redirectURI.hostname;
				  options.port = redirectURI.port;
				  options.path = redirectURI.pathname;
		    
		      doRequest(options, eventCallback, requestNo + 1, data, onUnAuthCallback);
		  }
	    } else {
	    	onUnAuthCallback();
	    }
	  }
	  
	  res.on('data', function(d) {
		  body += d;
	  });
	  
	  res.on('end', function () {
		  	if(body && !redirect) {
		  		eventCallback(body);
		  	} else {
		  		console.log('redirectng so not done');
		  	}
      });
	});
	if(data) {
		req.write(data);
	}
	req.end();

	req.on('error', function(e) {
	  console.error(e);
	});
}

function getMilesFromServer(token, fromDay, toDay, eventCallback, onUnAuthCallback) {
	var options = {
	  hostname: 'api.runkeeper.com',
	  port: 443,
	  path: '/fitnessActivities?noEarlierThan=' + fromDay + '&noLaterThan=' + toDay,
	  method: 'GET',
	  headers: {'Authorization' : 'Bearer ' + token}
	};

	console.log("calling", options.path);
	doRequest(options, eventCallback, 0, null, onUnAuthCallback);	
				  
			  
}

function setNestTemperatureFromServer(thermostat, nestToken, eventCallback, onUnAuthCallback, onNotFoundCallback) {
	var options = {
	  hostname: 'developer-api.nest.com',
	  port: 443,
	  path: '/devices/thermostats/',
	  method: 'GET',
	  headers: {'Authorization' : 'Bearer ' + nestToken}
	};

	doRequest(options, function(body) {
		console.log("SetTemp device list onResponse from nest: " + body);
		var bod = JSON.parse(body);
		for (i in bod) { 
			console.log(i); 
			var val = bod[i]; 
			console.log(val.name);
			
			console.log("name", val.name);
			console.log("thermostat", thermostat);
			
			if(val.name.toUpperCase() === thermostat.toUpperCase()) {
				console.log("matched", thermostat);
				eventCallback(val);
				return;
			}
			
		}
		onNotFoundCallback(thermostat);
	
		}, 0, null, onUnAuthCallback);
				  	  
}

function setNestTemperatureOnDeviceFromServer(thermostat, temperature, nestToken, eventCallback, onUnAuthCallback) {
	var options = {
	  hostname: 'developer-api.nest.com',
	  port: 443,
	  path: '/devices/thermostats/' + thermostat,
	  method: 'PUT',
	  headers: {'Authorization' : 'Bearer ' + nestToken}
	};

	doRequest(options, function(body) {
		console.log("SetTemp on device onResponse from nest: " + body);
		eventCallback(body);
	
		}, 0, '{"target_temperature_f":' + temperature + '}', onUnAuthCallback);
				  	  
}

function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}




// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the CheetahSkill skill.
    var cheetahSkill = new CheetahSkill();
    cheetahSkill.execute(event, context);
};

