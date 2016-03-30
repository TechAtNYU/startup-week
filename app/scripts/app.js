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
