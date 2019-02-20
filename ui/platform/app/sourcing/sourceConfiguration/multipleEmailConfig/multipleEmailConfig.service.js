(function() {
	'use strict';
    angular.module('console.multipleEmailConfigServices', [])
		.service('multipleEmailConfigService', function($state,$q, $http, $location,httpPayload) {

		   /* var apiUrl='http://10.32.102.187';

            if($location.host()!='localhost')
                apiUrl='http://case-management.'+$location.host();*/

          var _saveMultipleEmailConfig = function(data,sess_id,apiUrl) {
            var req = {
                  method: 'POST',
                  url: apiUrl+'case-management/rest/servicecalls/saveMailConfig',
                  headers: {'Content-Type': 'application/json'},
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
          var _updateMultipleEmailConfig = function(data,sess_id,apiUrl) {
            var req = {
                  method: 'POST',
                  url: apiUrl+'case-management/rest/servicecalls/updateMailConfig',
                  headers: {'Content-Type': 'application/json'},
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
          var _deleteMultipleEmailConfig = function(data,sess_id,apiUrl){
            var req = {
                  method: 'POST',
                  url: apiUrl+'case-management/rest/servicecalls/deleteEmailConfig/id/'+data.id,
                  headers: {'Content-Type': 'application/json'},
                  data:data
            };

            var deferred = $q.defer();

            $http(req).success(function(data){
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
          var _getMultipleEmailConfigs = function(reqObj,apiUrl) {
            var req = {
                  method: 'GET',
                  url: apiUrl+'case-management/rest/servicecalls/getEmailConfig/solutionId/'+reqObj.solutionId,
                  headers: {'Content-Type': 'application/json'}
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

        var _getSolnId = function() {
            var req = {
                method: 'GET',
                url:"api/get/solnid/"
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
            saveMultipleEmailConfig:_saveMultipleEmailConfig,
            getMultipleEmailConfigs:_getMultipleEmailConfigs,
            updateMultipleEmailConfig:_updateMultipleEmailConfig,
            deleteMultipleEmailConfig:_deleteMultipleEmailConfig,
            getSolnId:_getSolnId
          };

          return sourceConfigService;
		});
})();