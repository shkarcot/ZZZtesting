(function() {
	'use strict';
    angular.module('console.userRoleServices', [])
		.service('userRoleServices', function($state,$q, $http, httpPayload) {
             var _getUserRoles = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/userroles/',
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


              var _createUserRole = function(data,sessId) {
                if(data.parentId!=undefined)
                    var url='api/userroles/'+data.id;
                 else
                    var url='api/userroles/';

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
              var _createSubUserRole = function(data,sessId,parentId) {
                 var req = {
                      method: 'POST',
                      url: 'api/nesteduserroles/'+parentId+"/",
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

              var _editUserRole = function(data,sessId) {

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




              var _deleteUserRole = function(data,sess_id) {

                var req = {
                      method: 'DELETE',
                      url: 'api/userroles/'+data.id,
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


               var _saveRoleMembers = function(data,sessId) {
                 var req = {
                      method: 'POST',
                      url: 'api/linkuserstorole/',
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


              var _addUserToRole = function(data,sessId) {
                 var req = {
                      method: 'POST',
                      url: 'api/linkuserstorole/',
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

              var _deleteUserFromRole = function(data,sessId) {
                 var req = {
                      method: 'DELETE',
                      url: 'api/userroles/'+data.roleId+'/users/'+data.userId,
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

              var _getUserRoleById = function(roleId ,sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/userroles/'+roleId,
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

              var userRoleService = {
                createUserRole:_createUserRole,
                createSubUserRole:_createSubUserRole,
                editUserRole:_editUserRole,
                getUserRoles:_getUserRoles,
                deleteUserRole:_deleteUserRole,
                saveRoleMembers:_saveRoleMembers,
                addUserToRole:_addUserToRole,
                deleteUserFromRole:_deleteUserFromRole,
                getUserRoleById:_getUserRoleById
              };

              return userRoleService;
		});
})();