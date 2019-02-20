(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');


	module.exports = angular.module('console.markerForm', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'

	])
        .controller('markerFormController', require('./markerForm.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.markerForm', {
               url: '/markerForm/:name/:id',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./markerForm.html'),
                        controller: 'markerFormController',
                        controllerAs: 'mfc',
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
                    'train@app.markerForm': {
                      template: require('./train/train.html'),
                        controller: 'trainCtrl as tc'

                    },
                    'postPorcessingRules@app.markerForm': {
                      template: require('./postProcessingrules/postProcessingrules.html'),
                        controller: 'postProcessingRulesCtrl as pprc'

                    },
                    'markerFormTab@app.markerForm': {
                      template: require('./markerFormTab/markerFormTab.html'),
                        controller: 'markerFormTabCtrl as mf'

                    },
                    'threshold@app.markerForm': {
                      template: require('./threshold/threshold.html'),
                        controller: 'thresholdCtrl as th'

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