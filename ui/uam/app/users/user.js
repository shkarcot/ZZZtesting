(function() {
	'use strict';
    angular.module('console.dashboardServices', [])
		.service('dashboardService', function($state,$q, $http) {

            var _getProcessList = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/getData/'+data.days+'/'+data.documentType+'/'+data.searchKey,
                  headers: {'sess_token': data.sess_id}

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

          var _postProcessList = function(recId,days,sess_id,text,docType,searchKey) {
            var req = {
                  method: 'GET',
                  url: 'api/getRecord/'+days+"/"+docType+"/"+recId+"/"+text+"/"+searchKey,
                  headers: {'sess_token': sess_id},
                  data: recId
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

          var _getFieldLevelData = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/chart/one/'+obj.days,
                  headers: {'sess_token': obj.sess_id}

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

          var _getDocumentLevelData = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/chart/two/'+obj.days,
                  headers: {'sess_token': obj.sess_id}

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

          var _getListDays = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/selectors/one/',
                  headers: {'sess_token': obj.sess_id}

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

          var _getUrls = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/pipeline/settings/',
                  headers: {'sess_token': obj.sess_id}

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

          var _getNifiStatus = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/pipeline/status/',
                  headers: {'sess_token': obj.sess_id}

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

          var _getDocumentTypesList = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/documentTypes/',
                  headers: {'sess_token': data.sess_id}

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

          var dashboardService = {
            getProcessList:_getProcessList,
            postProcessList:_postProcessList,
            getFieldLevelData:_getFieldLevelData,
            getDocumentLevelData:_getDocumentLevelData,
            getListDays:_getListDays,
            getUrls:_getUrls,
            getNifiStatus:_getNifiStatus,
            getDocumentTypesList:_getDocumentTypesList
          };

          return dashboardService;
		});
})();