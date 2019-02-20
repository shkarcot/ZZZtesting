(function() {
	'use strict';

	require('./IngestDocument.services.js');

	module.exports = angular.module('console.services.IngestDocument', ['ui.router',
	'console.IngestDocumentServices'
	])
	    .controller('IngestDocumentCtrl', require('./IngestDocument.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.IngestDocument', {
				url: '/IngestDocument',
				breadcrumb: {state: 'Services', subState: 'Ingest Document' },
				views: {
					'bodyContentContainer@app': {
						template: require('./IngestDocument.html'),
						controller: 'IngestDocumentCtrl',
						controllerAs: 'idc',
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