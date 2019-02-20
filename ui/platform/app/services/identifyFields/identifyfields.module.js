(function() {
	'use strict';

	require('./identifyfields.services.js');

	module.exports = angular.module('console.services.identifyfields', ['ui.router',
	'console.identifyFieldsServices'
	])
	    .controller('identifyFieldsCtrl', require('./identifyfields.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.identifyfields', {
				url: '/identifyfields',
				breadcrumb: {state: 'Services', subState: 'Identify Fields' },
				views: {
					'bodyContentContainer@app': {
						template: require('./identifyfields.html'),
						controller: 'identifyFieldsCtrl',
						controllerAs: 'ifc',
						resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          }
                        }
					},
                    'configureIdentifyFields@app.services.identifyfields': {
                      controller: 'documentTemplateCtrl as dtc',
                      template: require('./documentTemplates/documentTemplates.html')
                    }
				}
			});
		}]);
})();