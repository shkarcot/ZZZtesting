'use strict';
angular.module('console.caseManagement')
  .config(function($provide) {
      $provide.decorator('$state', function($delegate, $stateParams) {
          $delegate.forceReload = function() {
              return $delegate.go($delegate.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
          };
          return $delegate;
      });
  })
.controller('caseQueuesCtrl', function ($scope,$state,$rootScope,$location,$stateParams,ngDialog,$window,$timeout,caseQueueService,caseManagementServices) {
        var vm = this;
        vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
        vm.sess_id= vm.loginData.sess_id;
        //$(".threshold-custom").height($(window).height());
        vm.workFlowId = $stateParams.id;
        var resp={"status": "success", "config": {"operators": [{"display_name": "Equals", "symbol": "==", "oper": "eq", "desc": "", "data_type": ["string", "numeric", "date"], "supports": ["V", "S"]}, {"display_name": "Not Equals", "symbol": "!=", "oper": "neq", "desc": "", "data_type": ["string", "numeric", "date"], "supports": ["V", "S"]}, {"display_name": "Greater Than", "symbol": ">", "oper": "gt", "desc": "", "data_type": ["numeric", "date"], "supports": ["V", "S"]}, {"display_name": "Greater Than Equals", "symbol": ">=", "oper": "gte", "desc": "", "data_type": ["numeric", "date"], "supports": ["V", "S"]}, {"display_name": "Less Than", "symbol": "<", "oper": "lt", "desc": "", "data_type": ["numeric", "date"], "supports": ["V", "S"]}, {"display_name": "Less Than Equals", "symbol": "<=", "oper": "lte", "desc": "", "data_type": ["numeric", "date"], "supports": ["V", "S"]}, {"display_name": "Regex", "desc": "", "supports": ["V", "S"], "oper": "regx"}, {"display_name": "RegexExists", "desc": "", "supports": ["V", "S"], "oper": "regx-exists"}, {"display_name": "Exists", "desc": "", "supports": ["V", "S"], "oper": "in", "data_type": ["string", "list"]}, {"display_name": "Not Exists", "desc": "", "supports": ["V", "S"], "oper": "nin", "data_type": ["string", "list"]}, {"display_name": "Between", "desc": "", "supports": ["V", "S"], "oper": "btw", "data_type": ["numeric", "date"]}, {"display_name": "In Vocabulary", "desc": "", "supports": ["V", "S"], "oper": "lookup", "data_type": ["string"]}, {"is_custom": true, "display_name": "equalscondition", "lang": "js", "oper": "equalscondition", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/750fec49-067d-4faa-84f2-b8e3c43b26e4/custom.js"}, {"is_custom": true, "display_name": "cust_gt", "lang": "js", "oper": "cust_gt", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/01738494-5a5e-44c6-b9ff-d5ddc396294b/custom.js"}, {"is_custom": true, "display_name": "src_gt_target", "lang": "js", "oper": "src_gt_target", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/f93422db-6023-4626-9573-332d4c258d41/custom.js"}, {"is_custom": true, "display_name": "tes1", "lang": "js", "oper": "tes1", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/b5996571-2c29-4ee6-a0a4-796947c7e10c/custom.js"}, {"is_custom": true, "display_name": "f to celsius", "lang": "js", "oper": "f to celsius", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/508195a5-fab1-4706-bb12-9faf72c4e934/custom.js"}, {"is_custom": true, "display_name": "cutomcondition", "lang": "js", "oper": "cutomcondition", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/d73e85e7-0f3f-48ef-9f92-f6c97bb226a1/custom.js"}], "actions": [{"display_name": "Set", "desc": "", "supports": ["S", "T"], "oper": "set"}, {"display_name": "Replace", "desc": "", "supports": ["S"], "oper": "replace"}, {"display_name": "Date conversion", "desc": "", "supports": ["S", "T"], "oper": "convertDate"}, {"display_name": "Join", "desc": "", "supports": ["S", "T"], "oper": "join"}, {"display_name": "Split", "options": [{"display_name": "Assign", "oper": "splitAssign"}, {"display_name": "For Each", "oper": "splitForEach"}], "desc": "", "supports": ["S", "T"], "oper": "split"}, {"display_name": "Prefix", "desc": "", "supports": ["S"], "oper": "prefix"}, {"display_name": "Suffix", "desc": "", "supports": ["S"], "oper": "suffix"}, {"display_name": "Matches", "desc": "", "supports": ["S", "T"], "oper": "getMatches"}, {"is_custom": true, "display_name": "add", "lang": "js", "oper": "add", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/88333288-5fe9-44c1-9d5d-f2ab8bae31ce/custom.js"}, {"is_custom": true, "display_name": "source", "lang": "js", "oper": "source", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/68a7f89b-839b-446a-a751-5c93fa609860/custom.js"}, {"is_custom": true, "display_name": "98227fc3-c65c-40c9-8a05-8daba391a2ad", "lang": "js", "oper": "98227fc3-c65c-40c9-8a05-8daba391a2ad", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/98227fc3-c65c-40c9-8a05-8daba391a2ad/custom.js"}, {"is_custom": true, "display_name": "append_10", "lang": "js", "oper": "append_10", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/61becf84-d21e-4f1b-a0ab-37d83ed5e9fd/custom.js"}, {"is_custom": true, "display_name": "testdata", "lang": "js", "oper": "testdata", "file_path": "/efs-ranger1-dev/qafix_f04b26a1-241b-4aad-a91d-0be28375df73/custom_rules/5d410f67-7984-4abc-9be7-39aacfa3dc50/custom.js"}], "functions": [{"display_name": "Length(value)", "fn": "len", "data_type": ["string", "numeric", "date", "object", "list"], "desc": ""}, {"display_name": "Trim(value)", "fn": "trim", "data_type": ["string"], "desc": ""}, {"display_name": "LTrim(value)", "fn": "ltrim", "data_type": ["string"], "desc": ""}, {"display_name": "RTrim(value)", "fn": "rtrim", "data_type": ["string"], "desc": ""}, {"display_name": "UpperCase(value)", "fn": "toUpper", "data_type": ["string"], "desc": ""}, {"display_name": "LowerCase(value)", "fn": "toLower", "data_type": ["string"], "desc": ""}, {"display_name": "ceil(value)", "fn": "ceil", "data_type": ["numeric"], "desc": ""}, {"display_name": "Floor(value)", "fn": "floor", "data_type": ["numeric"], "desc": ""}, {"display_name": "Sqrt(value)", "fn": "sqrt", "data_type": ["numeric"], "desc": ""}]}};
        vm.rulesConfig = resp.config;
        vm.operatorsList = resp.config.operators;
        vm.functionsList = resp.config.functions;
        vm.actionsList = resp.config.actions;
        $scope.access_token = vm.loginData.accesstoken;
        $scope.filter_obj ={"page_no": 1, "no_of_recs": 12, "sort_by":"updated_ts", "order_by":false};

        vm.userGroupsList = [];
        vm.userGroupsListObj=[];

        vm.flatUserGroups = function(listObj){
           vm.flatUserGroupList.push(listObj);
           if(listObj.subGroups != null){
               if(listObj.subGroups.length != 0){
                   for(var i=0;i<listObj.subGroups.length;i++){
                       vm.flatUserGroups(listObj.subGroups[i]);
                   }
               }
           }
       };

        vm.getAllUserGroupsList = function(){
            caseQueueService.getAllUserGroups({'sess_id':vm.sess_id}).then(function(response){
               if(response.data.status=="success"){
                   vm.userGroupsListObj = response.data.result.data;

                  vm.flatUserGroupList = [];
                  for(var i=0;i<vm.userGroupsListObj.length;i++){
                      vm.flatUserGroups(vm.userGroupsListObj[i]);
                  }
                  console.log(vm.flatUserGroupList);


                   angular.forEach(vm.userGroupsListObj, function(value,key){
                        vm.userGroupsList.push(value.name);
                   });
               }
               else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
            },function(err){
                $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'danger',
                     timeout : 3000,
                     pos     : 'top-center'
                });
            });
        };
        vm.getAllUserGroupsList();

        vm.formatDate = function(date) {
              var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct",
                "Nov", "Dec"
              ];
              var newDate = new Date(date);
              var day = newDate.getDate();
              var monthIndex = newDate.getMonth();
              var year = newDate.getFullYear();
              var hours = newDate.getHours();
              var minutes = newDate.getMinutes();
              if(minutes<10)
                 minutes = '0'+minutes;
              if(day<10)
                 day = '0'+day;
              if(hours<10)
                 hours = '0'+hours;

              return day + ' ' + monthNames[monthIndex] + ' ' + year + ' @ ' + hours + ':' + minutes;
        };

        vm.getQueuesList = function(){
            var solId=localStorage.getItem("solutionId");
            var reqData = {
                "data": {
                        "workflow_id": vm.workFlowId,
                        'filter_obj':$scope.filter_obj
                },
                "solution_id": solId
            }
            caseQueueService.getQueues({'sess_id':vm.sess_id,'data': reqData,'access_token':$scope.access_token}).then(function(response){
               if(response.data.status.success){
                   vm.allQueues = response.data.metadata.queues;
                   $scope.filter_obj.totalRecords = response.data.metadata.total_queues;
               }
               else{
                    $.UIkit.notify({
                       message : response.data.status.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
            },function(err){
                $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'danger',
                     timeout : 3000,
                     pos     : 'top-center'
                });
            });
        };

        vm.getQueuesList();

        $rootScope.getTestList = function(){
            vm.showCaseQueContent=false;
            var solId=localStorage.getItem("solutionId");
            var obj = {"data":{},"solution_id":solId};
            obj.w_id = $stateParams.id;
            caseManagementServices.getCaseVariablesForWF({"sess_id":$scope.sess_id,"data":obj,'access_token': $scope.access_token}).then(function(response){
                   if(response.data.status.success){
                        vm.existingVariables = response.data.metadata.workflow.case_object;
                   }
                   else{
                        $.UIkit.notify({
                           message : response.data.status.msg,
                           status  : 'danger',
                           timeout : 3000,
                           pos     : 'top-center'
                       });
                   }
            },function(err){
                $.UIkit.notify({
                       message : 'Internal Server Error',
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
            });
        };

        $scope.pageChanged = function (page) {
            $scope.filter_obj.page_no = page;
            vm.getQueuesList()
        };

        vm.showCaseQueContent=false;
        vm.isDisableQue=true;
        vm.newQueueObj={};

        vm.createNewQueue =function(){
            vm.showCaseQueContent=true;
            vm.createMode = true;
            vm.newQueueObj={};
            vm.newRule();
            vm.newQueueObj.workflow_id = vm.workFlowId;
            vm.newQueueObj.user_assignment_strategy='self_assignment';
        };
        vm.closeNewQueue = function(){
            vm.ruleObj = {};
            vm.newQueueObj={};
            vm.showCaseQueContent=false;
        };
        vm.saveNewQueue = function(){
            vm.ruleObj.rule_name = vm.newQueueObj.name;
            var arrGroup = vm.newQueueObj.user_groups.map(function(e){return {"id":e.id,"name":e.name}});
            vm.newQueueObj.user_groups = angular.copy(arrGroup);
            angular.forEach(vm.ruleObj.rule.conds,function(value,key){
                var filArr = vm.existingVariables.filter(function(e){if(e.name == value.lval){return e}});
                if(filArr.length != 0)
                    value.path_mapping = filArr[0].path_mapping;
            });
            if(vm.ruleObj.rule.conds.length==1){
                if(vm.ruleObj.rule.conds[0].op == "" || vm.ruleObj.rule.conds[0].rval == "" || vm.ruleObj.rule.conds[0].lval == ""){
                    vm.ruleObj = null;
                    vm.newQueueObj.rule = angular.copy(vm.ruleObj);
                }
                else{
                    vm.newQueueObj.rule = angular.copy(vm.ruleObj);
                }
            }
            else{
                if(vm.ruleObj.rule.conds[vm.ruleObj.rule.conds.length-1].op == "" || vm.ruleObj.rule.conds[vm.ruleObj.rule.conds.length-1].rval == "" || vm.ruleObj.rule.conds[vm.ruleObj.rule.conds.length-1].lval == ""){
                    vm.ruleObj.rule.conds.splice(vm.ruleObj.rule.conds.length-1,1);
                }
                vm.newQueueObj.rule = angular.copy(vm.ruleObj);
            }
            var solId=localStorage.getItem("solutionId");
            var reqData = {
                "data": vm.newQueueObj,
                "solution_id": solId
            }
            caseQueueService.saveQueue({'sess_id':vm.sess_id,'data':reqData,'access_token':$scope.access_token}).then(function(response){
               if(response.data.status.success){
                   $.UIkit.notify({
                       message : response.data.status.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
                   vm.newQueueObj={};
                   vm.ruleObj = {};
                   vm.showCaseQueContent=false;
                   vm.getQueuesList();
               }
               else{
                    $.UIkit.notify({
                       message : response.data.status.msg,
                       status  : 'danger',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            });
        };

        vm.deleteQueue = function(queue){
            var solId=localStorage.getItem("solutionId");
            var reqData = {
                    "data": {
                            "workflow_id": vm.workFlowId
                    },
                    "solution_id": solId,
                    "q_id": queue.id
                }
            var accToken = $scope.access_token;
            ngDialog.open({ template: 'confirmBox',
                  controller: ['$scope','$state' ,function($scope,$state) {
                      $scope.popUpText = "Do you really want to delete "+queue.name+" queue?";
                      $scope.onConfirmActivation = function (){
                          caseQueueService.deleteQueue({'sess_id':vm.sess_id,'data':reqData,'access_token':accToken}).then(function(response){
                               if(response.data.status.success){
                                   ngDialog.close();
                                   vm.getQueuesList();
                                   $.UIkit.notify({
                                       message : response.data.status.msg,
                                       status  : 'success',
                                       timeout : 3000,
                                       pos     : 'top-center'
                                   });
                               }
                               else{
                                    $.UIkit.notify({
                                       message : response.data.status.msg,
                                       status  : 'danger',
                                       timeout : 3000,
                                       pos     : 'top-center'
                                   });
                               }
                          },function(err){
                                $.UIkit.notify({
                                   message : "Internal server error",
                                   status  : 'danger',
                                   timeout : 3000,
                                   pos     : 'top-center'
                                });
                          });
                      };
                  }]
            });
        };

        vm.editQueue = function(queue){
            var solId=localStorage.getItem("solutionId");
            var reqData = {
                    "data": {
                            "workflow_id": vm.workFlowId
                    },
                    "solution_id": solId,
                    "q_id": queue.id
                }
            caseQueueService.getQueueDetails({'sess_id':vm.sess_id,'data':reqData,'access_token':$scope.access_token}).then(function(response){
                   if(response.data.status.success){
                        vm.newQueueObj = angular.copy(response.data.metadata.queue);
                        vm.showCaseQueContent=true;
                        vm.createMode = false;
                        vm.ruleObj = vm.newQueueObj.rule;
                        if(vm.ruleObj == null){
                            vm.ruleObj = vm.getNewRule();
                        }
                   }
                   else{
                        $.UIkit.notify({
                           message : response.data.status.msg,
                           status  : 'danger',
                           timeout : 3000,
                           pos     : 'top-center'
                       });
                   }
            },function(err){
                    $.UIkit.notify({
                       message : "Internal server error",
                       status  : 'danger',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
            });
        };

        /**************************************rules code*************************************/
        vm.conditionErr = "";
        vm.getNewRule = function(){
            var rule = {};
            rule.rule_name = "";
            rule.desc = "";
            rule.module = "";
            rule.rule_type = "V";
            rule.rule = {};
            rule.rule.run_type = "any";
            rule.rule.conds = [{"op":"", "rval": "","fn":"","lval":""}];
            return rule;
        };

        vm.newRule = function(){
            vm.ruleObj = vm.getNewRule();
        };
        vm.newRule();
        vm.selectOperator = function(type){
            vm.ruleObj.rule.run_type = type;
            vm.addCondition();
        };
        vm.addCondition = function(){
            var len = vm.ruleObj.rule.conds.length;
            if(vm.ruleObj.rule.conds[len-1].op != ""){
                if(vm.ruleObj.rule.conds[len-1].rval != ""){
                    vm.ruleObj.rule.conds.push({"op":"", "rval": "","fn":"","lval":""});
                    vm.conditionErr = "";
                }
                else{
                    vm.conditionErr = "Please enter the value";
                }
            }
            else{
                vm.conditionErr = "Please select the condition first";
            }
        };
        vm.selectOperator = function(type){
            vm.ruleObj.rule.run_type = type;
            vm.addCondition();
        };
        vm.delCond = function(index){
            vm.ruleObj.rule.conds.splice(index,1);
            vm.conditionErr="";
        };


  });
