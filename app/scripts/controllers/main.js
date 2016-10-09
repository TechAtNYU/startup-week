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
	$scope.about = 'Tech@NYU’s weeklong celebration of technology, design, and entrepreneurship is here and our event lineup is better than ever! We have got workshops, speakers, panels, demos, and a mixer to get to know all of you! Make sure to subsribe to our newsletter to get all the latest news and updates!';
	var dow = ['Monday, April 4th', 'Tuesday, April 5th', 'Wednesday, April 6th', 'Thursday, April 7th', 'Friday, April 8th', 'Saturday, April 9th'];
	$scope.days = {};
	$scope.prevSponsorsImg = [
        {
            href: 'http://devbootcamp.com/',
            title: 'Dev Bootcamp',
            src: '../images/logos/dev-bootcamp.png',
            alt: 'Devbootcamp'
          },
          {
            href: 'https://www.thisalso.com',
            title: 'This Also',
            src: '../images/logos/thisalso.png',
            alt: 'This Also'
          },
          {
            href: 'http://roughdraft.vc/',
            title: 'Rough Draft Ventures',
            src: '../images/logos/rdv.png',
            alt: 'Rough Draft Ventures'
          },
          {
            href: 'https://www.microsoft.com/en-us/',
            title: 'Microsoft',
            src: '../images/logos/microsoft.png',
            alt: 'Microsoft'
          },
          {
            href: 'https://hired.com',
            title: 'Hired',
            src: '../images/logos/hired.png',
            alt: 'Hired'
          },
          {
            href: 'https://www.tumblr.com',
            title: 'Tumblr',
            src: '../images/logos/tumblr.png',
            alt: 'Tumblr'
          },
          {
            href: 'http://www.sheworx.co',
            title: 'SheWorx',
            src: '../images/logos/sheworx.png',
            alt: 'SheWorx'
          },
          {
            href: 'https://www.clarifai.com/',
            title: 'Clarifai',
            src: '../images/logos/clarifai.png',
            alt: 'Clarifai'
          },
          {
            href: 'http://entrepreneur.nyu.edu/',
            title: 'NYU Leslie Entrepreneurship Institute',
            src: '../images/logos/elab.png',
            alt: 'NYU Leslie Entrepreneurship Institute'
          },
          {
            href: 'https://www.mongodb.com',
            title: 'MongoDB',
            src: '../images/logos/mongo.png',
            alt: 'MongoDB'
          },
           {
            href: 'https://www.handy.com/',
            title: 'Handy',
            src: '../images/logos/handy.png',
            alt: 'Handy'
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
        		var springMonth = 3; //april is the 3rd month in moment
                var isPast = theEvent.isAfter(now) ? false: true;
        		return ((theEvent.year() === now.year()) && (theEvent.month() === springMonth) && !isPast);
        	});
            var additionalData = data.included;
            var l = additionalData.length;
            var venues = {};
            var thePresenters = {};
            var presenterID, orgID;

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
                    thePresenters[additionalData[m].id] = {
                        name: additionalData[m].attributes.name,
                        url: additionalData[m].attributes.url,
                        orgID: orgID
                    };
                    presenterID = additionalData[m].id;
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
