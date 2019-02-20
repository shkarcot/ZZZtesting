(function() {
	'use strict';
    angular.module('console.sourceConfigServices', [])
		.service('sourceConfigService', function($state,$q, $http,httpPayload) {

            var _savePipelineConfig = function(data,sess_id) {
            var req = {
                  method: 'POST',
                  url: 'api/pipeline/',
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
          var _getPipelineConfig = function(data,sess_id) {
            var req = {
                  method: 'GET',
                  url: 'api/pipeline/',
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

          var _getEmailConfig = function(data,sess_id) {
            var req = {
                  method: 'GET',
                  url: 'api/pipeline/email/',
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

          var _getsftpfiles = function(sess_id) {
            var req = {
                  method: 'GET',
                  url: 'api/sftp/files/',
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

          var _saveEmail = function(data,sess_id) {
            var req = {
                  method: 'POST',
                  url: 'api/pipeline/email/',
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

          var _savesftpfiles = function(sess_id,data) {
            var req = {
                  method: 'POST',
                  url: 'api/pipeline/upload/',
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

          var sourceConfigService = {
            savePipelineConfig:_savePipelineConfig,
            getPipelineConfig:_getPipelineConfig,
            saveEmail:_saveEmail,
            getEmailConfig:_getEmailConfig,
            getsftpfiles:_getsftpfiles,
            savesftpfiles:_savesftpfiles
          };

          return sourceConfigService;
		});
})();