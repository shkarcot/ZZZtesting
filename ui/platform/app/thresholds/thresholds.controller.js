module.exports = ['$scope','$compile','Upload','$rootScope','ngDialog','$state','$stateParams','$window','caseManagementServices','$filter',
function($scope,$compile,Upload,$rootScope,ngDialog,$state,$stateParams,$window,caseManagementServices,$filter) {
    'use strict';
    var vm = this;
    $rootScope.state_id = $stateParams.id;
    $rootScope.seleted_workflow_name  = $stateParams.name;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    $scope.sess_id= $scope.loginData.sess_id;

    vm.domainObjectsData=[];
    vm.documentObjectsData=[];
    vm.taggedFlagArr = [];
    vm.taggedFlagArr1 = [];

    vm.selectdCaseVariables=[];

    vm.readyToMoveCaseVariable=[];

    $scope.list = [{
          name: 'Developer',
          dimension:"Domain Object",
          type:"dictionary",
          opened: true,
          children: [
            {
              name: 'Front-End',
              dimension:"Domain Object",
              type:"dictionary",
              opened: true,
              children: [
                {
                  name: 'Jack',
                  dimension:"Domain Object",
                  type:"list",
                  opened: true,
                  children: [{
                              name: 'fname',
                              dimension:"Document",
                              "type":"text"
                            },
                            {
                              name: 'lname',
                              dimension:"Document",
                              "type":"text"
                            }]
                },
                {
                  name: 'John',
                  dimension:"Domain Object",
                  "type":"list"
                },
                {
                  name: 'Jason',
                  dimension:"Domain Object",
                  "type":"list"
                }
              ]
            },
            {
              name: 'Back-End',
              dimension:"Document",
               type:"text",
               opened: true,
              children: [
                {
                  name: 'Mary',
                  dimension:"Document",
                  type:"text"
                },
                {
                  name: 'Gary',
                  dimension:"Document",
                  type:"text"
                }
              ]
            }
          ]
        },
        {
          name: 'Design',
          dimension:"Document",
          type:"text",
          opened: true,
          children: [
            {
              name: 'Freeman',
              dimension:"Document",
              type:"text"
            }
          ]
        },
        {
          name: 'S&S',
          dimension:"Document",
          type:"text",
          opened: true,
          children: [
            {
              name: 'Nikky',
              dimension:"Document",
              type:"text"
            }
          ]
        }
      ];


    $scope.initCheckbox = function(item, parentItem) {
        return item.selected = parentItem && parentItem.selected || item.selected || false;
    };
    $scope.toggleCheckbox = function(item, parentScope) {
        if (item.children != null) {
          $scope.$broadcast('changeChildren', item);
        }
        if (parentScope.item != null) {
          return $scope.$emit('changeParent', parentScope);
        }
    };


    vm.getCaseVariablesList = function(){
        caseManagementServices.getCaseVariables().then(function(response){
           if(response.data.status=="success"){
                vm.domainObjectsData = response.data.domain_vars;
                vm.documentObjectsData=response.data.data;




                /*var obj = {};
                obj.workflow_id = $rootScope.state_id;
                caseManagementServices.getCaseVariablesForWF({"sess_id":$scope.sess_id,"data":obj}).then(function(response){
                       if(response.data.status=="success"){
                            vm.existingVariables = response.data.data;
                            angular.forEach(vm.caseQueuesDate,function(value,key){
                                if(value.is_default){
                                    vm.selectdCaseVariables.push(value);
                                }
                            })
                            angular.forEach(vm.existingVariables,function(value,key){
                                var index = vm.selectdCaseVariables.filter(function(e,index){
                                   if(e.name === value.name)
                                      return index;
                                });

                                if(index.length==0){
                                    vm.selectdCaseVariables.push(value);
                                }
                            })

                            angular.forEach(vm.selectdCaseVariables, function(value,key){
                                if(value.is_default){
                                    vm.taggedFlagArr1[key] = true;
                                }
                                var index = vm.caseQueuesDate.findIndex( record => record.name === value.name );
                                vm.caseQueuesDate.splice(index, 1);
                            });
                       }
                       else{
                            $.UIkit.notify({
                               message : response.data.msg,
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
                });*/
           }
           else{
                $.UIkit.notify({
                   message : response.data.msg,
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

    vm.getCaseVariablesList();

    vm.selectCaseObject=function(caseVariables, taggedFlag){
        //alert(taggedFlag);
        if(taggedFlag==true){
            vm.readyToMoveCaseVariable.push(caseVariables);
        }
        else if(taggedFlag==false){
            var index = vm.readyToMoveCaseVariable.findIndex( record => record.name === caseVariables.name );
            vm.readyToMoveCaseVariable.splice(index, 1);
        };
        console.log(vm.readyToMoveCaseVariable);
    };

    vm.readyToMoveCaseVariableFromLeftPannel=[];
    vm.selectCaseObjectRtoL = function(caseVariablesFromLeft, flag){
         //alert(flag);
        if(flag==true){
            vm.readyToMoveCaseVariableFromLeftPannel.push(caseVariablesFromLeft);
        }
        else if(flag==false){
            var index = vm.readyToMoveCaseVariableFromLeftPannel.findIndex( record => record.name === caseVariablesFromLeft.name );
            vm.readyToMoveCaseVariableFromLeftPannel.splice(index, 1);
        };
        console.log(vm.readyToMoveCaseVariableFromLeftPannel);
    };

    vm.saveCaseObjects = function(){
        var obj={};
            obj.workflow_id = $rootScope.state_id;
            obj.case_object = vm.selectdCaseVariables;
        caseManagementServices.saveCaseVariables({"sess_id":$scope.sess_id,"data":obj}).then(function(response){
           if(response.data.status=="success"){
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
           else{
                $.UIkit.notify({
                   message : response.data.msg,
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

    vm.modifyText=function(str){

        if(str.indexOf('.')!=-1){
            var res = str.split(".");
            if(res.length>1){
                if(res[0].length>5){
                    var strshortened = res[0].slice(0,5);
                    var finalStr=strshortened+' . . . .'+res[(res.length)-1];
                }
                else{
                    var finalStr=res[0]+' . . . .'+res[(res.length)-1];
                }
                return finalStr;
            }else{
                return res[0];
            }
        }
        else{
            return str;
        }
    };
    $scope.selectedVarItem={};

    $scope.enableEdit = function(item){
      $scope.selectedVarItem[item] = true;
    };

    $scope.disableEdit = function(item){
      $scope.selectedVarItem[item] = false;
    };


}];
