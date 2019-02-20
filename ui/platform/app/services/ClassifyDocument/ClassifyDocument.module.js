(function() {
	'use strict';

	require('./ClassifyDocument.services.js');

	module.exports = angular.module('console.services.ClassifyDocument', ['ui.router',
	'console.ClassifyDocumentServices'
	])
	    .controller('ClassifyDocumentCtrl', require('./ClassifyDocument.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.ClassifyDocument', {
				url: '/ClassifyDocument',
				breadcrumb: {state: 'Services', subState: 'Classify Document' },
				views: {
					'bodyContentContainer@app': {
						template: require('./ClassifyDocument.html'),
						controller: 'ClassifyDocumentCtrl',
						controllerAs: 'cldc',
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