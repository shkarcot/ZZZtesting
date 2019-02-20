(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.userRoles', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('userRoleController', require('./userRole.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.userRole', {
                url: '/userRoles',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./userRole.html'),
                        controller: 'userRoleController',
                        controllerAs: 'urc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login')
                                 }
                              },
                        }
                    }
                }
            });
        }]);
})();