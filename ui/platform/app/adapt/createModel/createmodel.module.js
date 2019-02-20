(function() {
	'use strict';
		// require('./adapt.services.js');

	module.exports = angular.module('console.adapt.createmodel', ['ui.router',
	    'console.adaptServices'
	])
    .controller('createmodelController', require('./createmodel.controller.js'))
     .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('app.adapt.createmodel', {
            url: '/createmodel',
            views: {
                'bodyContentContainer@app': {
                    template: require('./createmodel.html'),
                    controller: 'createmodelController',
                    controllerAs: 'cmc',
                    resolve: {
                      logedIn:function($state){
                          var userData=localStorage.getItem('userInfo');
                          userData=JSON.parse(userData);
                          if(!userData){
                            window.location.href = "http://"+ location.host+"/";
                          }
                      }
                    }
                }
            }

        });
    }]);
})();