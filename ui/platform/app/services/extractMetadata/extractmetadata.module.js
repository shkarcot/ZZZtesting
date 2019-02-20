(function() {
	'use strict';

	require('./extractmetadata.services.js');

	module.exports = angular.module('console.services.extractmetadata', ['ui.router',
	'console.extractMetadataServices'
	])
	    .controller('extractMetadataCtrl', require('./extractmetadata.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.extractmetadata', {
				url: '/extractmetadata',
				breadcrumb: {state: 'Services', subState: 'Extract Metadata' },
				views: {
					'bodyContentContainer@app': {
						template: require('./extractmetadata.html'),
						controller: 'extractMetadataCtrl',
						controllerAs: 'emc',
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