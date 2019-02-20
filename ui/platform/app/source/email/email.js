'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.source')
    .config(function ($provide) {
        $provide.decorator('$state', function ($delegate, $stateParams) {
            $delegate.forceReload = function () {
                return $delegate.go($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        });
    })
    .controller('emailController', function ($scope, $state, $rootScope, $location, sourceService,caseManagementServices) {
        var vm = this;

        vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
        var solution_id = '';
        const user_id = vm.loginData._id;

        $scope.ingestemail = function (email) {
            if(email.is_enabled==true)
            return;
            vm.testConnection = 0;
            if (angular.equals(email, {})) {
                vm.emaildata = newEmailObject();
            } else {
                vm.emaildata = email;
            }
            vm.existingpulldata = angular.copy(vm.emaildata);
            document.getElementById("ingestemail").style.width = "40%";
            var sidebarOverlay  = document.getElementsByClassName('sidebar-overlay')[0];
            sidebarOverlay.style.left = '0';
        }

        $scope.cancelemail = function () {
            document.getElementById("ingestemail").style.width = "0%";
            vm.testConnection = 0;
            var sidebarOverlay  = document.getElementsByClassName('sidebar-overlay')[0];
            sidebarOverlay.style.left = '-100%';
        };
        $scope.openemailRundetails = function () {
            document.getElementById("emailrunDetails").style.width = "50%"
        }
        $scope.closeemailRundetails = function () {
            document.getElementById("emailrunDetails").style.width = "0%"
        }

                /*Method Desc - format the date  */
        $scope.formatDate = function (date) {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ];
            var newDate = new Date(date);
            var day = newDate.getDate();
            var monthIndex = newDate.getMonth();
            var year = newDate.getFullYear();
            var hours = newDate.getHours();
            var minutes = newDate.getMinutes();
            if (minutes < 10)
                minutes = '0' + minutes;
            if (day < 10)
                day = '0' + day;
            if (hours < 10)
                hours = '0' + hours;

            return day + ' ' + monthNames[monthIndex] + ' ' + year + ' @ ' + hours + ':' + minutes;
        };


        /*Method Desc - return the base object if user wants to create new email configuration */
        function newEmailObject() {
            var newobj = {
                "solution_id": solution_id,
                "solution_name": "CaseMgmt",
                "type": "email",
                "source_type":"email",
                "name": "",
                "description": "Mail configuration for XPMS",
                "config": {
                    "type": "imap",
                    "host": "",
                    "port": "",
                    "email": "",
                    "password": "",
                    "use_ssl": false
                },
                "is_enabled": true,
                "created_by": user_id,
                "created_ts": "",
                "modified_by": user_id,
                "updated_ts": "",
                "is_deleted": false,
                "destination": "",
                "schedules": [
                    {
                        "name": "Pull Schedule",
                        "description": "",
                        "frequency": [
                            {
                                "time": "1",
                                "time_zone": "IST",
                            }
                        ],
                        "frequency_type": "Daily",
                        "rules": [],
                        "is_enabled": true,
                        "created_by": user_id,
                        "created_ts": "",
                        "modified_by": user_id,
                        "updated_ts": ""
                    }
                ],
                "is_pause_pull": false,
                "triggers": [
                    {
                        "name": "Process Schedule",
                        "description": "",
                        "frequency": [
                            {
                                "time": "1",
                                "time_zone": "IST",
                            }
                        ],
                        "frequency_type": "Daily",
                        "rules": [],
                        "is_enabled": true,
                        "created_by": user_id,
                        "created_ts": "",
                        "modified_by": user_id,
                        "updated_ts": ""
                    }
                ],
                "workflow": ''
            };
            return newobj;
        }
        /* Method Desc - Get all Email Configure Lists
           Method - Get
           Params - Session,solutionId */
        $scope.getEmailConfigures = function () {
            sourceService.getEmails(vm.loginData.sess_id, solution_id).then(function (result) {
                if (result.data.length == 0) {
                    vm.emailList = newEmailObject();
                } else {
                    vm.emailList = result.data.data;
                }
            }, function () {
                $.UIkit.notify({
                    message: "Internal server error",//'Solution name has not been updated',
                    status: 'danger',
                    timeout: 2000,
                    pos: 'top-center'
                });
            });

//            sourceService.getworkflows(vm.loginData.sess_id).then(function (result) {
//                vm.workflowlist = result.data.data;
//            }, function () {
//                $.UIkit.notify({
//                    message: "Internal server error",//'Solution name has not been updated',
//                    status: 'danger',
//                    timeout: 2000,
//                    pos: 'top-center'
//                });
//            })

            var data = {"data":{},"solution_id": solution_id} ;
            caseManagementServices.getAllWorkFlows({'sess_id':vm.loginData.sess_id,"data": data,'access_token':vm.loginData.accesstoken}).then(function(response){
               if(response.data.status.success){
                 vm.workflowlist=response.data.metadata.workflows;
               }
               else{
                    $.UIkit.notify({
                       message : response.data.status.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
            });
        }

        /* Method Desc - add new frequency to existing selected list of schedules
           */
        $scope.addNewfrequency = function (index, processtype) {
            if (processtype == "pull") {
                vm.emaildata.schedules[index].frequency.push({
                    "time": "1",
                    "time_zone": "IST"
                });
            } else {
                vm.emaildata.triggers[index].frequency.push({
                    "time": "1",
                    "time_zone": "IST"
                });
            }
        }

        /* Method Desc - remove  frequency from existing selected list of schedules
           */
        $scope.removefrequency = function (scheduleindex, frequencyindex, processtype) {
            if (processtype == "pull")
                vm.emaildata.schedules[scheduleindex].frequency.splice(frequencyindex, 1);
            else
                vm.emaildata.triggers[scheduleindex].frequency.splice(frequencyindex, 1);
        }

        /* Method Desc - on change function for pull schedule daily/interval
           */
        $scope.setpulltype = function (type, processtype) {
            if (processtype == 'pull') {
                if (vm.existingpulldata.schedules[0].frequency_type == type) {
                    vm.emaildata.schedules[0].frequency = angular.copy(vm.existingpulldata.schedules[0].frequency);
                }
                else {
                    vm.emaildata.schedules[0].frequency = [];
                    if (type == "Daily") {
                        vm.emaildata.schedules[0].frequency.push({
                            "time": "1",
                            "time_zone": "IST",
                        });
                    } else {
                        vm.emaildata.schedules[0].frequency.push({
                            "hrs": "1",
                            "mns": "1",
                            "pull_type": "Hours"
                        });
                    }
                }
            } else {
                if (vm.existingpulldata.triggers[0].frequency_type == type) {
                    vm.emaildata.triggers[0].frequency = angular.copy(vm.existingpulldata.triggers[0].frequency);
                }
                else {
                    vm.emaildata.triggers[0].frequency = [];
                    if (type == "Daily") {
                        vm.emaildata.triggers[0].frequency.push({
                            "time": "1",
                            "time_zone": "IST",
                        });
                    } else {
                        vm.emaildata.triggers[0].frequency.push({
                            "hrs": "1",
                            "mns": "1",
                            "trigger_type": "Hours"
                        });
                    }
                }
            }
        }

        $scope.testConfiguration = function(config){
            vm.loading = true;
            vm.testConnection = 0;
            sourceService.testemailconfig(config).then(function(response){
                
                vm.loading = false;
                console.log(response.status);
                if(response.status=="failure")
                vm.testConnection = 2;
                if(response.status=="success")
                vm.testConnection = 1;  
            },function(){
                vm.loading = false;
            })
        }

        /* Method Desc - save/update email configuration
           Params - updateobject,solutionId */
        $scope.saveconfiguration = function (data) {
            if (!data.workflow || !data.destination || !data.config.email || !data.config.password || !data.config.port || !data.config.host) {
                $.UIkit.notify({
                    message: "Please fill the  mandatory(*) fields",//'Solution name has not been updated',
                    status: 'danger',
                    timeout: 2000,
                    pos: 'top-center'
                });
                return;
            }
            if (data.schedules.length == 0 || data.triggers.length === 0) {
                $.UIkit.notify({
                    message: "Pull (or) Process schedule need to be fill",//'Solution name has not been updated',
                    status: 'danger',
                    timeout: 2000,
                    pos: 'top-center'
                });
                return;
            }
            data.name = data.config.email;
            if (data.source_id) {
                data.solution_id = solution_id;
                sourceService.updatemailconfiguration(data, vm.loginData.sess_id, solution_id).then(function (response) {
                    console.log(response);
                    $scope.cancelemail();
                    $scope.getEmailConfigures();
                }, function () {

                });
            } else {
                data.solution_id = solution_id;
                data.modified_by = user_id;
                data.schedules[0].modified_by = user_id;
                data.triggers[0].modified_by = user_id;
                sourceService.savemailconfiguration(data, vm.loginData.sess_id, solution_id).then(function (response) {
                    console.log(response);
                    $scope.cancelemail();
                    $scope.getEmailConfigures();
                }, function () {

                });
            }
        }

        vm.getSolutionId = function(){
           bpmnServices.getSolnId().then(function (response) {
                               if(response.data.status=='success'){
                                   solution_id = response.data.solution_id;
                                   $scope.getEmailConfigures();
                               }
           },function(err){

           });
        };
        if(vm.loginData.user!=undefined){
           if(vm.loginData.user.solution_id!=undefined){
               solution_id = vm.loginData.user.solution_id;
               $scope.getEmailConfigures();
           }else{
               vm.getSolutionId();
           }
        }else{
           vm.getSolutionId();
        }


    });
