(function() {
	'use strict';
    angular.module('console.agentDashboardService', [])
		.service('agentDashboardService', function($state,$q, $http,httpPayload) {

          var _getDashboardQueues = function(obj,sess_id,access) {
            var payload = httpPayload.fetchPostHeader('api/case/queues',obj);
            var deferred = $q.defer();

            $http(payload).success(function(data) {
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

          var _getSessionData = function(sess_id) {
            var payload = httpPayload.fetchGetHeader('user/status/');
            var deferred = $q.defer();

            $http(payload).success(function(data) {
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



          var agentDashboardService = {
            getDashboardQueues:_getDashboardQueues,
            getSessionData:_getSessionData
          };

          return agentDashboardService;
		});
})();

