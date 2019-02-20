(function() {
	'use strict';
    angular.module('console.resourceServices', [])
		.service('resourceServices', function($state,$q, $http,httpPayload) {

              var _getDictionary = function(data) {

                var req = {
                      method: 'GET',
                      //url: 'api/training/data',
                      url:'api/load_training/data/',
                      headers:httpPayload.getHeader()
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

              var _getDictionaryList = function(data) {

                var req = {
                      method: 'GET',
                      url:'api/trainingSet/'+data.server_type+'/',
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

              var _postDictionaryList = function(data) {

                var req = {
                      method: 'POST',
                      url:'api/trainingSet/'+data.server_type+'/',
                      headers: httpPayload.getHeader(),
                      data:data
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

              var _delDictionary = function(data) {

                 var req = {
                      method: 'DELETE',
                      url: 'api/load_training/data/',
                      data: {'_id': data.id},
                      headers:httpPayload.getHeader()
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

              var _updateResourceLibrary = function(data) {
                 var req = {
                      method: 'POST',
                      url: 'api/load_training/data/',
                      data:data,
                      headers:httpPayload.getHeader()
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

              var resourceServices = {
                getDictionary:_getDictionary,
                getDictionaryList:_getDictionaryList,
                postDictionaryList:_postDictionaryList,
                delDictionary:_delDictionary,
                updateResourceLibrary:_updateResourceLibrary

              };

              return resourceServices;
		});
})();