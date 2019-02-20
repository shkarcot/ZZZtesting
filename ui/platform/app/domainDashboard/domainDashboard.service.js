(function() {
	'use strict';
    angular.module('console.domainDashboardService', [])
		.service('domainDashboardService', function($state,$q, $http,httpPayload) {


           var _getDashboardCount = function(obj) {

                var req = {
                      method: 'GET',
                      url: 'api/get/templatecount/',
                      headers: httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function(data) {
                  deferred.resolve({
                    data: data
                  });
                }).error(function(data) {
                  deferred.reject({
                    error: data
                  });
                });

                return deferred.promise;
           };

        var domainDashboardService = {
            getDashboardCount : _getDashboardCount
        };

        return domainDashboardService;
	});
})();