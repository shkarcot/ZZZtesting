(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');
	require('./servicecatalog/servicecatalog.module.js');

	module.exports = angular.module('console.engines', ['ui.router'
	])
	    .controller('enginesCtrl', require('./engines.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.engines', {
				url: '/engines',
				breadcrumb: {state: 'Engines', subState: '' },
				views: {
					'bodyContentContainer@app': {
						template: require('./engines.html'),
						controller: 'enginesCtrl',
						controllerAs: 'ec',
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