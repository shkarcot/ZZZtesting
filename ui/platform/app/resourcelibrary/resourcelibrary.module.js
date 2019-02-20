(function() {
	'use strict';

	//require('./dashboard/dashboard.module.js');

	module.exports = angular.module('console.resourcelibrary', ['ui.router'])
	    .controller('resourceLibraryController', require('./resourcelibrary.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.resourcelibrary', {
				url: '/resourcelibrary',
				views: {
					'bodyContentContainer@app': {
						template: require('./resourcelibrary.html'),
						controller: 'resourceLibraryController',
						controllerAs: 'rlc',
                        resolve: {
                          logedIn:function($state){
                              var userData=localStorage.getItem('userInfo');
                              userData=JSON.parse(userData);
                              if(!userData){
                                window.location.href = "http://"+ location.host+"/";
                              }
                          },
                          dictionaryList: ['$stateParams', 'resourceServices', function($stateParams, resourceServices){
                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                var sess_id= loginData.sess_id;
                                return resourceServices.getDictionary({'sess_id':sess_id});
                            }]
                        }
					}
				}
			});
		}]);
})();