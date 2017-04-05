'use strict';

/**
 * @ngdoc function
 * @name startupWeekApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the startupWeekApp
 */
angular.module('startupWeekApp')
  .controller('MainCtrl', function ($scope, Restangular, moment) {
	$scope.description = 'A week of hacking, designing, networking, and learning with the best and brightest in NYC tech.';
	$scope.about = 'Tech@NYU’s weeklong celebration of entrepreneurship, technology, and design is here, and our event lineup is better than ever! We have workshops, speakers, panels, and fantastic demos! Make sure to subscribe to our newsletter to get all the latest news and updates!';
	var dow = ['Monday, April 10th', 'Tuesday, April 11th', 'Wednesday, April 12th', 'Thursday, April 13th', 'Friday, April 14th', 'Saturday, April 15th'];
	$scope.days = {};
	$scope.prevSponsorsImg = [
        //{
        //    href: 'https://seatgeek.com',
        //    title: 'SeatGeek',
        //    src: '../images/logos/seatgeek.png',
        //    alt: 'SeatGeek'
        //  },
          {
            href: 'https://www.hioscar.com/',
            title: 'Oscar',
            src: '../images/logos/oscar.jpg',
            alt: 'Oscar'
          },
          {
            href: 'https://thinkrise.com/newyork.html',
            title: 'Rise New York',
            src: '../images/logos/rise.jpg',
            alt: 'Rise New York'
          },
          {
            href: 'http://engineering.nyu.edu/business/future-labs/programs/data-future-lab',
            title: 'Data Future Labs',
            src: '../images/logos/futurelabs.png',
            alt: 'Data Future Labs'
          },
          {
            href: 'https://www.purpose.com/',
            title: 'Purpose',
            src: '../images/logos/purpose.svg',
            alt: 'Purpose'
          },
          {
            href: 'https://www.linkedin.com/',
            title: 'LinkedIn',
            src: '../images/logos/linkedin.png',
            alt: 'LinkedIn'
          },
          {
            href: 'https://www.galvanize.com/',
            title: 'Galvanize',
            src: '../images/logos/galvanize.png',
            alt: 'Galvanize'
          },
          {
            href: 'https://www.weightwatchers.com/',
            title: 'Weight Watchers',
            src: '../images/logos/weightwatchers.png',
            alt: 'Weight Watchers'
          }
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
        		var springMonth = 3; //november month - index 0
                var isPast = theEvent.isAfter(now) ? false: true;
        		return ((theEvent.year() === now.year()) && (theEvent.month() === springMonth) && !isPast);
        	});
            var additionalData = data.included;
            var l = additionalData.length;
            var venues = {};
            var thePresenters = {};
            var presenterID, orgID, twitter;

            function assign(presenterID, orgID) {
                Restangular.one('organizations/' + orgID + '/')
                  .get()
                  .then(function(data) {
                    var employerData;
                    if (data) {
                        var info = data.data.attributes;
                        var employer = info.name;
                        var employerUrl = info.url;
                        employerData = {
                            name: employer,
                            url: employerUrl
                        };
                    }
                    thePresenters[presenterID].currentEmployer = employerData;
                 });
            }
            for (var m = 0; m < l; m++) {
                if (additionalData[m].type === 'presenters') {
                    orgID = additionalData[m].relationships.currentEmployer.data;
                    orgID = orgID ? orgID.id : '';
                    twitter = additionalData[m].attributes.contact;
                    twitter = twitter ? twitter.twitter : '';
                    twitter = "https://twitter.com/" + twitter;

                    thePresenters[additionalData[m].id] = {
                        name: additionalData[m].attributes.name,
                        url: additionalData[m].attributes.url,
                        orgID: orgID,
                        twitter:twitter
                    };
                    presenterID = additionalData[m].id;
                    console.log("twitter: " , thePresenters[presenterID].twitter);
                    if (orgID) {
                        thePresenters[presenterID].currentEmployer = assign(presenterID, orgID);
                    }
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
                var url = details.rsvpUrl;
                var time = timing.format('HH:mm') + ' - ' + moment(details.endDateTime).format('HH:mm');
                var speakers = [];
                var presenters = current.relationships.presenters.data;
                if (presenters) {
                    for (var j = 0; j < presenters.length; j++) {
                        if (presenters[j]) {
                            // console.log("presenter info: " , presenters[j]);
                            speakers.push(thePresenters[presenters[j].id]);
                        }
                    }
                }
                var locationDetails = current.relationships.venue.data ? venues[current.relationships.venue.data.id]: '';
                var theEvent = {
                    'title': title,
                    'url': url,
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
