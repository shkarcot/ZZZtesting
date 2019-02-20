(function() {
	'use strict';



	module.exports = angular.module('console.transformation', ['console.flowChart'])
        .controller('TransformationController', require('./transformation.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('transformation', {
               parent: 'app.customModelDashboard',
               url: '/transformation/{id}',
               onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    template: require('./transformation.html'),
                    controller: 'TransformationController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entitydata: function() {
                            return {
                            	     id:$stateParams.id,
                                     pipeNm:null,
                            	     type:null,
                            	     description:null,
                            	     stageInfo:null,
                            	     stagePrevInfo:null,
                            	     reason:null,
                            	     statusCd:null,
                            	     createdAt:null,
                            	     createdBy:null,
                            	     updatedBy:null,
                            	     updatedAt:null
                            	    }
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