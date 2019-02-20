(function() {
	'use strict';
    //require('../../bpmnjs/bpmn.services.js');
	module.exports = angular.module('console.thresholds', [
     //'console.bmnnServices'
	])
        .controller('thresholdsController', require('./thresholds.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.thresholds', {
               url: '/thresholds',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./thresholds.html'),
                        controller: 'thresholdsController',
                        controllerAs: 'thc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              }
                        }

                    }/*,
                    'caseQueuesView@app.caseObjects': {
                      template: require('../caseQueues/caseQueues.html'),
                        controller: 'caseQueuesCtrl as cqc'
                    },
                    'bpmnWorkflow@app.caseObjects': {
                      template: require('../../bpmnjs/bpmn.html'),
                        controller: 'bpmnController as bpmnCtrl'
                    }*/
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