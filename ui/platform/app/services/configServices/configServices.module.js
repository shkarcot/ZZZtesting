(function() {
	'use strict';

	require('./configServices.services.js');

	module.exports = angular.module('console.services.configServices', ['ui.router',
	'console.configServices'
	])
	    .controller('configServicesCtrl', require('./configServices.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.configServices', {
				url: '/configServices',
				views: {
					'bodyContentContainer@app': {
						template: require('./configServices.html'),
						controller: 'configServicesCtrl',
						controllerAs: 'csc',
						resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          }
                        }
					}/*,
					'configureWidget@app.services.configServices.configureWidget': {
                      controller: 'configureIngestDocumentCtrl as ctc',
                      template: require('./configureIngestDocument/IngestDocument.html')
                    }*/
				},
                params: { serviceObj: null }
			});
		}]);
})();