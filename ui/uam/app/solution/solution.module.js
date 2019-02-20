(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.solution', ['ui.router'])
	    .controller('solutionController', require('./solution.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.solution', {
				url: '/solution',
				views: {
					'bodyContentContainer@app': {
						template: require('./solution.html'),
						controller: 'solutionController',
						controllerAs: 'sl',
						cache:false,
						resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                        $state.go('login')
                                 }
                              },
                        }
					}
				}
			});
		}]);
})();