(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');


	module.exports = angular.module('console.createUnStructuredForm', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'

	])
        .controller('createUnStructuredFormController', require('./createUnStructuredForm.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.createUnStructuredForm', {
               url: '/unstructuredFormDetails/:name/:id',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./createUnStructuredForm.html'),
                        controller: 'createUnStructuredFormController',
                        controllerAs: 'cufc',
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
                    'trainUnStructured@app.createUnStructuredForm': {
                      template: require('./train/train.html'),
                        controller: 'trainUnStructuredCtrl as tuc'

                    },
                    'templateUnStructured@app.createUnStructuredForm': {
                      template: require('./template/templateTab.html'),
                        controller: 'templateUnStructuredCtrl as ttc'

                    },
                    'testUnStructured@app.createUnStructuredForm': {
                      template: require('./test/testTab.html'),
                        controller: 'testUnStructuredCtrl as tttc'

                    },
                    'thresholdUnStructured@app.createUnStructuredForm': {
                      template: require('./threshold/threshold.html'),
                        controller: 'thresholdUnStructuredCtrl as tuh'

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