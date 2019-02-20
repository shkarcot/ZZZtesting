(function() {
	'use strict';



	module.exports = angular.module('console.pipelinejob', [	])
        .controller('pipelineJobController', require('./pipelinejob.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('xstageconfig', {
               parent: 'app.customModelDashboard',
               url: '/xstageconfig/{id}',
               onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    template: require('./pipelinejob.html'),
                    controller: 'pipelineJobController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity:{     id : $stateParams.id,
                                    createdAt : null,
                                    createdBy: null,
                                    description: null,
                                    endAt: null,
                                    errorCd: null,
                                    errorDesc: null,
                                    pipeInfo: "{}",
                                    pipejobNm: null,
                                    reason: null,
                                    startAt: null,
                                    statusCd: null,
                                    submitAt: null,
                                    updatedAt: null,
                                    updatedBy: null
                                }
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