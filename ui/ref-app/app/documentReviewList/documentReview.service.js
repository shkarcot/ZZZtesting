(function() {
	'use strict';
    angular.module('console.documentReviewServices', [])
		.service('documentReviewService', function($state,$q, $http, httpPayload) {

            var _getData = function(data) {
            var req = httpPayload.fetchGetHeader('api/getReview/'+data.status+"/"+data.docType+"/"+data.id+'/'+data.page+'/'+data.search);

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

          var _reviewsList = function(data) {
            var req = httpPayload.fetchGetHeader('api/getReviewList/'+data.default+'/'+data.documentType+'/'+data.searchKey);

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

          var _postData = function(data) {
            var req = httpPayload.fetchPostHeader('api/postReview/'+data.id+'/',data.data);

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
            var req = httpPayload.fetchGetHeader('api/documentTypes/');
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

           var _resendNLP = function(data) {
            var req = httpPayload.fetchGetHeader('api/intent/'+data.id+'/');
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



          var documentReviewService = {
            getData:_getData,
            postData:_postData,
            reviewsList:_reviewsList,
            resendNLP:_resendNLP,
            getDocumentTypesList:_getDocumentTypesList

          };

          return documentReviewService;
		});
})();