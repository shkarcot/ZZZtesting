/*(function(){
'use strict';*/
describe("Unit Testing of multipleEmailConfigController", function() {
  // Load the myApp module, which contains the directive
  //beforeEach(module('console'));
  /*beforeEach(function () {
    return module("console");
  });*/

  var module,multipleEmailConfigController,scope, $scope,$state,$rootScope,Upload,$location,ngDialog,$timeout,sourceConfigService,$window,entitiesService,multipleEmailConfigService;

  beforeEach(angular.mock.module('console'));
  /*beforeEach(function() {
    module = angular.module('console');
  });*/

    /*describe('greeter', function () {
        it('has a dummy spec to test 2 + 2', function() {
            // An intentionally failing test. No code within expect() will never equal 4.
            expect(2+2).toEqual(4);
        });

    });*/

 /* it('should have a multipleEmailConfigController controller', function() {
    expect(multipleEmailConfigController).toBeDefined();
  });*/

    beforeEach(inject(function ($rootScope, $controller) {

        scope = $rootScope.$new();

        multipleEmailConfigController = $controller('multipleEmailConfigController', {
            $scope: scope
        });
        //console.log("multipleEmailConfigController =>",multipleEmailConfigController);

    }));

   /*it('should have a multipleEmailConfigController controller', function() {
        expect(multipleEmailConfigController).toBeDefined();
   });*/

   /* it('says hello world!', function () {
        expect(scope.mode).toEqual("fun");
    });*/



  /*it('should have a working LoginService service', inject(['LoginService',
    function(LoginService) {
      expect(LoginService.isValidEmail).not.to.equal(null);

      // test cases - testing for success
      var validEmails = [
        'test@test.com',
        'test@test.co.uk',
        'test734ltylytkliytkryety9ef@jb-fe.com'
      ];

      // test cases - testing for failure
      var invalidEmails = [
        'test@testcom',
        'test@ test.co.uk',
        'ghgf@fe.com.co.',
        'tes@t@test.com',
        ''
      ];

      // you can loop through arrays of test cases like this
      for (var i in validEmails) {
        var valid = LoginService.isValidEmail(validEmails[i]);
        expect(valid).toBeTruthy();
      }
      for (var i in invalidEmails) {
        var valid = LoginService.isValidEmail(invalidEmails[i]);
        expect(valid).toBeFalsy();
      }

    }])
  );*/
});


/*});*/

/*describe('$scope initialisation', function() {

    beforeEach(module('console'));
    //beforeEach(angular.mock.module("console"));

    describe('multipleEmailConfigController', function() {
      var scope, controller;


      beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        //it's on the next line I have the error indication
        controller = $controller('multipleEmailConfigController', { $scope: scope });


       *//* it('Mode should be fun', function() {
          expect($scope.mode).toBe('fun'); //pass
        });*//*


      }));


*//*
        it('Mode should be fun', function() {

          expect(controller.mode).toBe('fun'); //pass
        });*//*

    });
});*/



//describe('Controllers', function(){

  //  beforeEach(angular.mock.module("console"));

/*
    var $controller, $rootScope;

    beforeEach(inject(function(_$controller_, _$rootScope_, _$scope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = _$scope_;
    }));
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        //it's on the next line I have the error indication
        controller = $controller('multipleEmailConfigController', { $scope: scope });
      }));

    describe('multipleEmailConfigController', function() {
        it('Mode should be fun', function() {

          var controller = $controller('multipleEmailConfigController', { $scope: $scope });

          expect($scope.mode).toBe('fun'); //pass
        });
    });
*/

    /*describe('multipleEmailConfigController',function(){ //describe your app name<br />
        var myctrl;

        beforeEach(inject(function($controller){ //instantiate controller using $controller service
            myctrl = $controller('multipleEmailConfigController');
        }));

        it('Mode should be fun', function(){  //write tests
            expect(myctrl.mode).toBe('fun'); //pass
        });
    });*/



 // });











/*
describe('multipleEmailConfigController', function() {
  beforeEach(module('console'));

  var $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('$scope.grade', function() {
    it('sets the strength to "strong" if the password length is >8 chars', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('PasswordController', { $scope: $scope });
      $scope.password = 'longerthaneightchars';
      $scope.grade();
      expect($scope.strength).toEqual('strong');
    });
  });
});
*/


/*describe('greeter', function () {
    it('has a dummy spec to test 2 + 2', function() {

        expect(2+2).toEqual(4);
    });

});*/
