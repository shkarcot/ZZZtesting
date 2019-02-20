(function() {
	'use strict';



	module.exports = angular.module('console.stageConfig', [	])
        .controller('StageConfigController', require('./stageConfig.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('stageConfig', {
               parent: 'app.customModelDashboard',
               url: '/stageConfig/{id}',
               onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    template: require('./stageConfig.html'),
                    controller: 'StageConfigController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity:{id : $stateParams.id,
                                 classId:null,
                                 reason:null,
                                 description : null,
                                 stageGrpNm: null,
                                 statusCd:null,
                                 stageInfo:"{}",
                                 stageNm:null,
                                 statusCdcreatedAt:null,
                                 createdBy:null,
                                 updatedAt:null,
                                 updatedBy:null
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