(function() {
	'use strict';
    angular.module('console.bpmnServices', [])
		.service('bpmnServices', function($state,$q, $http, $location,httpPayload) {

        var _getAllPipelinesList = function(reqObj) {
            var req = {
                method: 'GET',
                url:'api/getpipeline/',
                transformResponse : function(response) {
                    return response;
                }
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

        var _getListOfBpmnFiles = function(reqObj,sess_id,access_token) {
            var req = {
                method: 'POST',
                url: '/api/workflow/'+reqObj.data.workflow_id+'/bpmn',
                headers: httpPayload.getHeader(),
                data:reqObj
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

        var _getApiSpec = function(reqObj) {
            var req = {
                method: 'GET',
                url:"api/spec/"
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
                url:"api/get/solnid/",
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

        var selectedBpmnObj={};

        var _setSelectedBpmn = function (obj) {
            selectedBpmnObj = obj;
        }
        var _getSelectedBpmn = function (obj) {
            return selectedBpmnObj;
        }

        var _deleteBpmn = function(reqObj,apiUrl) {
            var req = {
                method: 'POST',
                url:apiUrl+"case-management/rest/servicecalls/deleteBpmn",
                headers: {'Content-Type': 'application/json'},
                data:reqObj
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

        var _activateBpmn = function(reqObj,apiUrl) {
            var req = {
                method: 'POST',
                url:apiUrl+"case-management/rest/servicecalls/activateDefinition",
                headers: {'Content-Type': 'application/json'},
                data:reqObj
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

        var _getThresholdForTask = function(reqObj) {
            var req = {
                method: 'GET',
                url:"/api/solution/"+reqObj.solution_id+"/workflow/"+reqObj.workflow_id+"/task/"+reqObj.task_id+"/threshold/"
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
        var _updateThresholdForTask = function(reqObj) {
            var req = {
                method: 'PUT',
                url:"/api/solution/"+reqObj.solution_id+"/workflow/"+reqObj.workflow_id+"/task/"+reqObj.task_id+"/threshold/",
                data:{"threshold":reqObj.threshold, "applicable": reqObj.applicable }
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

        var _postThresholdForTask = function(reqObj) {
            var req = {
                method: 'POST',
                url:"/api/solution/"+reqObj.solution_id+"/workflow/"+reqObj.workflow_id+"/task/"+reqObj.task_id+"/threshold/",
                data:{"threshold":reqObj.threshold, "applicable": reqObj.applicable}
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
        var _saveBpmn = function(reqObj,sess_id,access_token) {
           var req = {
                method: 'POST',
                url:'/api/workflow/bpmn/save',
                headers: httpPayload.getHeader(),
                data:reqObj
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

        var BPMN_Services = {
           getAllPipelinesList:_getAllPipelinesList,
           getListOfBpmnFiles:_getListOfBpmnFiles,
           getApiSpec:_getApiSpec,
           getSolnId:_getSolnId,
           setSelectedBpmn:_setSelectedBpmn,
           getSelectedBpmn:_getSelectedBpmn,
           deleteBpmn:_deleteBpmn,
           saveBpmn:_saveBpmn,
           activateBpmn:_activateBpmn,
           getThresholdForTask:_getThresholdForTask,
           updateThresholdForTask:_updateThresholdForTask,
           postThresholdForTask:_postThresholdForTask
        };
        return BPMN_Services;

	});
})();