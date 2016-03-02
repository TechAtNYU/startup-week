'use strict';

/**
 * @ngdoc overview
 * @name startupWeekApp
 * @description
 * # startupWeekApp
 *
 * Main module of the application.
 */
 
var app = angular.module('startupWeekApp', ['restangular']).config(function(RestangularProvider) {
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
	Restangular.one('events?filter[simple][teams]=5440609d6b0287336dfc51cf&sort=&2bstartDateTime&include=presenters')
 	.get()
      .then(function(data) {
      		console.log(data.data);
        	var sw_sp2016 = data.data.filter(function(event) {

        	})
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
			this.move = function() {

			};
			this.reset = function() {

			};
		} 
    }
  };
});