(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.userGroups', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('userGroupController', require('./userGroup.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.userGroup', {
                url: '/userGroups',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./userGroup.html'),
                        controller: 'userGroupController',
                        controllerAs: 'ugc',
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