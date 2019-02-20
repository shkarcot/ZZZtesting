(function() {
	'use strict';
	module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		//$urlRouterProvider.otherwise('/app/product/list');
		if(JSON.parse(localStorage.getItem('userInfo'))!=null){
            if(JSON.parse(localStorage.getItem('userInfo')).role == "sv")
                $urlRouterProvider.otherwise('/app/solution');
            else
                $urlRouterProvider.otherwise('/app/solution');
        }
        else{
            window.location.href = "http://"+ location.host+"/logout";
        }

		$stateProvider.state('/', {
			url: '/',
			abstract: true
		});
	}];
})();