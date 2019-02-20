(function() {
'use strict';

angular.module('console.extractMetadataServices', [])
.factory('extractMetadataServices', function($q, $http,httpPayload) {

  var _testExtractMetadataDoc = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/services/test/',
      headers:httpPayload.getHeader(),
      data: reqObj.data
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

    var extractMetadataServices = {
        testExtractMetadataDoc:_testExtractMetadataDoc
    };

    return extractMetadataServices;
});
})();
