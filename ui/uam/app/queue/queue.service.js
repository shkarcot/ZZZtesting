(function() {
	'use strict';
    angular.module('console.queueServices', [])
		.service('queueService', function($state,$q, $http, httpPayload) {

              var _getQueues = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/getqueues/',
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

              var _createQueue = function(obj,sess_id) {

                var req = {
                      method: 'POST',
                      url: 'api/createqueue/',
                      headers: httpPayload.getHeader(),
                      data: obj
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


               var _delQueue = function(data,sessId) {

                var req = {
                      method: 'DELETE',
                      url: 'api/deletequeue/'+data.queue_id+'/',
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


              var queueService = {
                getQueues:_getQueues,
                createQueue:_createQueue,
                delQueue:_delQueue
              };

              return queueService;
		});
})();