(function () {
    'use strict';
    angular.module('console.sourceServices', [])
        .service('sourceService', function ($state, $q, $http,httpPayload) {
            var s3URL = {};
            var _savemailconfiguration = function (mailconfig, sess_id, sol_id) {
                var req = {
                    method: 'POST',
                    url: '/api/solutions/' + sol_id + '/sources/',
                    headers:httpPayload.getHeader(),
                    data: mailconfig
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };
            var _updatemailconfiguration = function (mailconfig, sess_id, sol_id) {
                var req = {
                    method: 'PUT',
                    url: '/api/solutions/' + sol_id + '/sources/' + mailconfig.source_id + "/",
                    headers:httpPayload.getHeader(),
                    data: mailconfig
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _getemailsdata = function (sess_id, sol_id) {

                var req = {
                    method: 'GET',
                    url: 'api/solutions/' + sol_id + '/sources/',
                    headers:httpPayload.getHeader()
                };
                var deferred = $q.defer();

                //   var data = [
                //     {
                //         "source_id": "fdsfds",
                //         "solution_id": "5d18c6d3-d192-4c98-8ec9-3c923553f06b",
                //         "solution_name": "CaseMgmt",
                //         "type": "email",
                //         "name": "xpms-mail",
                //         "description": "Mail configuration for XPMS",
                //         "config": {
                //             "type": "imap",
                //             "host": "smtp.abc.com",
                //             "port": "447",
                //             "email": "noreply@abc.com",
                //             "password": "Test",
                //             "use_ssl": false
                //         },
                //         "is_enabled": true,
                //         "created_by": "admin",
                //         "created_ts": "Mon, 15 Oct 2018 10:53:47 GMT",
                //         "modified_by": "admin",
                //         "modified_ts": "Mon, 15 Oct 2018 10:53:47 GMT",
                //         "is_deleted": false,
                //         "destination": "/mail",
                //         "schedules": [
                //             {
                //                 "schedule_id": "fdszvdsffds",
                //                 "name": "Pull Schedule",
                //                 "description": "",
                //                 "frequency": [
                //                     {
                //                         "time":"1",
                //                         "time_zone":"IST",
                //                     },
                //                     {
                //                         "time":"23",
                //                         "time_zone":"IST",
                //                     }  
                //                 ],
                //                 "frequency_type": "Daily",
                //                 "rules": [],
                //                 "is_enabled": true,
                //                 "created_by": "",
                //                 "created_ts": "",
                //                 "modified_by": "",
                //                 "modified_ts": ""
                //             }
                //             // {
                //             //     "schedule_id": "fdszvdsffddds",
                //             //     "name": "Pull Schedule",
                //             //     "description": "",
                //             //     "frequency": [
                //             //         {
                //             //             "hrs":"1",
                //             //             "mns":"30",
                //             //             "pull_type":"Hours"
                //             //         },
                //             //         {
                //             //             "hrs":"4",
                //             //             "mns":"25",
                //             //             "pull_type":"Hours"
                //             //         }  
                //             //     ],
                //             //     "frequency_type": "Interval",
                //             //     "rules": [],
                //             //     "is_enabled": true,
                //             //     "created_by": "",
                //             //     "created_ts": "",
                //             //     "modified_by": "",
                //             //     "modified_ts": ""
                //             // }

                //         ],
                //         "triggers": [
                //             // {
                //             //     "trigger_id": "fsdfsddsfds",
                //             //     "name": "Casegmt_WF_Trigger",
                //             //     "description": "",
                //             //     "frequency": "",
                //             //     "frequency_type": "",
                //             //     "is_enabled": true,
                //             //     "rules": [],
                //             //     "workflows": [
                //             //         "5d18c6d3-d192-4c98-8ec9-3c923553fdfsf",
                //             //         "5d18c6d3-d192-4c98-8ec9-3c923553d4fsd"
                //             //     ],
                //             //     "created_by": "",
                //             //     "created_on": "",
                //             //     "modified_by": "",
                //             //     "modified_on": ""
                //             // },
                //             {
                //                 "trigger_id": "fdszvdsffdsewew",
                //                 "name": "Process Schedule",
                //                 "description": "",
                //                 "frequency": [
                //                     {
                //                         "time":"1",
                //                         "time_zone":"IST",
                //                     },
                //                     {
                //                         "time":"23",
                //                         "time_zone":"IST",
                //                     }  
                //                 ],
                //                 "frequency_type": "Daily",
                //                 "rules": [],
                //                 "is_enabled": true,
                //                 "created_by": "",
                //                 "created_ts": "",
                //                 "modified_by": "",
                //                 "modified_ts": ""
                //             }
                //         ],
                //         "workflow":  "5d18c6d3-d192-4c98-8ec9-3c923553fdfsf"

                //     }
                // ];

                //   deferred.resolve({
                //       data: data
                //     });
                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _testemailconfig = function (params) {
                var req = {
                    method: 'POST',
                    url: '/api/testemailconnection/',
                    data: params
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var _triggerworkflow = function(params){
                var req = {
                    method: 'POST',
                    url: 'http://camunda.d-3713.stack.dev.xpms.ai:8080/case-management/rest/servicecalls/triggerProcess',
                    data: params
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var _getFilesdata = function (sess_id, sol_id) {
                var req = {
                    method: 'GET',
                    url: 'api/solutions/' + sol_id + '/filesources/',
                    headers:httpPayload.getHeader()
                };
                var deferred = $q.defer();
                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var _savefileinfo = function (fileinfo, sess_id, sol_id) {
                var req = {
                    method: 'POST',
                    url: '/api/solutions/' + sol_id + '/filesources/',
                    headers:httpPayload.getHeader(),
                    data: fileinfo
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _getworkflows = function (sess_id) {
                var req = {
                    method: 'POST',
                    url: 'api/workflow/list/',
                    headers:httpPayload.getHeader(),
                    data: {"filter_obj":{"no_of_recs": 100000, "sort_by": "updated_ts", "order_by": false }}
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var _gets3URL = function (sess_id) {
                var req = {
                    method: 'GET',
                    url: 'api/s3bucketurl/',
                };
                var deferred = $q.defer();

                // deferred.resolve({
                //     data: "http://console.d-1109.stack.dev.xpms.ai:8080/api/presignedurl/"
                //   });

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var _fetchs3URL = function(){
                return s3URL.url;
            }

            var _sets3URL = function(URL){
                s3URL.url = URL;
            }

            var _uploadfile = function (url,params) {
                var req = {
                    method: 'POST',
                    url: 'api/presignedurl/',
//                    url: 'http://console.dev.stack.dev.xpms.ai:8080/api/presignedurl/',
                    data: params
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var sourceService = {
                savemailconfiguration: _savemailconfiguration,
                getEmails: _getemailsdata,
                getFilesdata:_getFilesdata,
                getworkflows: _getworkflows,
                updatemailconfiguration: _updatemailconfiguration,
                testemailconfig:_testemailconfig,
                gets3URL:_gets3URL,
                fetchs3URL:_fetchs3URL,
                sets3URL:_sets3URL,
                uploadfile:_uploadfile,
                savefileinfo:_savefileinfo,
                triggerworkflow:_triggerworkflow
            };

            return sourceService;
        });
})();