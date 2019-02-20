(function() {
	'use strict';



	module.exports = angular.module('console.createFunction', [

	])
        .controller('createFunctionController', require('./createFunction.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.createFunction', {
               url: '/createFunction',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./createFunction.html'),
                        controller: 'createFunctionController',
                        controllerAs: 'cfc',
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