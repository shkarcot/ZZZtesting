(function() {
	'use strict';

	require('./ConvertDocument.services.js');

	module.exports = angular.module('console.services.ConvertDocument', ['ui.router',
	'console.ConvertDocumentServices'
	])
	    .controller('ConvertDocumentCtrl', require('./ConvertDocument.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.ConvertDocument', {
				url: '/ConvertDocument',
				breadcrumb: {state: 'Services', subState: 'Convert Document' },
				views: {
					'bodyContentContainer@app': {
						template: require('./ConvertDocument.html'),
						controller: 'ConvertDocumentCtrl',
						controllerAs: 'cdc',
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
					'configureIngestDocument@app.services.IngestDocument': {
                      controller: 'configureIngestDocumentCtrl as ctc',
                      template: require('./configureIngestDocument/IngestDocument.html')
                    }*/
				}
			});
		}]);
})();