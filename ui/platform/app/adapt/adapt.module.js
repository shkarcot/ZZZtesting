(function() {
	'use strict';
		require('./adapt.services.js');

	module.exports = angular.module('console.adapt', ['ui.router',
	    'console.adaptServices'
	])
    .controller('adaptController', require('./adapt.controller.js'))
     .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('app.adapt', {
            url: '/adapt',
            views: {
                'bodyContentContainer@app': {
                    template: require('./adapt.html'),
                    controller: 'adaptController',
                    controllerAs: 'adc',
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