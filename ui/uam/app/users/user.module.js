(function() {
	'use strict';
    //require('./services/module.js');
	//require('./dashboard/dashboard.module.js');
	//require('./entitygraph/entitygraph.module.js');
	//require('./solutionsetup/solutionsetup.module.js');

	module.exports = angular.module('console.users', [
        //'console.dashboard.entitygraph'
	    //'console.dashboard.solutionsetup'
	    //'console.layout.bodycontent.dashboard.services'
	])
        .controller('usersController', require('./user.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.users', {
                url: '/users',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./user.html'),
                        controller: 'usersController',
                        controllerAs: 'dbc',
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