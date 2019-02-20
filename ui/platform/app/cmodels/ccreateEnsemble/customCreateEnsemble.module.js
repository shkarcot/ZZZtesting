(function() {
	'use strict';



	module.exports = angular.module('console.customCreateEnsemble', [

	])
        .controller('customCreateEnsembleController', require('./customCreateEnsemble.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.customCreateEnsemble', {
               url: '/customCreateEnsemble',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./customCreateEnsemble.html'),
                        controller: 'customCreateEnsembleController',
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