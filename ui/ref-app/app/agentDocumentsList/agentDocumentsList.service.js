(function() {
	'use strict';
    angular.module('console.agentDocumentsListService', [])
		.service('agentDocumentsListService', function($state,$q, $http, httpPayload) {

          var _getQueueDocuments = function(obj,sess_id,access) {
            var req = httpPayload.fetchPostHeader('api/case/queue/documents',obj);

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

          var _childDocs = function(obj,sess_id,access) {
            var req = httpPayload.fetchPostHeader('api/case/queue/documents',obj);
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

          var _getAgents = function(reqObj,sessId,access) {
           var req = httpPayload.fetchPostHeader('api/queue/agents/',reqObj);
            var deferred = $q.defer();

            $http(req).success(function(data) {
                deferred.resolve({
                    data: data
                });
            }).error(function(){
                deferred.reject({
                    error: data
                });
            });

            return deferred.promise;
          }

          var _reprocessDoc = function(reqObj,sessId,access) {
            var req = httpPayload.fetchPostHeader('',reqObj);
            var deferred = $q.defer();

            $http(req).success(function(data) {
                deferred.resolve({
                    data: data
                });
            }).error(function(){
                deferred.reject({
                    error: data
                });
            });

            return deferred.promise;
          }

          var _proceedTo = function(reqObj,sessId,access) {
            var req = httpPayload.fetchPostHeader('',reqObj);
            var deferred = $q.defer();

            $http(req).success(function(data) {
                deferred.resolve({
                    data: data
                });
            }).error(function(){
                deferred.reject({
                    error: data
                });
            });

            return deferred.promise;
          }

          var agentDocumentsListService = {
            getQueueDocuments: _getQueueDocuments,
            childDocs: _childDocs,
            getAgents: _getAgents,
            reprocessDoc:_reprocessDoc,
            proceedTo:_proceedTo
          };

          return agentDocumentsListService;
		});
})();