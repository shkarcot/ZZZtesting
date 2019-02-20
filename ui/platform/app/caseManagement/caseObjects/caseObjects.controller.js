module.exports = ['$scope','$compile','Upload','$rootScope','ngDialog','$state','$stateParams','$window','caseManagementServices','$filter','bpmnServices',
function($scope,$compile,Upload,$rootScope,ngDialog,$state,$stateParams,$window,caseManagementServices,$filter,bpmnServices) {
    'use strict';
    var vm = this;
    $rootScope.state_id = $stateParams.id;
    $rootScope.seleted_workflow_name  = $stateParams.name;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    $scope.sess_id= $scope.loginData.sess_id;
    $scope.access_token = $scope.loginData.accesstoken;

    //$scope.caseQueuesDate=[{"name":"id","datatype":"String","description":"The id of the case definition."},{"name":"key","datatype":"String","description":"The key of the case definition."},{"name":"category","datatype":"String","description":"The category of the case definition."}];
    $scope.caseQueuesDate=[];
    $scope.taggedFlagArr = [];
    $scope.taggedFlagArr1 = [];

    $scope.selectdCaseVariables=[];

    vm.readyToMoveCaseVariable=[];

    $scope.showAliasTextBox={};
    $scope.showJsonPathToolTip={};


    $scope.list = [];

      function removeDuplicates(originalArray, prop) {
         var newArray = [];
         var lookupObject  = {};

         for(var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
         }

         for(i in lookupObject) {
             newArray.push(lookupObject[i]);
         }
          return newArray;
      };


    vm.getCaseVariablesList = function(){
        caseManagementServices.getCaseVariables().then(function(response){
           if(response.data.status=="success"){
                $scope.caseQueuesDate = response.data.data;
                var solId=localStorage.getItem("solutionId");
                var obj = {"data":{},"solution_id":solId};
                obj.w_id = $rootScope.state_id;
                caseManagementServices.getCaseVariablesForWF({"sess_id":$scope.sess_id,"data":obj,'access_token':$scope.access_token}).then(function(response){
                       if(response.data.status.success){
                            vm.existingVariables = response.data.metadata.workflow.case_object;
                            $scope.selectdCaseVariables=angular.copy(vm.existingVariables);
                            angular.forEach($scope.selectdCaseVariables, function(value,key){
                                if(value.is_default){
                                    $scope.taggedFlagArr1[value.variable_id] = true;
                                }
                               // vm.hideSelecedRow(value.variable_id);
                                document.getElementById(value.path_mapping).style.display = "none";
                                //var index = $scope.caseQueuesDate.findIndex( record => record.name === value.name );
                                //$scope.caseQueuesDate.splice(index, 1);
                            });

                            for(var i=0;i<$scope.caseQueuesDate.length;i++){
                                $scope.checkalltransformed($scope.caseQueuesDate[i]);
                            }

                            console.log("caseQueuesDate===>", $scope.caseQueuesDate);

                            var uniqueArray = removeDuplicates($scope.selectdCaseVariables, "name");
                            $scope.selectdCaseVariables= uniqueArray;

                            console.log("selectdCaseVariables===>", $scope.selectdCaseVariables);
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

    vm.hideSelecedRow=function(variableId){
        angular.element("#"+variableId).hide();
    };

   $scope.isallcheck=[];
   $scope.checkalltransformed = function(item){
       if(item.attributes && item.attributes.length!=0){
            $scope.isallcheck[item.path_mapping] = false;
            for(var i=0;i<item.attributes.length;i++){
                var isavailindex = -1;
                if(item.attributes[i]&&item.attributes[i].name)
                isavailindex= $scope.selectdCaseVariables.findIndex( record => record.path_mapping === item.attributes[i].path_mapping );
                if(isavailindex > -1){
                    $scope.isallcheck[item.attributes[i].path_mapping] = true;
                }else{
                    $scope.isallcheck[item.attributes[i].path_mapping] = false;
                }

                if(item.attributes[i].attributes.length!=0){
                    $scope.checkalltransformed(item.attributes[i])
                }
            }
       }
   }

    $scope.selectCaseObject=function(caseVariables, taggedFlag){
        //alert(taggedFlag);
        if(taggedFlag==true){
            vm.readyToMoveCaseVariable.push(caseVariables);
            if(caseVariables.dimension == "Domain" || caseVariables.dimension =="Document" || caseVariables.dimension =="Entity"){
                var co=angular.copy(caseVariables);
                vm.flattedCaseObject = [];
                vm.hierarchyToFlat(co,taggedFlag);
                console.log(vm.flattedCaseObject);
                angular.forEach(vm.flattedCaseObject, function(coObj,key1){
                    $scope.taggedFlagArr[coObj.variable_id] = true;
                });
            }
        }
        else if(taggedFlag==false){
            var co=angular.copy(caseVariables);
            vm.flattedCaseObject = [];
            vm.hierarchyToFlat(co,taggedFlag);
            console.log(vm.flattedCaseObject);
            angular.forEach(vm.flattedCaseObject, function(coObj,key1){
                $scope.taggedFlagArr[coObj.variable_id] = false;
                var index = vm.readyToMoveCaseVariable.findIndex( record => record.name === coObj.name );
                vm.readyToMoveCaseVariable.splice(index, 1);
            });
        };
    };

    vm.flatCaseObjects = function(listObj){
       var arrObj={};
       arrObj['dimension']=listObj.dimension;
       arrObj['is_default']=listObj.is_default;
       arrObj['name']=listObj.name;
       arrObj['opened']=listObj.opened;
       arrObj['path_mapping']=listObj.path_mapping;
       arrObj['selected']=listObj.selected;
       arrObj['type']=listObj.type;
       arrObj['variable_id']=listObj.variable_id;
       var aliasStr = listObj.path_mapping;
       var changedAlias = aliasStr.replace(/\./g,'_')
       arrObj['alias']=changedAlias;
       document.getElementById(listObj.path_mapping).style.display = "none";

       var isavailindex = $scope.selectdCaseVariables.findIndex( record => record.name === listObj.name );
       if(isavailindex==-1 && (listObj.attributes==null || listObj.attributes.length==0)){
        vm.flatSelectedCaseObject.push(arrObj);
       }

       if(listObj.attributes != null){
           if(listObj.attributes.length != 0){
               for(var i=0;i<listObj.attributes.length;i++){
                   vm.flatCaseObjects(listObj.attributes[i]);
               }
           }
       }
    };

    vm.hierarchyToFlat = function(listObj,flag){
       if(listObj.attributes==null || listObj.attributes.length==0){
            vm.flattedCaseObject.push(listObj);
       }

       if(listObj.attributes != null){
           if(listObj.attributes.length != 0){
               for(var i=0;i<listObj.attributes.length;i++){
                   $scope.taggedFlagArr[listObj.variable_id] = flag;
                   vm.hierarchyToFlat(listObj.attributes[i],flag);
               }
           }
       }
    };

    $scope.leftToRight = function(){
        if(vm.readyToMoveCaseVariable.length>0){
            $scope.taggedFlagArr = [];
            angular.forEach(vm.readyToMoveCaseVariable, function(value,key){
                if(value.dimension == "Domain" || value.dimension =="Document" || value.dimension =="Entity"){
                    var co=angular.copy(value);
                    vm.flatSelectedCaseObject = [];
                    vm.flatCaseObjects(co);
                    console.log(vm.flatSelectedCaseObject);
                    angular.forEach(vm.flatSelectedCaseObject, function(coObj,key1){
                        $scope.selectdCaseVariables.unshift(coObj);
                    });
                }else{
                    var co=angular.copy(value);
                    co['alias']=co.path_mapping;
                    $scope.selectdCaseVariables.unshift(co);
                    var index = $scope.caseQueuesDate.findIndex( record => record.name === value.name );
                    $scope.caseQueuesDate.splice(index, 1);
                }
            });
            vm.readyToMoveCaseVariable=[];

            console.log("vm.readyToMoveCaseVariable=>", vm.readyToMoveCaseVariable);
        }
    };
    function findIndexByValue(array, nameWeAreLookingFor) {
        for(var i = 0; i<array.length; i++) {
            if(array[i].name === nameWeAreLookingFor) return i;
        }
        return -1;
    };

    vm.readyToMoveCaseVariableFromLeftPannel=[];
    $scope.selectCaseObjectRtoL = function(caseVariablesFromLeft, flag){
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

    $scope.getPath = function(item){
        return item.split(".");
    }

    $scope.showparentelements = function(currentcount,keys){
        var elementid = "";
        for(var i=0;i<currentcount;i++){
            elementid= elementid + keys[i]+".";
        }
        elementid = elementid.substring(0, elementid.length - 1);
        document.getElementById(elementid).style.display = "table-row";
        $scope.isallcheck[elementid] = false;

        vm.currentcount = vm.currentcount + 1;
        if(vm.currentcount <= keys.length){
            $scope.showparentelements(vm.currentcount,keys);
        }
    }
    $scope.rightToLeft = function(){
        if(vm.readyToMoveCaseVariableFromLeftPannel.length>0){
            angular.forEach(vm.readyToMoveCaseVariableFromLeftPannel, function(value,key){
                // $scope.caseQueuesDate.push(value);
                document.getElementById(value.path_mapping).style.display = "table-row";
                var keys= value.path_mapping.split(".");
                vm.dynamiccount= keys.length;
                vm.currentcount = 1;
                $scope.showparentelements(vm.currentcount,keys);

                var index = $scope.selectdCaseVariables.findIndex( record => record.name === value.name );
                $scope.selectdCaseVariables.splice(index, 1);
            });

            $scope.taggedFlagArr1 = [];
            angular.forEach($scope.selectdCaseVariables, function(value,key){
                    if(value.is_default)
                        $scope.taggedFlagArr1[value.variable_id] = true;
            });
            vm.readyToMoveCaseVariableFromLeftPannel=[];
            // console.log("vm.readyToMoveCaseVariableFromLeftPannel=>", vm.readyToMoveCaseVariableFromLeftPannel);
        }
    };

    $scope.saveCaseObjects = function(){
        var obj={};
            obj.workflow_id = $rootScope.state_id;
            var selObj=angular.copy($scope.selectdCaseVariables);
            angular.forEach(selObj, function(value,key){
                //if(!value.is_default){
                    delete selObj[key].opened;
                    delete selObj[key].selected;
               // }
                /*if(value.dimension == "Domain"){
                    if(value.name==value.alias){
                    }
                }*/
            });
            var valueArr = selObj.map(function(item){ return item.alias });
            var isDuplicate = valueArr.some(function(item, idx){
                return valueArr.indexOf(item) != idx
            });
            obj.case_object = selObj;
           var solId=localStorage.getItem("solutionId");
           if(solId==null){
               bpmnServices.getSolnId().then(function(data){
                  localStorage.setItem("solutionId",data.data.solution_id);
                  solId=data.data.solution_id;
                });
           }
           var reqData = {"data": obj, "solution_id": solId};
           if(!isDuplicate){
                caseManagementServices.saveCaseVariables({"sess_id":$scope.sess_id,"data":reqData,'access_token':$scope.access_token}).then(function(response){
                   if(response.data.status.success){
                        $.UIkit.notify({
                           message : response.data.status.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                       });
                       $window.scrollTo(0, 0);

                       vm.getCaseVariablesList();
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
           }
           else{
                $.UIkit.notify({
                   message : 'Duplicate alias names exists',
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
           }
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

     $scope.toggleAllCheckboxes = function($event) {
        var i,    item,    len,    ref,    results,    selected;
        selected = $event.target.checked;
        ref = $scope.list;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          item.selected = selected;
          if (item.attributes != null) {
            results.push($scope.$broadcast('changeChildren',    item));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      $scope.initCheckbox = function(item,    parentItem) {
        return item.selected = parentItem && parentItem.selected || item.selected || false;
      };
      $scope.toggleCheckbox = function(item,    parentScope) {
        if (item.attributes != null) {
          $scope.$broadcast('changeChildren',    item);
        }
        if (parentScope.item != null) {
          return $scope.$emit('changeParent',    parentScope);
        }
      };
      $scope.$on('changeChildren',    function(event,    parentItem) {
        var child,   i,    len,    ref,    results;
        ref = parentItem.attributes;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          child.selected = parentItem.selected;
          if (child.attributes != null) {
            results.push($scope.$broadcast('changeChildren',    child));
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
      return $scope.$on('changeParent',    function(event,    parentScope) {
        var children;
        children = parentScope.item.attributes;
        parentScope.item.selected = $filter('selected')(children).length === children.length;
        parentScope = parentScope.$parent.$parent;
        if (parentScope.item != null) {
          return $scope.$broadcast('changeParent',    parentScope);
        }
      });





}];
