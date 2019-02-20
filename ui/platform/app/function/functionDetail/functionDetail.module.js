(function() {
	'use strict';



	module.exports = angular.module('console.functionDetail', [

	])
        .controller('functionDetailController', require('./functionDetail.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.functionDetail', {
               url: '/functionDetail/:name',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./functionDetail.html'),
                        controller: 'functionDetailController',
                        controllerAs: 'fdc',
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