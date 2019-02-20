(function() {
	'use strict';

	module.exports = ['$state','$q','$http',
		function($state,$q, $http) {

            var _login=function(loginData){
                var path = '/api/auth/';
                var deferred = $q.defer();
                $http.post(path, loginData).success(function(data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            };

            var _resetPassword=function(userinfo){
                var path = 'api/resetPassword';
                var deferred = $q.defer();
                $http.post(path, userinfo,{timeout:10000}).success(function(data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function(data, status, headers, config) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            };

            var AuthService = {
                login:_login,
                resetPassword:_resetPassword
            };

            return AuthService;
		}
	];
})();