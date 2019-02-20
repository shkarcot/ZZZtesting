(function() {
	'use strict';
    angular.module('console.documentServices', [])
		.service('documentService', function($state,$q, $http,httpPayload) {

        var documentService = {
           getDocumentHeldDocuments:_getDocumentHeldDocuments,
           getDocuments:_getDocuments,
           sendDocument:_sendDocument,
           getDocumentDetails:_getDocumentDetails,
           removeHeldDocumentList:_removeHeldDocumentList,
           saveConfigurations:_saveConfigurations,
           removeTemplate: _removeTemplate
        };

        return documentService;


        function _getDocumentHeldDocuments(sess_id) {
          var req = {
                method: 'GET',
                url: 'api/documentTemplates/',
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

        function _getDocuments(sess_id,data) {
          var req = {
                method: 'GET',
                url: 'api/documentTemplates/list/',
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


        function  _sendDocument(sess_id,data) {
          var req = {
                method: 'POST',
                url: 'api/documentTemplates/',
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

        function  _getDocumentDetails(sess_id,id) {
          var req = {
                method: 'GET',
                url: 'api/documentTemplates/'+id,
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

        function  _saveConfigurations(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/documentTemplates/',
                headers:httpPayload.getHeader(),
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

        function  _removeHeldDocumentList(sess_id,data) {
          var req = {
                method: 'DELETE',
                url: 'api/documentTemplates/',
                headers:httpPayload.getHeader(),
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

        function _removeTemplate(sess_id,data) {
          var req = {
                method: 'DELETE',
                url: 'api/documentTemplates/list/',
                headers:httpPayload.getHeader(),
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


		});
})();