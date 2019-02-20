(function() {
	'use strict';



	module.exports = angular.module('console.function', [

	])
        .controller('functionController', require('./function.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.function', {
               url: '/function',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./function.html'),
                        controller: 'functionController',
                        controllerAs: 'fc',
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