(function() {
	'use strict';
	require('./header/header.module.js');
	require('./footer/footer.module.js');
	require('./leftmenu/leftmenu.module.js');
    require('./bodycontent/bodycontent.module.js');


	module.exports = angular.module('console.layout', [
        'console.layout.header',
        'console.layout.footer',
        'console.layout.leftmenu',
        'console.layout.bodycontent'
	])
	.controller('layoutController', require('./layout.controller.js'))
		//.directive('aptLogin', require('./login.controller.js'));
		.config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('app', {
				url: '/app',
				views: {
					'pageContent@': {
						template: require('./layout.html'),
						controller: 'layoutController',
						controllerAs: 'lyc'
					}
				}
				/*data: {
					menuConfig: {
						'title': 'Product',
						'iconCls': 'cube'
					}

				}*/
			});
		}]);

})();