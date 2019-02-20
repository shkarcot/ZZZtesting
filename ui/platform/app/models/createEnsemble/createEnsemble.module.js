(function() {
	'use strict';



	module.exports = angular.module('console.createEnsemble', [

	])
        .controller('createEnsembleController', require('./createEnsemble.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.createEnsemble', {
               url: '/createEnsemble',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./createEnsemble.html'),
                        controller: 'createEnsembleController',
                        controllerAs: 'cec',
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