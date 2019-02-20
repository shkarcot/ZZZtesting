(function() {
	'use strict';



	module.exports = angular.module('console.createPipline', [	])
        .controller('createPiplineController1', require('./createPipeline.controller1.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('createPipelineNew', {
               parent: 'app.customModelDashboard',
               url: '/createPipelineNew/{id}',
               onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    template: require('./createPipeline.html'),
                    controller: 'createPiplineController1',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
					    logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              },
                              entity: function () {
                            return {
                                id:$stateParams.id,
                                pipeNm: null,
                                type:null,
                                description:null,
                                stageInfo: JSON.stringify({}),
                                stagePrevInfo: JSON.stringify({}),
                                reason:null,
                                statusCd:null,
                                createdAt:null,
                                createdBy: null,
                                updatedAt: null,
                                updatedBy: null
                            };
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