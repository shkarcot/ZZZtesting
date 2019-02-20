(function() {
	'use strict';
    angular.module('console.extractionServices', [])
		.service('extractionService', function($state,$q, $http, httpPayload) {
        var _getListOfGroups = function(recId,sess_id) {
            var req = {
                  method: 'GET',
                  url: 'api/extractiondata/'+recId,
                  headers: {'sess_token': sess_id},
                  data: recId
            }
             var deferred = $q.defer();
//            deferred.resolve({
//                data: data5
//            });
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

        var _saveFeedback = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/feedback/',
                  headers: {'sess_token': data.sess_id},
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

        var _saveNewElement = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/feedback/text/',
                  headers: {'sess_token': data.sess_id},
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

        var _completeFedBack = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/completeReview/text/',
                  headers: {'sess_token': data.sess_id},
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

        var _saveChangedState = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/change/state/',
                  headers: {'sess_token': data.sess_id},
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

        var extractionService = {
            getListOfGroups:_getListOfGroups,
            saveFeedback:_saveFeedback,
            saveNewElement:_saveNewElement,
            completeFedBack:_completeFedBack,
            saveChangedState:_saveChangedState
        };

          return extractionService;
		});
})();