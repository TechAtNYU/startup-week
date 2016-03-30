'use strict';

/**
 * @ngdoc directive
 * @name startupWeekApp.directive:fade
 * @description
 * # fade
 */
angular.module('startupWeekApp')
  .directive('fade', function($window){
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
