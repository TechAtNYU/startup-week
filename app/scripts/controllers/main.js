'use strict';

/**
 * @ngdoc function
 * @name startupWeekApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the startupWeekApp
 */
angular.module('startupWeekApp')
  .controller('MainCtrl', function () {

  		var canvas = document.getElementById('circles'),
    	context = canvas.getContext('2d');
    	var circles = [];

    	function drawCircles() {
    		for (var i = 0; i <= 20; i++) {
    			circles[i] = new Circle(getColor(), Math.random()*10); 
    		}
    	}
    	drawCircles();
  		function getColor() {
			var colors = ['#246c78', '#dda6a2', '#c25c6d'];
			return colors[Math.floor(Math.random() * colors.length)];
		}

  		function Circle(color, size) {
  			this.size = size;
  			this.color = color;

  			this.draw = function() {

  			};
  			this.move = function() {

  			};
  			this.reset = function() {

  			};
  		}
  });
