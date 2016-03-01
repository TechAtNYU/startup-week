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
    $(document).ready(function() {
    		var canvas = document.getElementById('circles');
        var context = canvas.getContext('2d');
      	var circles = [];

      	function drawCircles() {
      		for (var i = 0; i <= 30; i++) {
      			circles[i] = new Circle(getColor(), Math.random()*5); 
            circles[i].draw();
      		}
          for (var i = 0; i <= 30; i++) {
            circles[i].draw();
          }
      	}
      	drawCircles();
    		function getColor() {
  			var colors = ['#246c78', '#dda6a2', '#c25c6d'];
  			return colors[Math.floor(Math.random() * colors.length)];
  		}

    		function Circle(color, size) {
          this.x = ((canvas.width-50) * Math.random());
          this.y = ((canvas.height-50) * Math.random());
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
      });
  });
