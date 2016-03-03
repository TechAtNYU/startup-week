'use strict';

/**
 * @ngdoc overview
 * @name startupWeekApp
 * @description
 * # startupWeekApp
 *
 * Main module of the application.
 */
 
var app = angular.module('startupWeekApp', ['angularMoment', 'restangular']).config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl('https://api.tnyu.org/v3');
	// Configuring Restangular to work with JSONAPI spec
	RestangularProvider.setDefaultHeaders({
	'Accept': 'application/vnd.api+json, application/*, */*',
	'Content-Type': 'application/vnd.api+json; ext=bulk'
	});
	RestangularProvider.addResponseInterceptor(function(data) {
		return data;
	});
});
app.controller('MainCtrl', function ($scope, Restangular) {
	$scope.description = "A week of hacking, designing, networking, and learning with the best and brightest in NYC tech.";
	$scope.about = "Tech@NYU’s weeklong celebration of technology, design, and entrepreneurship is back—and our event lineup is better than ever! We've got workshops, speakers, panels, demos, and a party!";
	var dow = ['Monday, April 4th', 'Tuesday, April 5th', 'Wednesday, April 6th', 'Thursday, April 7th', 'Friday, April 8th',];
	$scope.days = {};
	Restangular.one('events?filter[simple][teams]=5440609d6b0287336dfc51cf&sort=&2bstartDateTime&include=presenters')
 	.get()
		.then(function(data) {
        	var sw_sp2016 = data.data.filter(function(event) {
        		var now = moment();
        		var theEvent = moment(event.attributes.startDateTime);
        		var springMonth = 3; //april is the 3rd month in moment
        		return ((theEvent.year() === now.year()) && (theEvent.month() === springMonth));
        	});

        	for (var i = 0; i < sw_sp2016.length; i++) {
        		var dayOfWeek = moment(sw_sp2016[i].attributes.startDateTime);
        		var details = sw_sp2016[i].attributes;
    			var title = details.title;
    			var description = details.description;
    			var location = details.venue;
    			var theEvent = {
    				'title': title,
    				'description': description,
    				'location': location
    			};
        		if (dayOfWeek.isoWeekday() === 1) {
        			if (!($scope.days[dow[0]])) {
        				$scope.days[dow[0]] = [];
        			}
        			$scope.days[dow[0]].push(theEvent);
        		}
        		else if (dayOfWeek.isoWeekday() === 2) {
        			if (!($scope.days[dow[1]])) {
        				$scope.days[dow[1]] = [];
        			}
        			$scope.days[dow[1]].push(theEvent);
        		}
        		else if (dayOfWeek.isoWeekday() === 3) {
        			if (!($scope.days[dow[2]])) {
        				$scope.days[dow[2]] = [];
        			}
        			$scope.days[dow[2]].push(theEvent);
        		}
        		else if (dayOfWeek.isoWeekday() === 4) {
        			if (!($scope.days[dow[3]])) {
        				$scope.days[dow[3]] = [];
        			}
        			$scope.days[dow[3]].push(theEvent);
        		}
        		else if (dayOfWeek.isoWeekday() === 5) {
        			if (!($scope.days[dow[4]])) {
        				$scope.days[dow[4]] = [];
        			}
        			$scope.days[dow[4]].push(theEvent);
        		}
        	}
        });
});
app.directive('drawing', function(){
  return {
    restrict: 'A',
    link: function(scope, element){
		var context = element[0].getContext('2d');
		var circles = [];

		function drawCircles() {
		  for (var i = 0; i <= 30; i++) {
		  	  circles[i] = new Circle(getColor(), Math.random()*5); 
		      circles[i].draw();
		  }
		  for (var j = 0; j <= 30; j++) {
		      circles[j].draw();
		  }
		}
		drawCircles();
		function getColor() {
			var colors = ['#246c78', '#dda6a2', '#c25c6d'];
			return colors[Math.floor(Math.random() * colors.length)];	
		}

		function Circle(color, size) {
			this.x = ((element[0].width-50) * Math.random());
			this.y = ((element[0].height-50) * Math.random());
			this.size = size;
			this.color = color;

			this.draw = function() {
				context.beginPath();
				context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
				context.closePath();
				context.fillStyle = this.color;
				context.fill();
			};
			this.shake = function() {

			};
			this.reset = function() {

			};
		} 
    }
  };
});