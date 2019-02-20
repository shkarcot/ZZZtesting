(function() {
	'use strict';


	module.exports = angular.module('console.source', [

	])
        .controller('sourceController', require('./source.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.sourceConfiguration', {
               url: '/sourceConfiguration',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./source.html'),
                        controller: 'sourceController',
                        controllerAs: 'smc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              }
                        }

                    },
                    'fileUpload@app.sourceConfiguration': {
                      template: require('./fileUpload/fileUpload.html'),
                        controller: 'fileUploadController as fuc'

                    },
                    'sftp@app.sourceConfiguration': {
                      template: require('./sftp/sftp.html'),
                        controller: 'sftpController as sfc'

                    },
                    'email@app.sourceConfiguration': {
                      template: require('./email/email.html'),
                        controller: 'emailController as emc'

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