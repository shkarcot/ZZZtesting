(function() {
	'use strict';

	require('./identifytables.services.js');

	module.exports = angular.module('console.services.identifytables', ['ui.router',
	'console.identifyTablesServices'
	])
	    .controller('identifyTablesCtrl', require('./identifytables.controller.js'))
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.services.identifytables', {
				url: '/identifytables',
				breadcrumb: {state: 'Services', subState: 'Identify Tables' },
				views: {
					'bodyContentContainer@app': {
						template: require('./identifytables.html'),
						controller: 'identifyTablesCtrl',
						controllerAs: 'itc',
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
					'configureIdentifyTables@app.services.identifytables': {
                      controller: 'configureTableCtrl as ctc',
                      template: require('./configureTable/configureTable.html')
                    }
				}
			});
		}]);
})();