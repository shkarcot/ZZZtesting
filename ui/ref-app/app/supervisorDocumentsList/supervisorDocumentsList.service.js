(function() {
	'use strict';
    angular.module('console.supervisorDocumentsListService', [])
		.service('supervisorDocumentsListService', function($state,$q, $http,httpPayload) {

          var _assignAgent = function(obj,sess_id,access) {
            var req = {
                  method: 'POST',
                  url: 'api/case/assign',
                  headers: httpPayload.getHeader(),
                  data:obj
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

          var supervisorDocumentsListService = {
            assignAgent:_assignAgent
          };

          return supervisorDocumentsListService;
		});
})();