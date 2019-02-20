(function() {
	'use strict';

	require('./ExtractDocumentText.services.js');

	module.exports = angular.module('console.services.ExtractDocumentText', ['ui.router',
	'console.ExtractDocumentTextServices'
	])
	    .controller('ExtractDocumentTextCtrl', require('./ExtractDocumentText.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.ExtractDocumentText', {
				url: '/ExtractDocumentText',
				breadcrumb: {state: 'Services', subState: 'Ingest Document' },
				views: {
					'bodyContentContainer@app': {
						template: require('./ExtractDocumentText.html'),
						controller: 'ExtractDocumentTextCtrl',
						controllerAs: 'edtc',
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