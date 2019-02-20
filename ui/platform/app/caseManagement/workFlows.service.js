(function() {
	'use strict';
    angular.module('console.caseManagementServices', [])
		.service('caseManagementServices', function($state,$q, $http,httpPayload) {

        var _getAllWorkFlows = function(reqObj) {
            var req = {
            method: 'POST',
            url: 'api/workflow/list',
            headers: httpPayload.getHeader(),
            data: reqObj.data
            };
            var deferred = $q.defer();
            $http(req).success(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            }).error(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            });

            return deferred.promise;
        };

        var _createCaseWorkflow = function(reqObj) {
            var req = {
              method: "POST",
              url: 'api/workflow/save',
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

        var _updateWorkflow = function(reqObj) {
            var req = {
              method: "POST",
              url: 'api/workflow/save',
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

        var _enableWorkflow = function(reqObj) {
            var enableFlag = reqObj.data.is_enabled;
            delete reqObj.data["is_enabled"];
            var req = {
              method: "POST",
              url: 'api/workflow/'+reqObj.data.data.id+'/enable/'+enableFlag,
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

        var _deleteCaseWorkflow = function(reqObj) {
            var req = {
              method: 'DELETE',
              url: 'api/workflow/'+reqObj.data.data.id,
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

        var _saveCaseVariables = function(obj) {
            var req = {
                method: 'POST',
                url:"api/workflow/case_object/save",
                headers: httpPayload.getHeader(),
                data:obj.data
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

        var _getCaseVariablesForWF = function(obj) {
            var wf_id = obj.data.w_id;
            delete obj.data["w_id"];
            var req = {
                method: 'POST',
                url:"api/workflow/"+wf_id,
                headers:httpPayload.getHeader(),
                data:obj.data
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

        var _getCaseVariables = function() {
            var req = {
                method: 'GET',
                headers:httpPayload.getHeader(),
                url:"api/wfvariables/"
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



        var caseMngmntService = {
            getAllWorkFlows:_getAllWorkFlows,
            createCaseWorkflow:_createCaseWorkflow,
            deleteCaseWorkflow:_deleteCaseWorkflow,
            getCaseVariables:_getCaseVariables,
            saveCaseVariables:_saveCaseVariables,
            getCaseVariablesForWF:_getCaseVariablesForWF,
            updateWorkflow: _updateWorkflow,
            enableWorkflow:_enableWorkflow

        };

        return caseMngmntService;
});
})();