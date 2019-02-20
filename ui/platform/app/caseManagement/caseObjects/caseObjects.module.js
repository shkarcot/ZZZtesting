(function() {
	'use strict';
    require('../../bpmnjs/bpmn.services.js');
	module.exports = angular.module('console.caseObjects', [
     'console.bpmnServices'
	])
        .controller('caseObjectsController', require('./caseObjects.controller.js'))
        .directive('disallowSpaces', function() {
          return {
            restrict: 'A',

            link: function($scope, $element) {
              $element.bind('input', function() {
                $(this).val($(this).val().replace(/ /g, ''));
                $(this).val($(this).val().replace(".", ''));
              });
            }
          };
        })
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.caseObjects', {
               url: '/caseManagement/:name/:id',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./caseObjects.html'),
                        controller: 'caseObjectsController',
                        controllerAs: 'coc',
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
                    'caseQueuesView@app.caseObjects': {
                      template: require('../caseQueues/caseQueues.html'),
                        controller: 'caseQueuesCtrl as cqc'
                    },
                    'bpmnWorkflow@app.caseObjects': {
                      template: require('../../bpmnjs/bpmn.html'),
                        controller: 'bpmnController as bpmnCtrl'
                    }
                    /*'testUnStructured@app.createUnStructuredForm': {
                      template: require('./test/testTab.html'),
                        controller: 'testUnStructuredCtrl as tttc'

                    },
                    'thresholdUnStructured@app.createUnStructuredForm': {
                      template: require('./threshold/threshold.html'),
                        controller: 'thresholdUnStructuredCtrl as tuh'

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