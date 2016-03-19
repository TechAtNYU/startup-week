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
app.controller('MainCtrl', function ($scope, Restangular, moment) {
	$scope.description = 'A week of hacking, designing, networking, and learning with the best and brightest in NYC tech.';
	$scope.about = 'Tech@NYU’s weeklong celebration of technology, design, and entrepreneurship is coming soon—and our event lineup is better than ever! We have got workshops, speakers, panels, demos, and a party! Sign up to hear about it first!';
	var dow = ['Monday, April 4th', 'Tuesday, April 5th', 'Wednesday, April 6th', 'Thursday, April 7th', 'Friday, April 8th', 'Saturday, April 9th'];
	$scope.days = {};
	$scope.prevSponsorsImg = [
		  {
            href: 'http://www.chatid.com/',
            title: 'chatid',
            src: '../images/logos/chatid.png',
            alt: 'chatid'
          },
          {
            href: 'http://coreatcu.com/',
            title: 'CORE at Columbia',
            src: '../images/logos/core.png',
            alt: 'CORE at Columbia'
          },
          {
            href: 'http://entrepreneur.nyu.edu/',
            title: 'NYU Leslie Entrepreneurship Institute',
            src: '../images/logos/elab.png',
            alt: 'NYU Leslie Entrepreneurship Institute'
          },
          {
            href: 'https://www.google.com',
            title: 'Google',
            src: '../images/logos/google.png',
            alt: 'Google'
          },
          {
            href: 'http://www.work-bench.com/',
            title: 'Work Bench',
            src: '../images/logos/workbench.png',
            alt: 'Work Bench'
          },
          {
            href: "https://www.thisalso.com",
            title: "This Also",
            src: "../images/logos/thisalso.jpg",
            alt: "This Also"
          },
          {
            href: 'https://squareup.com/',
            title: 'Square',
            src: '../images/logos/square.jpeg',
            alt: 'Square'
          },
          {
            href: 'https://www.spotify.com',
            title: 'Spotify',
            src: '../images/logos/spotify.png',
            alt: 'Spotify'
          },
          {
            href: 'http://tisch.nyu.edu/itp',
            title: 'NYU ITP at Tisch',
            src: '../images/logos/itp.png',
            alt: 'NYU ITP at Tisch'
          },
          {
            href: 'https://www.microsoft.com/en-us/',
            title: 'Microsoft',
            src: '../images/logos/microsoft.png',
            alt: 'Microsoft'
          },
          /*{
            href: 'http://www.cowen.com/',
            title: 'Cowan NYC',
            src: 'http://files.tnyu.org/upload_4888f906ad62ef510d3326ad6dc8f668_2f0ccd08-dc86-11e4-92bf-17509d290d64.jpg',
            alt: 'Cowan NYC'
          }*/
        ];
        $scope.socialMedia = [
        	{
            href: 'https://www.facebook.com/TechatNYU/',
            title: 'Facebook',
            src: '../images/icons/facebook.png',
            alt: 'Facebook'
          },
          {
            href: 'https://twitter.com/TechatNYU',
            title: 'Twitter',
            src: '../images/icons/twitter.png',
            alt: 'Twitter'
          }
        ];
	Restangular.one('events?filter[simple][teams]=5440609d6b0287336dfc51cf&sort=startDateTime&include=presenters,venue')
 	.get()
		.then(function(data) {
        	var swSp2016 = data.data.filter(function(event) {
        		var now = moment();
        		var theEvent = moment(event.attributes.startDateTime);
        		var springMonth = 3; //april is the 3rd month in moment
        		return ((theEvent.year() === now.year()) && (theEvent.month() === springMonth));
        	});
            //presenters and venues data
            var additionalData = data.included;
            var l = additionalData.length;
            var venues = {};
            var thePresenters = {};
            for (var m = 0; m < l; m++) {
                if (additionalData[m].type === 'presenters') {
                    thePresenters[additionalData[m].id] = {
                        name: additionalData[m].attributes.name,
                        url: additionalData[m].attributes.url,
                    };
                }
                else if (additionalData[m].type === 'venues') {
                    venues[additionalData[m].id] = {
                        name: additionalData[m].attributes.name,
                        address: 'http://maps.google.com/?q=' + additionalData[m].attributes.address,
                    };
                }
            }

        	for (var i = 0; i < swSp2016.length; i++) {
                var current = swSp2016[i];
        		var timing = moment(current.attributes.startDateTime);
        		var details = current.attributes;
    			var title = details.title;
    			var description = details.description;
                var time = timing.format('HH:mm') + ' - ' + moment(details.endDateTime).format('HH:mm');
                var speakers = [];
                var presenters = current.relationships.presenters.data;
                if (presenters) {
                    for (var j = 0; j < presenters.length; j++) {
                        if (presenters[j]) {
                            speakers.push(thePresenters[presenters[j].id]);
                        }
                    }
                }
                var locationDetails = current.relationships.venue.data ? venues[current.relationships.venue.data.id]: '';
                var theEvent = {
                    'title': title,
                    'description': description,
                    'time': time,
                    'speakers': speakers,
                    'location': locationDetails
                };
        		if (timing.isoWeekday() === 1) {
        			if (!($scope.days[dow[0]])) {
        				$scope.days[dow[0]] = [];
        			}
        			$scope.days[dow[0]].push(theEvent);
        		}
        		else if (timing.isoWeekday() === 2) {
        			if (!($scope.days[dow[1]])) {
        				$scope.days[dow[1]] = [];
        			}
        			$scope.days[dow[1]].push(theEvent);
        		}
        		else if (timing.isoWeekday() === 3) {
        			if (!($scope.days[dow[2]])) {
        				$scope.days[dow[2]] = [];
        			}
        			$scope.days[dow[2]].push(theEvent);
        		}
        		else if (timing.isoWeekday() === 4) {
        			if (!($scope.days[dow[3]])) {
        				$scope.days[dow[3]] = [];
        			}
        			$scope.days[dow[3]].push(theEvent);
        		}
        		else if (timing.isoWeekday() === 5) {
        			if (!($scope.days[dow[4]])) {
        				$scope.days[dow[4]] = [];
        			}
        			$scope.days[dow[4]].push(theEvent);
        		}
                else if (timing.isoWeekday() === 6) {
                    if (!($scope.days[dow[5]])) {
                        $scope.days[dow[5]] = [];
                    }
                    $scope.days[dow[5]].push(theEvent);
                }
        	}
        });
});

app.directive('fade', function($window){
    return {
        restrict: 'A',
        link: function(){
            angular.element($window).bind('scroll', function() {    
                $('.fade').each( function(){
                    var bottomOfObject = $(this).offset().top + $(this).outerHeight();
                    var bottomOfWindow = $(window).scrollTop() + $(window).height();

                    /* If the object is completely visible in the window, fade it it */
                    if( bottomOfWindow > bottomOfObject-300 ){
                        $(this).animate(
                            {'opacity':'1'}, 1000);
                    }
                });
            });
        }
    };
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