'use strict';

/**
 * @ngdoc directive
 * @name startupWeekApp.directive:drawing
 * @description
 * # drawing
 */
angular.module('startupWeekApp')
  .directive('drawing', function(){
  return {
    restrict: 'A',
    link: function(scope, element){
		var context = element[0].getContext('2d');
		var circles = [];

		function drawCircles() {
		  for (var i = 0; i <= 30; i++) {
		  	  circles[i] = new Circle(getColor(), Math.random()*5); 
		  }
		  draw();
		}
		function draw() {
			context.clearRect(0, 0, element[0].width, element[0].height);
			 for (var j = 0; j <= 30; j++) {
			  	  circles[j].draw();
			      circles[j].move();
		 	 }
			requestAnimationFrame(draw);
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
			this.minSpeed = 0.05;
 			this.maxSpeed = 0.5;
 			this.xVelocity = Math.random(this.minSpeed, this.maxSpeed);
 			this.yVelocity = Math.random(this.minSpeed, this.maxSpeed);

			this.draw = function() {
				context.beginPath();
				context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
				context.closePath();
				context.fillStyle = this.color;
				context.fill();
			};
			this.move = function() {
					this.x += this.xVelocity;
					this.y += this.yVelocity;
					if (this.x > element[0].width + this.size || this.y > element[0].height + this.size) {
						this.reset();
					}
					else {
						this.draw();
					}
			};
			this.reset = function() {
				this.x = ((element[0].width-50) * Math.random());
				this.y = ((element[0].height-50) * Math.random());
				this.draw();
			};
		} 
    }
  };
});
