(function() {
'use strict';
angular.module('console.IngestDocumentServices', [])
.factory('IngestDocumentServices', function($q, $http,httpPayload) {

  var _getIdentityTables = function(data) {
    var req = {
          method: 'GET',
          url: '/api//',
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

  var _saveDocumentId = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api//',
      headers:httpPayload.getHeader(),
      data: reqObj.data.data
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


    var IngestDocumentServices = {
        getIdentityTables:_getIdentityTables,
        saveDocumentId:_saveDocumentId
    };

    return IngestDocumentServices;
});

})();
