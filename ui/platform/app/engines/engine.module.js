(function() {
	'use strict';

	require('./nlp/nlpengine.module.js');
	require('./servicecatalog/servicecatalog.module.js');
	//require('./insights/insightengine.module.js');
	//require('./nlp/nlpengine.services.js');
	//require('./nlp/engines.module.js');

	module.exports = angular.module('console.engine', ['ui.router',
           // 'console.nlpTrainService',
           'console.engine.nlp',
           'console.engine.ServiceCatalog'
          // 'console.engine.insights'
	])
	    .controller('engineController', require('./engine.controller.js'))
		//.directive('bodyContentContainer', require('./dashboard.controller.js'));
		 .config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app.engineslist', {
				url: '/engineslist',
				breadcrumb: {state: 'Engines', subState: '' },
				views: {
					'bodyContentContainer@app': {
						template: require('./engine.html'),
						controller: 'engineController',
						controllerAs: 'elc'
					}
				}
			});
		}]);
})();