(function() {
	'use strict';
    angular.module('console.entityLinkingServices', [])
		.service('entityLinkingService', function($state,$q, $http, httpPayload) {

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
            var req = httpPayload.fetchPostHeader('api/feedback/',data.data);
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
            var req = httpPayload.fetchPostHeader('api/review/',data.data);

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

          var _retrain = function(data) {
            var req = httpPayload.fetchGetHeader('api/retrain/');
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

          var _sendEmailNlp = function(data) {
            var req = httpPayload.fetchPostHeader('api/intentreview/',data.data);
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
                 var req = httpPayload.fetchGetHeader('api/solnConfig/domainmapping/');
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

            var _getDomainObjectsEntities = function(data) {
                var req = httpPayload.fetchGetHeader('api/entitylist/');
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

            var _getEntityLinks = function(id,sessId) {
               var req = httpPayload.fetchGetHeader('api/entitylink/'+id+'/');

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

            var _getPostProcessData = function(id,sessId) {
               var req = httpPayload.fetchGetHeader('api/getInsights/'+id+'/');

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
          var _saveEntityLinkingFeedback = function(data) {
            var req = httpPayload.fetchPostHeader('api/feedback/entity/',data.data);

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

          var _acceptEntityLinking = function(data) {
            var req = httpPayload.fetchPostHeader('api/feedback/entity/',data.data);

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

          var _saveCompleteReviewEntLink = function(data) {
            var req = httpPayload.fetchPostHeader('api/completeReview/entity/',data.data);
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
                var req = httpPayload.fetchPostHeader('api/completeReview/entity/',data.data);
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


          var entityLinkingService = {
            getData:_getData,
            postData:_postData,
            reviewsList:_reviewsList,
            resendNLP:_resendNLP,
            getDocumentTypesList:_getDocumentTypesList,
            retrain:_retrain,
            review:_review,
            sendEmailNlp:_sendEmailNlp,
            getDomainObjects:_getDomainObjects,
            getEntityLinks:_getEntityLinks,
            saveEntityLinkingFeedback:_saveEntityLinkingFeedback,
            acceptEntityLinking:_acceptEntityLinking,
            saveCompleteReviewEntLink:_saveCompleteReviewEntLink,
            getPostProcessData:_getPostProcessData,
            saveChangedState: _saveChangedState,
            getDomainObjectsEntities: _getDomainObjectsEntities
//            downloadFile:_downloadFile

          };

          return entityLinkingService;
		});
})();