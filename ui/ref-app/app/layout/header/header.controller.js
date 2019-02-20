(function() {
	'use strict';
	module.exports = [function() {
		var headerController;

		headerController = function($scope, $state,$window) {
			var vm = this;
		    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
		    $scope.solution_name = localStorage.getItem('solutionName');
            $scope.logout =function(){
                localStorage.clear();
                window.location.href = "http://"+ location.host+"/logout";
            };

            $scope.goToDashboard = function(){
               localStorage.removeItem('filterObj');
               localStorage.removeItem('recentRecords');
               $state.go('app.dashboard')
            };

            $scope.$on('userBroadcast', function(event, args) {
                $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
            });

            $scope.goToReview = function(){
               localStorage.removeItem('filterObj');
               localStorage.removeItem('recentRecords');
               $state.go('app.documentReview')
            };
            $scope.navbarHeight = document.getElementsByClassName('navbar-CustomHeight').outerHeight;

            $scope.goToDashboard = function(){
                if($scope.loginData.role == "sv"){
                    $state.go("app.supervisorDashboard");
                }
                else{
                    $state.go("app.agentDashboard");
                }
            };

		};


		headerController.$inject = ['$scope', '$state','$window'];

		return {
			restrict: 'E',
			controller: headerController,
			controllerAs: 'hc',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./header.html')
		};

	}];
})();