(function() {
	'use strict';
    angular.module('console.userGroupServices', [])
		.service('userGroupServices', function($state,$q, $http, httpPayload) {
             var _getUserGroups = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/usergroups/',
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


              var _createUserGroup = function(data,sessId) {
                if(data.parentId!=undefined)
                    var url='api/usergroups/'+data.parentId+'/';
                 else
                    var url='api/usergroups/';

                var req = {
                      method: 'POST',
                      url: url,
                      data: data,
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
              var _createSubUserGroup = function(data,sessId,parentId) {
                 var req = {
                      method: 'POST',
                      url: 'api/nestedusergroups/'+parentId+"/",
                      data: data,
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

              var _editUserGroup = function(data,sessId) {

                var req = {
                      method: 'POST',
                      url: 'api/updateuser/',
                      data: data,
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




              var _deleteUserGroup = function(data,sess_id) {

                var req = {
                      method: 'DELETE',
                      url: 'api/usergroups/'+data.id,
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

              var _saveGroupMembers = function(data,sessId) {
                var req = {
                      method: 'POST',
                      url: 'api/linkusers/',
                      data: data,
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



              var userGroupService = {
                createUserGroup:_createUserGroup,
                createSubUserGroup:_createSubUserGroup,
                editUserGroup:_editUserGroup,
                getUserGroups:_getUserGroups,
                deleteUserGroup:_deleteUserGroup,
                saveGroupMembers:_saveGroupMembers,
              };

              return userGroupService;
		});
})();