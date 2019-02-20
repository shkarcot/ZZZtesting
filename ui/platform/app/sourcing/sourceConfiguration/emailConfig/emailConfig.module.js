(function() {
	'use strict';

	module.exports = angular.module('console.emailConfig', [

	])
        .controller('emailConfigController', require('./emailConfig.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.emailConfig', {
               url: '/emailConfig',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./emailConfig.html'),
                        controller: 'emailConfigController',
                        controllerAs: 'egc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              },
                              emailConfigData: ['$stateParams', 'sourceConfigService', function($stateParams, sourceConfigService){
                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                var sess_id= loginData.sess_id;
                                return sourceConfigService.getEmailConfig({'sess_id':sess_id});
                              }]
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