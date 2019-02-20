(function() {
	'use strict';
    angular.module('console.documentsListServices', [])
		.service('documentsListService', function($state,$q, $http,httpPayload) {


           var _getProcessList = function(data) {
                var req = httpPayload.fetchPostHeader('api/getInsights/',data.data);
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
            var req = httpPayload.fetchGetHeader('api/getRecord/'+days+"/"+docType+"/"+recId+"/"+text+"/"+searchKey);
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
            var req = httpPayload.fetchGetHeader('api/chart/one/'+obj.days);
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
            var req = httpPayload.fetchGetHeader('api/chart/two/'+obj.days);
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
            var req = httpPayload.fetchGetHeader('api/selectors/one/');
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
            var req = httpPayload.fetchGetHeader('api/get/template/allpublished/');
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

          var _getClassificationInfo = function(data) {
            var req = httpPayload.fetchGetHeader('api/grouping/review/'+data.id+'/');
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
          var _reviewedClassification = function(data) {
            var req = httpPayload.fetchPostHeader('api/grouping/review/'+data.id+'/',data.data);
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

          var _getDomainObjectsList = function(data) {
                var req = httpPayload.fetchGetHeader('api/solnConfig/domainobject/');
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
            getDocumentTypesList:_getDocumentTypesList,
            getClassificationInfo:_getClassificationInfo,
            reviewedClassification:_reviewedClassification,
            getDomainObjectsList:_getDomainObjectsList
          };

          return dashboardService;
		});
})();