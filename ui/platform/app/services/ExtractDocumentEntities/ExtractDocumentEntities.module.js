(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');
	require('./ExtractDocumentEntities.services.js');

	module.exports = angular.module('console.services.ExtractDocumentEntities', ['ui.router',
	'console.ExtractDocumentEntitiesServices'
	])
	    .controller('ExtractDocumentEntitiesCtrl', require('./ExtractDocumentEntities.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.ExtractDocumentEntities', {
				url: '/ExtractDocumentEntities',
				breadcrumb: {state: 'Services', subState: 'Extract Document Entities' },
				views: {
					'bodyContentContainer@app': {
						template: require('./ExtractDocumentEntities.html'),
						controller: 'ExtractDocumentEntitiesCtrl',
						controllerAs: 'edec',
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