'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.markerForm')
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
  .controller('postProcessingRulesCtrl', function ($scope,$state,$rootScope,$location,$stateParams,entitiesService,documentService,ngDialog) {
      var vm = this;
      vm.setObj = function(){
          vm.transformRule = {};
          vm.transformRule.rule_name = '';
          vm.transformRule.desc = '';
          vm.transformRule.rule  = {};
          vm.transformRule.rule_type  = "T";
          vm.transformRule.rule.op  = '';
          vm.transformRule.rule.sep  = '';
          vm.transformRule.rule.lval = [];
          vm.transformRule.rule.doc_variable = '';
          vm.transformRule.rule.is_split = 'assign';
          vm.transformRule.rule.actions = [];
//          vm.transformRule.rule.conds = [{"op":"", "rval": "","fn":""}];
          vm.actionObj = {};
          vm.actionObj.act = "set";
          vm.actionObj.rule_val = "";
          vm.actionObj.attr = {};
      };

      vm.setObj();
      vm.validateTransRule = "";
      vm.validateTransRuleInGet = [];

      vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= vm.loginData.sess_id;

     $scope.addTransformation = function(){
        $scope.showTransformation = true;
     }

     vm.getRulesConfig = function(){
        documentService.getRuleConfig(vm.sess_id).then(function(resp){
             if(resp.data.status == "success"){
                vm.functionsList = resp.data.config.functions;
                vm.listOfOperators = resp.data.config.operators;
             }
             else{
                $.UIkit.notify({
                     message : resp.data.msg,
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                });
             }
        },function(err){
             console.log(err)
             $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
             });
        });
    };

    vm.getRulesConfig();

     vm.addParameters = function(){
        if(vm.transformRule.rule.op == "split"){
            if(vm.transformRule.rule.doc_variable != ""){
                if(vm.transformRule.rule.lval.length>1){
                    vm.transformRule.rule.lval = [];
                }
                else if(vm.transformRule.rule.lval.length == 0){
                    vm.transformRule.rule.lval.push(vm.transformRule.rule.doc_variable);
                }
                else{
                    vm.errorMsg = 'Split operator allows only one variable';
                }
            }
            else{
                vm.errorMsg = 'Add a variable';
            }
        }
        else{
            if(vm.transformRule.rule.doc_variable == ""){
                vm.errorMsg = 'Add a variable';
            }
            else if(vm.transformRule.rule.lval.indexOf(vm.transformRule.rule.doc_variable) == -1){
                vm.transformRule.rule.lval.push(vm.transformRule.rule.doc_variable);
                vm.transformRule.rule.doc_variable = '';
                vm.errorMsg = '';
            }
            else{
                vm.errorMsg = 'This variable is already added';
            }
        }
     }
     vm.removeVariable = function(index){
        vm.transformRule.rule.lval.splice(index,1);
        vm.errorMsg = '';
     }

     vm.removeVariableInGet = function(list,index){
        list.rule.actions[0].attr.lval.splice(index,1);
        vm.errorMsginGet = [];
     }
     vm.operatorsList = [
        {
          "condition" : "join",
          "display_name": "Join",
          "desc": "",
          "supports": ["T"]
        },
        {
          "condition" : "split",
          "display_name": "Split",
          "desc": "",
          "supports": ["T"]
        },

        {
          "condition" : "split",
          "display_name": "Split",
          "desc": "",
          "supports": ["F"]
        }
     ];
     vm.operateSupports = [];

     angular.forEach(vm.operatorsList,function(value,key){
        if(value.supports.indexOf("T") != -1){
            vm.operateSupports.push(value);
        }

     })
     console.log(vm.operateSupports);

     vm.separatorsList = {
        "Comma" : ",",
        "Space" : " ",
        "Dot" : ".",
        "Dollar" : "$"
     }



     $scope.$on('entitiesList', function(event, data) {
        $scope.entitiesList = data.data;
        $scope.entitiesObj =  $scope.entitiesList;
        vm.getTransformation();
     });
     $scope.listOfAttributes=[];
     vm.getAttribute = function(name,index){
          if(index != 'norm'){
                $scope.listOfAttributes[index] = $scope.entitiesObj[name];
          }
          else{
                $scope.listOfAttribut = $scope.entitiesObj[name];
          }
     };

     $rootScope.getVariables = function(){
         //write getVariable api
         vm.getTransformation();
     };

     vm.changeOperator = function(val){
        vm.actionObj.act = "set";
        vm.actionObj.rule_val = '';
        if(val == 'split'){
           vm.actionObj.act = "set_assign";
           vm.actionObj.rule_val = [];
           if(vm.transformRule.rule.lval.length>1){
                vm.transformRule.rule.lval = [];
           }
        }

     };

     vm.changeOperatorInGet = function(val,list){
        if(val == "split"){
            list.rule.is_split = "assign";
            list.rule.actions[0].attr.rule_val = [];
            if(list.rule.actions[0].attr.lval.length>1){
                list.rule.actions[0].attr.lval = [];
            }
        }
     };

     vm.changeSet = function(val){
        vm.actionObj.act = "set_assign";
        vm.actionObj.rule_val = [];
        if(val == 'foreach'){
          vm.actionObj.act = "set_foreach";
          vm.actionObj.rule_val = '';
        }
     };

     vm.changeSetInGet = function(val,list){
        list.rule.actions[0].act = "setAssign";
        list.rule.actions[0].attr.rule_val = [];
        if(val == 'foreach'){
          list.rule.actions[0].act = "setForEach";
          list.rule.actions[0].attr.rule_val = '';
        }
     };

     vm.addRvalue = function(){
        vm.actionObj.rule_val.push({'arrayIndex':'','entity':'','attribute':''})
     };

     vm.removeRval = function(index){
        vm.actionObj.rule_val.splice(index,1)
     };

     vm.checkForValidationRule = function(ruleObj){
        if(ruleObj.rule.op != "" && ruleObj.rule.op != undefined){
            if(ruleObj.rule.sep != "" && ruleObj.rule.sep != undefined){
                if(ruleObj.rule.lval.length>0){
                    if(ruleObj.rule.op == 'split' && vm.actionObj.act == 'set_assign'){
                        return "";
                    }
                    else{
                        if(vm.actionObj.entity != "" && vm.actionObj.attribute){
                            return "";
                        }
                        else{
                            return "Please select the entity and attribute first";
                        }
                    }
                }
                else{
                    return "please select the document variables";
                }
            }
            else{
               return "Please select the seperator";
            }
        }
        else{
           return "Please select the operator";
        }
     };

     vm.convertRuleObjInCreate = function(){
        vm.validateTransRule = "";
        var listBackUp = angular.copy(vm.transformRule);
        var actionObjDup = angular.copy(vm.actionObj);
        if(listBackUp.rule.op == 'split' && actionObjDup.act == 'set_assign'){
            if(actionObjDup.rule_val.length>0){
                 actionObjDup.attr.rval = [];
                 actionObjDup.attr.rval = {};
                 for(var i=0;i<actionObjDup.rule_val.length;i++){
                     var val = actionObjDup.rule_val[i].entity+"."+actionObjDup.rule_val[i].attribute
                     actionObjDup.attr.rval[i] = val;
                 }
            }
        }
        else{
            actionObjDup.attr.rval =  actionObjDup.entity +'.'+ actionObjDup.attribute;
        }
        delete actionObjDup['rule_val'];
        delete  listBackUp.rule['doc_variable'];
        listBackUp.rule.actions.push(actionObjDup);
        listBackUp.rule.actions[0].act = angular.copy(listBackUp.rule.op);
        listBackUp.rule.actions[0].op = angular.copy(listBackUp.rule.op);
        if(listBackUp.rule.op == 'split'){
            listBackUp.rule.actions[0].attr.lval = angular.copy(listBackUp.rule.lval[0]);
        }
        else{
            listBackUp.rule.actions[0].attr.lval = angular.copy(listBackUp.rule.lval);
        }
        listBackUp.rule.actions[0].attr.sep = angular.copy(listBackUp.rule.sep);
        delete listBackUp.rule["sep"];
        delete listBackUp.rule["lval"];
        delete listBackUp.rule.actions[0].entity;
        delete listBackUp.rule.actions[0].attribute;
        if(listBackUp.rule.is_split == "assign"){
            listBackUp.rule.actions[0].act = "splitAssign";
        }
        if(listBackUp.rule.is_split == "foreach"){
            listBackUp.rule.actions[0].act = "splitForEach";
        }
        if(listBackUp.rule["op"] == 'join'){
            listBackUp.rule.actions[0].act = angular.copy(listBackUp.rule["op"]);
        }
        delete listBackUp.rule["op"];
        delete  listBackUp.rule['is_split'];
        return listBackUp;
     };

     vm.saveTransformation = function(){
        var msg = vm.checkForValidationRule(vm.transformRule);
        vm.validateTransRule = msg;
        if(msg == ""){
            var returnObj = vm.convertRuleObjInCreate();
            var sendObj = angular.copy(returnObj);
            var id = $stateParams.id;
            $scope.showTransSave = true;
            documentService.saveTransformationRule(vm.sess_id,{"template_id":id,'rule':sendObj}).then(function(resp){
                       if(resp.data.status == "success"){
                           $.UIkit.notify({
                                   message : resp.data.msg,
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                           });
                           $scope.showTransSave = false;
                           $scope.showTransformation = false;
                           vm.getTransformation();
                           vm.setObj();

                       }
                       else{
                           $scope.showTransSave = false;
                           $.UIkit.notify({
                                   message : resp.data.msg,
                                   status  : 'danger',
                                   timeout : 3000,
                                   pos     : 'top-center'
                           });
                       }

            },function(err){
                 console.log(err)
                 $scope.showTransSave = false;
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
            });
        }
     };


     //get transformation rule

     vm.setTransformationRules = function(){
         angular.forEach(vm.listOfTransformationRules,function(value,key){
              value.rule.doc_variable = '';
              var is_split = value.rule.actions[0].act;
              if(is_split == "splitAssign" || is_split == "splitForEach"){
                var lval = value.rule.actions[0].attr.lval;
                value.rule.actions[0].attr.lval = [];
                value.rule.actions[0].attr.lval[0] = angular.copy(lval);
                if(value.rule.actions[0].op == 'split' && (typeof value.rule.actions[0].attr.rval == "object")){
                    value.rule.is_split = 'assign';
                    value.rule.actions[0].attr.rule_val = [];
                    angular.forEach(value.rule.actions[0].attr.rval,function(value1,key){
                            var obj = {};
                            var str = value1;
                            var strLength = str.length;
                            var split = str.split('.');
                            var attrLength = split[split.length-1].length;
                            var finalStr =  strLength-attrLength-1;
                            var res = str.substring(finalStr,0);
                            obj.entity = res;
                            obj.attribute = split[split.length-1];
                            obj.arrayIndex=''
                            value.rule.actions[0].attr.rule_val.push(obj)
                    })

                }
                else{
                    value.rule.is_split = 'foreach';
                    var str = value.rule.actions[0].attr.rval;
                    var strLength = str.length;
                    var split = str.split('.');
                    var attrLength = split[split.length-1].length;
                    var finalStr =  strLength-attrLength-1;
                    var res = str.substring(finalStr,0);
                    value.rule.actions[0].attr.entity = res;
                    value.rule.actions[0].attr.attribute = split[split.length-1];
                }
              }
              else{
                    value.rule.is_split = 'set';
                    var str = value.rule.actions[0].attr.rval;
                    var strLength = str.length;
                    var split = str.split('.');
                    var attrLength = split[split.length-1].length;
                    var finalStr =  strLength-attrLength-1;
                    var res = str.substring(finalStr,0);
                    value.rule.actions[0].attr.entity = res;
                    value.rule.actions[0].attr.attribute = split[split.length-1];
              }

        })
     };

     vm.getTransformation = function(){
       var id = $stateParams.id;
       documentService.getTransformationRule({"sess_id":vm.sess_id,"template_id":id}).then(function(resp){
                   if(resp.data.status == "success"){
                       vm.setObj();
                       vm.listOfTransformationRules = resp.data.data.rules;
                       vm.document_variables_list = resp.data.doc_variables;
                       vm.setTransformationRules();
                   }
                   else{
                       $.UIkit.notify({
                               message : resp.data.msg,
                               status  : 'danger',
                               timeout : 3000,
                               pos     : 'top-center'
                       });
                   }

       },function(err){
             console.log(err)
             $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
             });
       });

     };

     vm.checkForValidationRuleInGet = function(ruleObj){
        if(ruleObj.rule.actions[0].op != "" && ruleObj.rule.actions[0].op != undefined){
            if(ruleObj.rule.actions[0].attr.sep != "" && ruleObj.rule.actions[0].attr.sep != undefined){
                if(ruleObj.rule.actions[0].attr.lval.length>0){
                    if(ruleObj.rule.actions[0].op == 'split' && ruleObj.rule.actions[0].act == 'splitAssign'){
                        return "";
                    }
                    else{
                        if(ruleObj.rule.actions[0].attr.entity != "" && ruleObj.rule.actions[0].attr.attribute){
                            return "";
                        }
                        else{
                            return "Please select the entity and attribute first";
                        }
                    }
                }
                else{
                    return "please select the document variables";
                }
            }
            else{
               return "Please select the seperator";
            }
        }
        else{
           return "Please select the operator";
        }
     };

     vm.convertRuleObjInEdit = function(list,index){
        vm.validateTransRuleInGet = [];
        var listBackUp = angular.copy(list);
        if(listBackUp.rule.actions[0].op == 'split' && listBackUp.rule.is_split == 'assign'){
            if(listBackUp.rule.actions[0].attr.rule_val.length>0){
                 listBackUp.rule.actions[0].attr.rval = {};
                 listBackUp.rule.actions[0].attr.rval = {};
                 for(var i=0;i<listBackUp.rule.actions[0].attr.rule_val.length;i++){
                     var val = listBackUp.rule.actions[0].attr.rule_val[i].entity+"."+listBackUp.rule.actions[0].attr.rule_val[i].attribute;
                     listBackUp.rule.actions[0].attr.rval[i] = val;
                 }
            }
        }
        else{
            listBackUp.rule.actions[0].attr.rval =  listBackUp.rule.actions[0].attr.entity +'.'+ listBackUp.rule.actions[0].attr.attribute;
        }
        listBackUp.rule.actions[0].act = angular.copy(listBackUp.rule.actions[0].op);
        if(listBackUp.rule.is_split == 'assign'){
            listBackUp.rule.actions[0].act = "splitAssign";
        }
        if(listBackUp.rule.is_split == 'foreach'){
            listBackUp.rule.actions[0].act = "splitForEach";
        }
        if(listBackUp.rule.actions[0].op == 'split'){
            listBackUp.rule.actions[0].attr.lval = listBackUp.rule.actions[0].attr.lval[0];
        }
        if(listBackUp.rule.actions[0].op == 'join'){
            listBackUp.rule.actions[0].act = angular.copy(listBackUp.rule.actions[0].op);
        }
        delete listBackUp.rule.actions[0].attr['entity'];
        delete listBackUp.rule.actions[0].attr['attribute'];
        delete listBackUp.rule.actions[0].attr['rule_val'];
        delete listBackUp.rule['doc_variable'];
        delete listBackUp.rule['is_split'];
        return listBackUp;
     };

     vm.saveTransformationInGet = function(list,index){
        var msg = vm.checkForValidationRuleInGet(list);
        vm.validateTransRuleInGet[index] = msg;
        if(msg == ""){
            var returnObj = vm.convertRuleObjInEdit(list,index);
            var sendObj = angular.copy(returnObj);
            var id = $stateParams.id;
            $scope.showTransSaveInGet = [];
            $scope.showTransSaveInGet[index] = true;
            documentService.saveTransformationRule(vm.sess_id,{"template_id":id,'rule':sendObj}).then(function(resp){
                       if(resp.data.status == "success"){
                           $.UIkit.notify({
                                   message : resp.data.msg,
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                           });
                           vm.errorMsg = "";
                           $scope.showTransSaveInGet = [];
                           vm.errorMsginGet = [];
                           vm.getTransformation();
                           vm.setObj();

                       }
                       else{
                           $scope.showTransSaveInGet = [];
                           $.UIkit.notify({
                                   message : resp.data.msg,
                                   status  : 'danger',
                                   timeout : 3000,
                                   pos     : 'top-center'
                           });
                       }

            },function(err){
                 console.log(err)
                 $scope.showTransSaveInGet = [];
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
            });
        }
     };

     vm.addParametersInGet = function(list,i){
        if(list.rule.actions[0].op == "split"){
            if(list.rule.doc_variable != ""){
                if(list.rule.actions[0].attr.lval.length>1){
                    list.rule.actions[0].attr.lval = [];
                }
                else if(list.rule.actions[0].attr.lval.length == 0){
                    list.rule.actions[0].attr.lval.push(list.rule.doc_variable);
                }
                else{
                    vm.errorMsginGet = [];
                    vm.errorMsginGet[i] = 'Split operator allows only one variable';
                }
            }
            else{
                vm.errorMsginGet = [];
                vm.errorMsginGet[i] = 'Add a variable';
            }
        }
        else{
            if(list.rule.doc_variable == ""){
                vm.errorMsginGet = [];
                vm.errorMsginGet[i] = 'Add a variable';
            }
            else if(list.rule.actions[0].attr.lval.indexOf(list.rule.doc_variable) == -1){
                list.rule.actions[0].attr.lval.push(list.rule.doc_variable);
                list.rule.doc_variable = '';
                vm.errorMsginGet = [];
            }
            else{
                vm.errorMsginGet[i] = 'This variable is already added';
            }
        }
     };

     vm.addRvalueInGet = function(list){
        list.rule.actions[0].attr.rule_val.push({'arrayIndex':'','entity':'','attribute':''})
     };

     vm.removeRvalInGet = function(list,index){
        if(list.rule.actions[0].attr.rule_val.length > 1){
            list.rule.actions[0].attr.rule_val.splice(index,1);
        }
     };

     vm.deleteRuleFunc = function(ruleId){
        var id = $stateParams.id;
        documentService.deleteTransformationRule(vm.sess_id,{"template_id":id,'rule_id':ruleId}).then(function(resp){
           if(resp.data.status == "success"){
               $.UIkit.notify({
                       message : resp.data.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
               });
               vm.errorMsg = "";
               $scope.showTransSaveInGet = [];
               vm.errorMsginGet = [];
               vm.getTransformation();
               vm.setObj();
           }
           else{
               $scope.showTransSaveInGet = [];
               $.UIkit.notify({
                       message : resp.data.msg,
                       status  : 'danger',
                       timeout : 3000,
                       pos     : 'top-center'
               });
           }
        },function(err){
             console.log(err)
             $scope.showTransSaveInGet = [];
             $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
             });
        });
     };

     vm.deleteRule = function(ruleId){
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete this rule ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.deleteRuleFunc(ruleId);
              };
          }]
        });
     };
     $scope.sourceValues = [];
     vm.testPostRule = function(obj,parent){
        var msg = vm.checkForValidationRuleInGet(obj);
        vm.validateTransRuleInGet[parent] = msg;
        if(msg == ""){
            var convertedObj = vm.convertRuleObjInEdit(obj,parent);
            var source = {};
            var id = $stateParams.id;
            for(var i=0;i<obj.rule.actions[0].attr.lval.length;i++){
                source[obj.rule.actions[0].attr.lval[i]] = $scope.sourceValuesInEdit[parent][i];
            }

            documentService.testTransformationRule(vm.sess_id,{"template_id":id,"source": source, 'rule': convertedObj}).then(function(resp){
                   if(resp.data.status == "success"){
                       vm.testTransformResult[parent] = resp.data.result.result;
                   }
                   else{
                       $.UIkit.notify({
                               message : resp.data.msg,
                               status  : 'danger',
                               timeout : 3000,
                               pos     : 'top-center'
                       });
                       vm.testTransformResult = [];
                   }

            },function(err){
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
                 vm.testTransformResult = [];
            });
        }
     };

     vm.testPostRuleBeforeCreate = function(createRuleObj){
        var msg = vm.checkForValidationRule(createRuleObj);
        vm.validateTransRule = msg;
        if(msg == ""){
            var convertedObj = vm.convertRuleObjInCreate();
            var source = {};
            var id = $stateParams.id;
            for(var i=0;i<createRuleObj.rule.lval.length;i++){
                source[createRuleObj.rule.lval[i]] = $scope.sourceValues[i];
            }
            documentService.testTransformationRule(vm.sess_id,{"template_id":id,"source": source, 'rule': convertedObj}).then(function(resp){
                   if(resp.data.status == "success"){

                   }
                   else{
                       $.UIkit.notify({
                               message : resp.data.msg,
                               status  : 'danger',
                               timeout : 3000,
                               pos     : 'top-center'
                       });
                   }

            },function(err){
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
            });
        }
     };

     $scope.clearSourceTest = function(){
        $scope.sourceValues = [];
        $scope.sourceValuesInEdit = [];
        vm.testTransformResult = [];
     };

     vm.selectOperator = function(type){
        vm.transformRule.run_type = type;
        vm.addCondition();
     };

     vm.addCondition = function(){
        var len = vm.transformRule.rule.conds.length;
        if(vm.transformRule.rule.conds[len-1].op != ""){
            if(vm.transformRule.rule.conds[len-1].rval != ""){
                vm.transformRule.rule.conds.push({"op":"", "rval": "","fn":""});
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

     vm.delCond = function(index){
         vm.transformRule.rule.conds.splice(index,1);
     };

  });
