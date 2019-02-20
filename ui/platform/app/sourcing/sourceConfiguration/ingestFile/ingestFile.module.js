(function() {
	'use strict';

	module.exports = angular.module('console.ingestFile', [

	])
        .controller('ingestFileController', require('./ingestFile.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.ingestFile', {
               url: '/ingestFile',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./ingestFile.html'),
                        controller: 'ingestFileController',
                        controllerAs: 'ifc',
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