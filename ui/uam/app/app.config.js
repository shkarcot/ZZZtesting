(function() {
	'use strict';
	module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		//$urlRouterProvider.otherwise('/app/product/list');
		$urlRouterProvider.otherwise('/login');
		$urlRouterProvider.otherwise(function($injector, $location){
           var state = $injector.get('$state');
           var loginData = JSON.parse(localStorage.getItem('userInfo'));
           if(loginData == null || loginData == undefined){
                   state.go('login');
           }
           else{
             if(loginData.role == 'sa'){
                state.go('app.solution');
             }
             else{
              window.location.href = "http://"+ location.host+"/";
             }
           }

        });

		$stateProvider.state('/', {
			url: '/',
			abstract: true
		});
	}];
})();