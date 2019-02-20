(function() {
	'use strict';
	module.exports = [function() {
		var leftmenuController;

		leftmenuController = function($scope, $state, $rootScope, $location, solutionService, $window) {
//			var vm = this;
            $scope.goToDash = function(){
               $state.go("app.solution",{},{reload:true});
            };
             $scope.logout =function(){

                localStorage.clear();
                window.location.href = "http://"+ location.host+"/logout";
            };
            var $myGroup = $('#myGroup');
            $myGroup.on('show.bs.collapse','.collapse', function() {
                $myGroup.find('.collapse.in').collapse('hide');
            });
            $scope.gotToUsers = function(){
                $state.go("app.users");
            }
            $scope.gotToQueue = function(){
                $state.go("app.queue");
            }
            $scope.gotToUserGroups = function(){
                 $state.go("app.userGroup");
            };
            $scope.gotToUserRoles = function(){
                 $state.go("app.userRole");
            };
		};

        leftmenuController.$inject = ['$scope', '$state','$rootScope' ,'$location' ,'solutionService' ,'$window'];

		return {
			restrict: 'E',
			controller: leftmenuController,
			controllerAs: 'fc',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./leftmenu.html')
		};

	}];
})();