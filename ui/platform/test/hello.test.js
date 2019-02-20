describe('greeter', function () {
    it('has a dummy spec to test 2 + 2', function() {
        // An intentionally failing test. No code within expect() will never equal 4.
        expect(2+2).toEqual(4);
    });
});



/* describe('Controller: entitiesController', function () {

  // load the controller's module
  beforeEach(module('console'));

  var entitiesController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    entitiesController = $controller('entitiesController', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainCtrl.awesomeThings.length).toBe(3);
  });
});*/
