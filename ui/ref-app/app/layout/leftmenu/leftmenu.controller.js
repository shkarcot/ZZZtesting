(function() {
	'use strict';
	module.exports = [function() {
		var leftmenuController;

		leftmenuController = function($scope, $state,$rootScope,$location) {
			var vm = this;
            $rootScope.inSolution = true;
            $scope.dashboard=function(){
                $state.go("app.dashboard");
            };
            $scope.resourceLibrary=function(){
                $state.go("app.resourcelibrary");
            };
            $scope.entities=function(){
                $state.go("app.entities");
            };

            $scope.openToggle = function(){

            };
            $('.btn-expand-collapse').click(function(e) {
				$('.navbar-primary').toggleClass('collapsed');
				$('.main-content').toggleClass('main-content-toggled');
            });

             $scope.logout =function(){

                localStorage.clear();
                window.location.href = "http://"+ location.host+"/logout";
            };



		};

		leftmenuController.$inject = ['$scope', '$state','$rootScope','$location'];

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