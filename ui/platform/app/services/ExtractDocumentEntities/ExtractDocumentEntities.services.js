(function() {
'use strict';
angular.module('console.ExtractDocumentEntitiesServices', [])
.factory('ExtractDocumentEntitiesServices', function($q, $http,httpPayload) {

    var _testExtractDocumentEntities = function(reqObj) {
        var req = {
          method: 'POST',
          url: '/api/services/test/',
          headers: httpPayload.getHeader(),
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


    var ExtractDocumentEntitiesServices = {
        testExtractDocumentEntities:_testExtractDocumentEntities
    };

    return ExtractDocumentEntitiesServices;
});
})();

