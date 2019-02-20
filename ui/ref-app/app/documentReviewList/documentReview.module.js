(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.documentReview', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('documentReviewController', require('./documentReview.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.documentReview', {
               url: '/documentReview',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./documentReview.html'),
                        controller: 'documentReviewController',
                        controllerAs: 'drc',
                        cache :false,
                        resolve: {

                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                        window.location.href = "http://"+ location.host+"/";
                                 }
                              }
//                              getDocumentTypes: ['$stateParams', 'documentReviewService', function($stateParams, documentReviewService){
//                                var loginData = JSON.parse(localStorage.getItem('userInfo'));
//                                var sess_id= loginData.sess_id;
//                                return documentReviewService.getDocumentTypesList({'sess_id':sess_id});
//                              }]
                        }

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