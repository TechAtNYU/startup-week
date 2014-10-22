(function($) {
	var sw = {
		'init' : function() {
			sw.setup();
			sw.triangles();
		},
		'setup' : function() {
			$(".startup__mask h1").fitText(0.4);
			console.log("<3 <3 <3 <3");
			console.log("<3 u");
			console.log("--tech@NYU");

			$('#filters').on( 'click', 'button', function() {
				var $container = $(".list__events");
				var filterValue = $(this).attr('data-filter');
  				$container.isotope({ filter: filterValue });
			});

		},
		'triangles' : function() {		
			var cWidth = $(window).width();
			var cHeight = 350;

			function RNG(min, max) {
				return Math.floor(Math.random() * max + min);
			}

			var colorChoices = ["#eee"];
			//["#eee", "#911e1c", "#65408B", "#152A5B", "#d7552d"];


			var paper = new Raphael("triangles",cWidth,cHeight);
			var maxLength = 80;
			
			var Triangle = function(startX, startY) {
				this.x = startX;
				this.y = startY;
				this.dead = false;
			};
			
			Triangle.prototype.gc = function gC(x, y) {
		        return x + "," + y + ",";   
		    };
			
			Triangle.prototype.setVertices = function() {
				function getVertex(coord) {
					var mult = RNG(0, 100) > 50 ? 1 : -1;
					
					return coord + (mult * RNG(0, maxLength));
				}
				
				if (typeof this.vx1 === 'undefined') {
					this.vx1 = getVertex(this.x);
					this.vy1 = getVertex(this.y);
					this.vx2 = getVertex(this.x);
					this.vy2 = getVertex(this.y);
					this.vx3 = getVertex(this.x);
					this.vy3 = getVertex(this.y);
				} else {
					this.vx1 += RNG(0, maxLength); 
					this.vy1 += RNG(0, maxLength); 
					this.vx2 += RNG(0, maxLength); 
					this.vy2 += RNG(0, maxLength); 
					this.vx3 += RNG(0, maxLength); 
					this.vy3 += RNG(0, maxLength); 
				}
				
				var xAvg = (this.vx1 + this.vx2 + this.vx3) / 3;
				var yAvg = (this.vy1 + this.vy2 + this.vy3) / 3;
				
				// if offscreen, die
				if (xAvg > cWidth || yAvg > cHeight) {
					this.dead = true;
				}
				
				return ("M" + this.vx1 + "," + this.vy1 +"," + this.vx2 + "," + this.vy2 + "," + this.vx3 + "," + this.vy3 + ",Z");
			};
			
			function doTri() {
				var current = new Triangle(RNG(0,cWidth), RNG(0, cHeight));
				var currentColor = colorChoices.length === 1 ? colorChoices[0] : colorChoices[RNG(0, colorChoices.length)];

				var round = setInterval(function() {
					
					paper.path(current.setVertices()).attr({"stroke": currentColor, "stroke-width": 3}).animate({"opacity": 0}, 1200, function() { this.remove(); });
		
					// recursively spawn a new triangle trail
					if (current.dead === true) {
						clearInterval(round);
						doTri();
					}
				}, 125);
			}
			
			if (cWidth > 400) {
				for (var i = 0; i < 2; i++) {
					doTri();
				}
			}
		}
	};
	
	sw.init();
}(jQuery));