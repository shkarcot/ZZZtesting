(function() {
	'use strict';
    angular.module('console.dataManagementServices', [])
		.service('dataManagementService', function($state,$q, $http,httpPayload) {


           var _getUploadTerms = function(sess_id,obj) {

                var req = {
                      method: 'POST',
                      url: 'api/terms/',
                      headers:httpPayload.getHeader(),
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

           var _getUploadDocuments = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/data/upload/',
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

           var _getResourceDetails = function(sess_id,obj) {

                var req = {
                      method: 'POST',
                      url: 'api/data/resource/get/',
                      headers:httpPayload.getHeader(),
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

           var _deleteResourceKey = function(sess_id,obj) {

                var req = {
                      method: 'DELETE',
                      url: 'api/tags/',
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

           var _addResourceKey = function(sess_id,obj) {
                var req = {
                      method: 'POST',
                      url: 'api/data/resource/',
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

           var _getAllTags = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/tags/',
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

           var _getTagHierarchyClasses = function(sess_id,obj) {
                var req = {
                      method: 'POST',
                      url: 'api/get/hierarchy/',
                      headers:httpPayload.getHeader(),
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


        var dataManagementService = {
            getUploadDocuments : _getUploadDocuments,
            getResourceDetails : _getResourceDetails,
            deleteResourceKey:_deleteResourceKey,
            addResourceKey:_addResourceKey,
            getUploadTerms:_getUploadTerms,
            getAllTags:_getAllTags,
            getTagHierarchyClasses:_getTagHierarchyClasses
        };

        return dataManagementService;
	});
})();