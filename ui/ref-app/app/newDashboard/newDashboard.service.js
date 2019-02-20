(function() {
	'use strict';
    angular.module('console.newDashboardService', [])
		.service('newDashboardService', function($state,$q, $http, httpPayload) {

          var _getChartData = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/dashboard/',
                  headers: httpPayload.getHeader(),
                  data:data.data
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

          var newDashboardService = {
            getChartData:_getChartData
          };

          return newDashboardService;
		});
})();