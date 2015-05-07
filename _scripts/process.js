'use strict';

var request = require('request');
var fs      = require('fs');
var sys     = require('sys');
var path    = require('path');
var moment  = require('moment-timezone');

var manualData = {
	//the event id is the key
	//priority: 1 - low; 2 - medium; 3 - high
	'544061d56b0287336dfc51d4': {
		isBusiness: false,
		priority: 3
	},

	'5441a5ac3f621ea514e8dbfc': {
		isBusiness: false,
		priority: 1
	},

	'544318fbe5ac6ddf5357c444': {
		isBusiness: false,
		priority: 1
	},

	'5441a4d43f621ea514e8dbfa': {
		isBusiness: false,
		priority: 1
	},

	'5441b5ef3f621ea514e8dc00': {
		isBusiness: false,
		priority: 2
	},

	'5442f9aa32ff61083f0df839': {
		isBusiness: false,
		priority: 2
	},

	'5443027c32ff61083f0df840': {
		isBusiness: true,
		priority: 3
	},

	'54431910e5ac6ddf5357c445': {
		isBusiness: false,
		priority: 1
	},

	'5443194ce5ac6ddf5357c446': {
		isBusiness: false,
		priority: 1
	},

	'5442fba132ff61083f0df83b': {
		isBusiness: false,
		priority: 2
	},

	'54431bcae5ac6ddf5357c449': {
		isBusiness: false,
		priority: 2
	},

	'544307aee5ac6ddf5357c42f': {
		isBusiness: true,
		priority: 2
	},

	'544305e3e5ac6ddf5357c429': {
		isBusiness: true,
		priority: 3
	},
	'54430c45e5ac6ddf5357c436': {
		isBusiness: true,
		priority: 3
	},
	'544bfa11ba0c38886d68cfd1': {
		isBusiness: true,
		priority: 3
	},
	'54430d08e5ac6ddf5357c438': {
		isBusiness: true,
		priority: 3
	},
	'54430d6be5ac6ddf5357c43b': {
		isBusiness: true,
		priority: 3
	},
	'54430efbe5ac6ddf5357c43c': {
		isBusiness: true,
		priority: 3
	},
	'54430f4be5ac6ddf5357c43d': {
		isBusiness: true,
		priority: 3
	},

	'5443037c32ff61083f0df841': {
		isBusiness: false,
		priority: 2
	},

	'54431960e5ac6ddf5357c447': {
		isBusiness: false,
		priority: 1
	},

	'54430b21e5ac6ddf5357c431': {
		isBusiness: false,
		priority: 2
	},

	'54432632e5ac6ddf5357c44c': {
		isBusiness: false,
		priority: 3
	},

	'54431029e5ac6ddf5357c43e': {
		isBusiness: false,
		priority: 3
	},

	//LSM
	'54514b5eba0c38886d68cfd8': {
		isBusiness: true,
		priority: 3
	},

	// SPRING 2015
	'55147e1b1fd70b97a5af5c2c': {
		isBusiness: false,
		priority: 2
	},
	// CEO Exclusive with Neil Capel
	'55148acf8f51d26667868b3b': {
		isBusiness: true,
		priority: 2
	},
	'55148b061a397320064d090e': {
		isBusiness: true,
		priority: 2
	},
	'55148b47cfe3d0fc24adacec': {
		isBusiness: true,
		priority: 2
	},
	// New CEO event
	'5522eb7cc301c3ca3d0a580e': {
		isBusiness: true,
		priority: 2
	},
	// HUGE
	'55148371cf8676fd52012566': {
		priority: 3
	}
};

//the processing
request({
	//this disables the ssl security (would accept a fake certificate). see:
	//http://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature
	'rejectUnauthorized': false,
	'url': 'https://api.tnyu.org/v2/events?filter[simple][teams]=5440609d6b0287336dfc51cf&sort=&2bstartDateTime&include=presenters',
	'headers': {
		'x-api-key': process.env.ApiKey,
		'accept': 'application/vnd.api+json'
	},
	timeout: 100000
}, function(err, response, body) {
	var apiJson = JSON.parse(body);
	var events = apiJson.data;
	var presenters = apiJson.included;
	var finalJSON;
	var pastJSON;

	var currentEventsList = [];
	var pastEventsList = [];

	events.forEach(function(event, idx) {
		var id = event.id;
		var presentersLinkage;

		//explicitly set dates' timezone to nyc
		event.attributes.endDateTime = moment.tz(event.attributes.endDateTime, 'America/New_York').format();
		event.attributes.startDateTime = moment.tz(event.attributes.startDateTime, 'America/New_York').format();

		//add past event property to hide / move past events
		event.isPast = moment(event.attributes.endDateTime).isBefore(moment());

		if (manualData[id]) {
			event.isBusiness = manualData[id].isBusiness;
			event.priority   = manualData[id].priority;
		}

		//add presenter data into each events
		//this is slower than if we first read the presenters into an object
		//keyed by id, which we could then read in constant time. But whatever.
		try { presentersLinkage = event.links.presenters.linkage; }
		catch (e) { presentersLinkage = []; }

		event.presenters = presentersLinkage.map(function(linkageObject) {
			return presenters.filter(function(it) { return it.id === linkageObject.id; })[0];
		});

		// Check if event happened before the cutoff (currently 3 months ago)
		var eventTime = moment(event.attributes.endDateTime);
		var currentYear = moment().year();
		var currentMonth = new Date().getMonth();

		var cutOff = currentMonth > 3 ? [currentMonth - 3, currentYear] : [12 + (currentMonth - 3), currentYear - 1];
		var cutOffMoment = moment({month: cutOff[0], year: cutOff[1]});
		var isAfterCutoff = eventTime.isAfter(cutOffMoment);

		if (!isAfterCutoff) {
			pastEventsList.push(event);
		} else {
			currentEventsList.push(event);
		}
	});

	//output merged events
	try {
		finalJSON = JSON.stringify(currentEventsList);
		fs.writeFileSync(path.resolve(__dirname, '../_data/current.yaml'), finalJSON);

		pastJSON = JSON.stringify(pastEventsList);
		fs.writeFileSync(path.resolve(__dirname, '../_data/past.yaml'), pastJSON);

		//rebuild jekyll
		var parentDir = path.resolve(__dirname, '..');
		var exec = require('child_process').exec;
		var puts = function (error, stdout, stderr) {
			sys.puts(stdout);
		};
		exec('jekyll build', {cwd: parentDir}, puts);
	}

	catch (e) {
		console.log(e);
		console.log('ERROR');
		//something went wrong converting the json...
		//just don't update the old file.
	}
});
