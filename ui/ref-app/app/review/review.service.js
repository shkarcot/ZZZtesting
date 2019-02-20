(function() {
	'use strict';
    angular.module('console.reviewServices', [])
		.service('reviewService', function($state,$q, $http,httpPayload) {

            var _getData = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/getReview/'+data.status+"/"+data.docType+"/"+data.id+'/'+data.page+'/'+data.search,
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

          var _reviewsList = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/getReviewList/'+data.default+'/'+data.documentType+'/'+data.searchKey,
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

          var _postData = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/feedback/',
                  headers: httpPayload.getHeader(),
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

          var _review = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/review/',
                  headers: httpPayload.getHeader(),
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

          var _getDocumentTypesList = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/documentTypes/',
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

          var _retrain = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/retrain/',
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



           var _resendNLP = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/intent/'+data.id+'/',
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

          var _sendEmailNlp = function(data) {
            var req = {
                  method: 'POST',
                  url: 'api/intentreview/',
                  headers: httpPayload.getHeader(),
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

//          var _downloadFile = function(data) {
//            var req = {
//                  method: 'POST',
//                  url: 'api/download/efs/',
//                  headers: {'sess_token': data.sess_id},
//                  data:{"path":data.file_path}
//            };
//            var deferred = $q.defer();
//
//            $http(req).success(function(data) {
//              deferred.resolve({
//                data: data
//              });
//            }).error(function(data) {
//              deferred.reject({
//                error: data
//              });
//            });
//
//            return deferred.promise;
//          };

            var _getDomainObjects = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/solnConfig/domainmapping/',
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

            var _saveChangedState = function(data) {
                var req = {
                      method: 'POST',
                      url: 'api/change/state/',
                      headers: httpPayload.getHeader(),
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

            var _saveCompleteReviewProcessed = function(data) {
                var req = {
                      method: 'GET',
                      url: 'api/completeReview/review/'+data.data+'/',
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


          var reviewService = {
            getData:_getData,
            postData:_postData,
            reviewsList:_reviewsList,
            resendNLP:_resendNLP,
            getDocumentTypesList:_getDocumentTypesList,
            retrain:_retrain,
            review:_review,
            sendEmailNlp:_sendEmailNlp,
            getDomainObjects:_getDomainObjects,
            saveChangedState:_saveChangedState,
            saveCompleteReviewProcessed:_saveCompleteReviewProcessed
//            downloadFile:_downloadFile

          };

          return reviewService;
		});
})();