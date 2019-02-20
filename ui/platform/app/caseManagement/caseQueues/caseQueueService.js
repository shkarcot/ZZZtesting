(function() {
	'use strict';
    angular.module('console.caseQueueService', [])
		.service('caseQueueService', function($state,$q, $http,httpPayload) {

		var _getAllUserGroups = function(data) {
            var req = {
                method: 'GET',
                url: 'api/usergroups/',
                headers: httpPayload.getHeader()
            };

            var deferred = $q.defer();

            $http(req).success(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            }).error(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            });

            return deferred.promise;
        };

		var _getQueues = function(data) {
            var req = {
                method: 'POST',
                url: 'api/queue/list',
                headers: httpPayload.getHeader(),
                data: data.data
            };
            var deferred = $q.defer();
            $http(req).success(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            }).error(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            });

            return deferred.promise;
        };

        var _saveQueue = function(reqObj) {
            var req = {
              method: 'POST',
              url: 'api/queue/save',
              headers:httpPayload.getHeader(),
              data: reqObj.data
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

        var _deleteQueue = function(data) {
            var que_id = data.data.q_id;
            delete data.data["q_id"];
            var req = {
                  method: 'DELETE',
                  url: 'api/queue/'+que_id,
                  headers: httpPayload.getHeader(),
                  data: data.data
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

        var _getRules = function(data) {

            var deferred = $q.defer();
            var req = {
                  method: 'GET',
                  url: 'api/casequeuerules/'+data.ruleId+'/',
                  headers: httpPayload.getHeader()
            };

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

        var _getQueueDetails = function(data) {
            var que_id = data.data.q_id;
            delete data.data["q_id"];
            var req = {
                method: 'POST',
                url: 'api/queue/'+que_id,
                headers: httpPayload.getHeader(),
                data: data.data
            };
            var deferred = $q.defer();
            $http(req).success(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            }).error(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            });

            return deferred.promise;
        };

        var caseQueueService = {
            getQueues: _getQueues,
            saveQueue: _saveQueue,
            deleteQueue: _deleteQueue,
            getRules: _getRules,
            getAllUserGroups:_getAllUserGroups,
            getQueueDetails: _getQueueDetails
        };

        return caseQueueService;
});
})();