'use strict';

describe('Directive: drawing.js', function () {

  // load the directive's module
  beforeEach(module('startupWeekApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drawing.js></drawing.js>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the drawing.js directive');
  }));
});
