(function() {
	'use strict';



	module.exports = angular.module('console.testCases', [

	])
        .controller('testCaseController', require('./test.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.testCase', {
               url: '/test/:name',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./test.html'),
                        controller: 'testCaseController',
                        controllerAs: 'tcc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              }
                        }

                    }
                },

				data: {
					menuConfig: {
						'title': 'Product',
						'iconCls': 'cube'
					}

				}
            });
        }]);
})();