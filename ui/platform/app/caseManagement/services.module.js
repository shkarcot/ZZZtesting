(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');
	require('./services.service.js');

	module.exports = angular.module('console.services', ['ui.router',
	'console.docServices'
	])
	    .controller('servicesCtrl', require('./services.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services', {
				url: '/services',
				breadcrumb: {state: 'Services', subState: '' },
				views: {
					'bodyContentContainer@app': {
						template: require('./services.html'),
						controller: 'servicesCtrl',
						controllerAs: 'scc',
						resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          }
                        }
					}
				}
			});
		}]);
})();