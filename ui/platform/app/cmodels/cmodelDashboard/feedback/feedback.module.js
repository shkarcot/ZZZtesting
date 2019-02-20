(function() {
	'use strict';



	module.exports = angular.module('console.feedback', [	])
        .controller('FeedbackDialogController', require('./feedback.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('feedback', {
               parent: 'app.customModelDashboard',
               url: 'feedback/{id}',
               onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    template: require('./feedback.html'),
                    controller: 'FeedbackDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity:{id : $stateParams.id}
                    }
                }).result.then(function() {
                    //$state.go('job-process', null, { reload: 'job-process' });
                }, function() {
                    $state.go('^');
                });
            }],

				data: {
					menuConfig: {
						'title': 'Product',
						'iconCls': 'cube'
					}

				}
            });
        }]);
})();