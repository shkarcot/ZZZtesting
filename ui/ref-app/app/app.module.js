(function() {

	'use strict';

	require('./vendor')();
	require('./layout/layout.module.js');
	require('./documentsList/documentsList.module.js');
	require('./newDashboard/newDashboard.module.js');
	require('./agentDashboard/agentDashboard.module.js');
	require('./agentDashboard/agentDashboard.service.js');
	require('./agentDocumentsList/agentDocumentsList.module.js');
	require('./agentDocumentsList/agentDocumentsList.service.js');
	require('./supervisorDashboard/supervisorDashboard.module.js');
	require('./supervisorDocumentsList/supervisorDocumentsList.module.js');
	require('./supervisorDocumentsList/supervisorDocumentsList.service.js');
	require('./documentsList/documentsList.service.js');
	require('./documentReviewList/documentReview.module.js');
	require('./documentReviewList/documentReview.service.js');
	require('./review/review.module.js');
	require('./review/review.service.js');
	require('./extraction/extraction.module.js');
	require('./extraction/extraction.service.js');
	require('./solution/solution.module.js');
	require('./solution/solution.service.js');
	require('./review/imageCrop.directive.js');
	require('./processDetails/processDetails.module.js');
	require('./processDetails/processDetails.service.js');
	require('./multiPage/multiPage.module.js');
	require('./newDashboard/newDashboard.service.js');
	require('./entityLinking/entityLinking.module.js');
	require('./entityLinking/entityLinking.service.js');
	require('./httpConfiguration/httpConfiguration.service.js');






	module.exports = angular.module('console', [
			'ui.router',
			'ui.tree',
			'console.layout',
			'console.documentsList',
			'console.agentDashboardService',
			'console.agentDocumentsListService',
			'console.supervisorDocumentsListService',
			'console.documentsListServices',
			'console.newDashboard',
			'console.agentDashboard',
			'console.agentDocumentsList',
			'console.supervisorDashboard',
			'console.supervisorDocumentsList',
			'console.processDetails',
			'console.processDetailsServices',
			'console.documentReview',
			'console.documentReviewServices',
			'console.review',
			'console.reviewServices',
			'console.entityLinking',
			'console.entityLinkingServices',
			'console.extraction',
			'console.extractionServices',
			'console.imageCropDirective',
			'console.solution',
			'console.solutionServices',
			'console.newDashboardService',
			'console.httpPayload',
			'angularUtils.directives.dirPagination',
			'ngDialog',
			'rzModule',
			'ngMessages',
			'ngFileUpload',
			'angular-loading-bar',
			'jsonFormatter',
			'console.multiPage',
			'daterangepicker',
			'angular-jwt'
		])

		.run(function($http) {
			//console.log('inside run method');
//		  localStorage.setItem('loginData',JSON.stringify({"msg": "user login successful", "sess_id": "FAKE_SESSION", "status": "success", "user": {"_id": 1, "email": "", "first_name": "", "last_name": "", "solution_id": "S2"}}));

		})
		.config(require('./app.config.js'))
		.config(function($interpolateProvider){
            $interpolateProvider.startSymbol('{$');
            $interpolateProvider.endSymbol('$}');

        });

})();