module.exports = ['$scope', '$state', '$rootScope', '$location', 'getTemplates', 'entitiesList','config', function($scope, $state, $rootScope, $location, getTemplates, entitiesList,config) {
	'use strict';
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      var url = $location.path();
      var arr = url.split("/");
      $rootScope.currentState = arr[arr.length-1];
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.showEditIcons={};
      $scope.blinkingRow={};
      $scope.hideAndCollapse = "fa-minus";
      $(".collapseOne").collapse('show');
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $scope.contents =  entitiesList.data.domain_object;
      $scope.entitiesList = [];
      $scope.activebgClass = [];
      $scope.templateName = "";
      $scope.activebgClass[0] = "bgActive";
      angular.forEach($scope.contents,function(value,index){
        $scope.entitiesList.push(value.entity_name);
      });
      vm.getTemplates = [];
      $scope.clsBlue=[];
      vm.viewSourceTemplateData = {};

      $scope.viewTemplate = false;
      $scope.editTemplate = false;
      $scope.addTemplate = false;

      $scope.expandPlus =function(){
        if($scope.hideAndCollapse=="fa-minus")
          $scope.hideAndCollapse="fa-plus";
        else
          $scope.hideAndCollapse="fa-minus";
      };

      //Tempates code

      vm.allTemplates = getTemplates.data;
      console.log(vm.allTemplates);
      if(vm.allTemplates.length == 0){
        $scope.hideAndCollapse="fa-minus";
      }

      for(var i=0;i<getTemplates.data.length;i++){
         vm.getTemplates[i] = {};
      }

      vm.getTemplates[0] = getTemplates.data[0];
      vm.viewSourceTemplateData=getTemplates.data[0];
      $scope.viewTemplate = true;

      $scope.viewSourceTemplate = function(index){
        $scope.addTemplate = false;
        $scope.viewTemplate = true;
        $scope.editTemplate = false;
        $scope.clsBlue=[];
        vm.viewSourceTemplateData = {};
        vm.viewSourceTemplateData=vm.allTemplates[index];
        $scope.activebgClass=[];
        $scope.activebgClass[index] = "bgActive";
      };

      $scope.removeBlinking=function(){
       angular.forEach($scope.blinkingRow,function(value,index){
         $scope.blinkingRow[index]="";
       });
      };

      $scope.totalRows = [{"key":"","value":"","is_upsert":false}];

      $scope.isEmpty = function(obj) {
        if(obj == undefined){
          return false;
        }
        else{
            if(Object.keys(obj).length == 1){
               return true;
            }
            else{
               return false;
            }
        }
      };
      $scope.addNewSourceTemplate=function(){
        $scope.clsBlue=[];
        $scope.activebgClass= [];
        vm.viewSourceTemplateData = {};
      };


      $scope.editSourceTemplate = function(index){
        $scope.clsBlue=[];
        $scope.clsBlue[index]="cls-blue";
        $scope.templateValidateMsg="";
        vm.editSTObj = [];
        $scope.viewTemplate = false;
        $scope.editTemplate = true;
        $scope.addTemplate = false;
        vm.viewSourceTemplateData = {};
        var currentTemplate =[];
        vm.viewSourceTemplateData = vm.allTemplates[index];
        angular.forEach(vm.viewSourceTemplateData.template,function(value,key){
          vm.editSTObj.push({"key":key,"path":value.path,"is_upsert":value.is_upsert});
        });

        vm.editSTObj.push({"key":"","path":"","is_upsert":false});

        $scope.activebgClass=[];
        $scope.activebgClass[index] = "bgActive";
      };

      $scope.editSourceTemplateFromView = function(index){
        $scope.clsBlue=[];
        $scope.clsBlue[index]="cls-blue";
        $scope.templateValidateMsg="";
        vm.editSTObj = [];
        $scope.viewTemplate = false;
        $scope.editTemplate = true;
        $scope.addTemplate = false;
        vm.viewSourceTemplateData = {};
        var currentTemplate =[];
        vm.viewSourceTemplateData = vm.allTemplates[index];
        angular.forEach(vm.viewSourceTemplateData.template,function(value,key){
          vm.editSTObj.push({"key":key,"path":value.path,"is_upsert":value.is_upsert});
        });

        vm.editSTObj.push({"key":"","path":"","is_upsert":false});

        $scope.activebgClass=[];
        $scope.activebgClass[index] = "bgActive";
        $('#sourceViewModal'+index).modal('hide');
        setTimeout(function(){
          $('#sourceeditmodal'+index).modal('show');
        }, 500);
        $(".modal-backdrop").remove();
      };

      $scope.addRow1 = function(){
        var flag = false;
        $scope.templateValidateMsg = "";
         for(var i=0;i<vm.editSTObj.length;i++){
         if(vm.editSTObj[i].key != "" && vm.editSTObj[i].path != ""){
            flag = true;
          }
          else{
            flag = false;
            $scope.templateValidateMsg = "Please fill the above fields";
            break;
          }
        }
        if(flag){
           vm.editSTObj.push({"key":"","path":"", "is_upsert":false});
        }
      };

       $scope.cancelTemplate =function(templatename){
          vm.reloadTemplate(templatename,"update","");
       };

      $scope.updateTemplate =function(idx){
        console.log(vm.editSTObj);
        $scope.templateNameError = "";
         var flag = false;
         for(var i=0;i<vm.editSTObj.length;i++){
             if(vm.editSTObj[i].key != "" && vm.editSTObj[i].path != ""){
                flag = false;
                break;
             }
             else{
                flag = true;
             }
          }
          if(flag){
             $scope.templateValidateMsg = "Atleast one entity and value must be selected";
          }
          else{
              var temp={};
              angular.forEach(vm.editSTObj,function(value,key){
                if(value.key != '' && value.value !=''){
                    temp[value.key] ={'path':value.path,"is_upsert":value.is_upsert};
                }
              });
              console.log(temp);
              vm.viewSourceTemplateData.template=temp;
              console.log(vm.viewSourceTemplateData);
              $scope.updateLoading = true;
              sourceTemplateService.saveTemplate({'obj':vm.viewSourceTemplateData,'sess_id':vm.sess_id}).then(function(data){
              if(data.data.status=='success'){
                 $.UIkit.notify({
                           message : "Source Template '"+vm.viewSourceTemplateData.template_name+"' updated.",
                           status  : 'success',
                           timeout : 2000,
                           pos     : 'top-center'
                 });
                 $scope.updateLoading = false;
                 $('#sourceeditmodal'+idx).modal('toggle');
                 $(".modal-backdrop").remove();
                 vm.reloadTemplate(vm.viewSourceTemplateData.template_name,"update",vm.viewSourceTemplateData._id);
              }
              else
                 console.log(data.data.msg);
            });
          }
      };

      vm.reloadTemplate = function(value,event,id){
        sourceTemplateService.getTemplates({'sess_id':vm.sess_id}).then(function(data){
            vm.allTemplates = data.data;
            if(vm.allTemplates.length == 0){
              $scope.hideAndCollapse="fa-minus";
            }
            var currentIndex=0;
            for(var i=0;i<data.data.length;i++){
               vm.getTemplates[i] = {};
               $scope.activebgClass[i] = "";
               if(data.data[i].template_name==value)
                currentIndex=i;
            }

            if(event=="save"){
              $scope.activebgClass[currentIndex] = "bgActive";
              vm.viewSourceTemplateData = data.data[currentIndex];
              $scope.viewSourceTemplate(currentIndex);
              $scope.blinkingRow[vm.allTemplates[0]._id]="blinking";
              $timeout($scope.removeBlinking, 3000);
            }
            else if(event=="delete"){
              $scope.activebgClass[0] = "bgActive";
              vm.viewSourceTemplateData = data.data[0];
            }
            else if(event=="update"){
              $scope.activebgClass[currentIndex] = "bgActive";
              vm.viewSourceTemplateData = data.data[currentIndex];
              $scope.viewSourceTemplate(currentIndex);
              $scope.blinkingRow[id]="blinking";
              $timeout($scope.removeBlinking, 3000);
            }
            else{
              $scope.activebgClass[currentIndex] = "bgActive";
              vm.viewSourceTemplateData = data.data[currentIndex];
            }
        });

      };

      $scope.clearTemplateCard = function(){
        $scope.addTemplate=false;
        $scope.templateName='';
        $scope.templateNameError = "";
        $scope.templateValidateMsg = "";
        $scope.templateNameRepeat = "";
        $scope.totalRows = [{"key":"","value":"","is_upsert":false}];
      };

      $scope.addRow = function(){
        var flag = false;
        $scope.templateValidateMsg = "";
        for(var i=0;i<$scope.totalRows.length;i++){
           if($scope.totalRows[i].key != "" && $scope.totalRows[i].value != ""){
              flag = true;
           }
           else{
              flag = false;
              $scope.templateValidateMsg = "Please fill the above fields";
              break;
           }
        }
        if(flag){
           $scope.totalRows.push({"key":"","value":"", "is_overide":false});
        }
      };

      $scope.submitTemplate = function(){
        var flag = false;
        if($scope.templateName != ""){
           var templateflag=true;
           angular.forEach(vm.allTemplates,function(value,index){
              if(value.template_name.toLowerCase() == $scope.templateName.toLowerCase()){
                templateflag = false;
              }
           });
           if(templateflag){
             $scope.templateNameError = "";
             for(var i=0;i<$scope.totalRows.length;i++){
                 if($scope.totalRows[i].key != "" && $scope.totalRows[i].value != ""){
                    flag = false;
                    break;
                 }
                 else{
                    flag = true;
                 }
              }
              if(flag){
                 $scope.templateValidateMsg = "Atleast one entity and value must be selected";
              }
              else{
                 var obj={};
                 angular.forEach($scope.totalRows,function(value,key){
                      if(value.key != '' && value.value !=''){
                          obj[value.key] ={'path':value.value,"is_upsert":value.is_upsert};
                      }
                 });
                  console.log(obj);
                   var temp={};
                   temp.template_name = $scope.templateName;
                   temp.template = obj;
                   $scope.saveLoading = true;
                    sourceTemplateService.saveTemplate({'obj':temp,'sess_id':vm.sess_id}).then(function(data){
                          if(data.data.status=='success'){
                             $.UIkit.notify({
                                       message : "Source Template '"+$scope.templateName+"' created.",//name +data.data.msg,
                                       status  : 'success',
                                       timeout : 2000,
                                       pos     : 'top-center'
                             });
                             $scope.clearTemplateCard();
                             $scope.saveLoading = false;
                             vm.reloadTemplate(temp.template_name, 'save');
                          }
                          else
                             console.log(data.data.msg);
                    });
              }
           }
           else{
              $scope.templateNameRepeat = "Template name already exists";
              $scope.templateNameError = "";
           }
        }
        else{
            $scope.templateNameError = "Please enter template name";
        }
      };

      $scope.existingRowAddData = function(key,value,overide,index,templatename){
        vm.getTemplates[index].template[key] = {'path':value,'is_upsert':overide};
        sourceTemplateService.saveTemplate({'obj':vm.getTemplates[index],'sess_id':vm.sess_id}).then(function(data){
            if(data.data.status=='success'){
               $.UIkit.notify({
                         message : "Source Template '"+templatename+"' updated.",//"'"+name +"' "+data.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
               });
               vm.reloadTemplate(templatename);
            }
            else
              console.log(data.data.msg);
        });
      };

      $scope.removeKey = function(key,index,name){
        if(vm.editSTObj.length>1){
          ngDialog.open({ template: 'confirmBox',
            controller: ['$scope','$state' ,function($scope,$state) {
                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +key+ "'" +' ' + 'key of' + " " + name + " " +'Template ?';
                $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.editSTObj.splice(index,1);
                };
            }]
          });
        }
        else{
          $.UIkit.notify({
            message : "Atleast one key and value required.",
            status  : 'warning',
            timeout : 2000,
            pos     : 'top-center'
          });
        }
      };

      $scope.existingSelectChange = function(oldKey,key,value,index){
        delete vm.getTemplates[index].template[oldKey];
        vm.getTemplates[index].template[key] = value;
        console.log(oldKey);
        sourceTemplateService.saveTemplate({'obj':vm.getTemplates[index],'sess_id':vm.sess_id}).then(function(data){
            if(data.data.status=='success'){
               $.UIkit.notify({
                         message : name +" "+data.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
               });
               vm.reloadTemplate("");
            }
            else
              console.log(data.data.msg);
        });
      };
      $scope.bug=[];
      $scope.tempKey=[];
      $scope.tempVal=[];
      $scope.tempOveride=[];

      $scope.existingRowAdd = function(key,value,overide,index){
           if(overide == undefined)
              overide = false;
           $scope.bug[index] = false;
           $scope.templateValidateMsg = "";
           if(key == undefined || key=="" ){
              $scope.bug[index] = true;
              $scope.templateValidateMsg = "value required";
           }
           else{
             vm.getTemplates[index].template[key] = {"path":value,'is_upsert':overide};
              sourceTemplateService.saveTemplate({'obj':vm.getTemplates[index],'sess_id':vm.sess_id}).then(function(data){
                      if(data.data.status=='success'){
                         $.UIkit.notify({
                           message :"Source Template '"+vm.getTemplates[index].template_name+"' updated.",//name +" "+data.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                         });
                         vm.reloadTemplate(vm.getTemplates[index].template_name,"","");
                         $scope.tempKey[index]='';
                         $scope.tempVal[index]='';
                         $scope.tempOveride[index]=false;
                      }
                      else
                      console.log(data.data.msg);
              });
           }
      };

      $scope.removeTemplateCard =function(name,index){
          ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +name+ "'" +' ' + 'Template ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                     sourceTemplateService.removeTemplate({'obj':name,'sess_id':vm.sess_id}).then(function(data){
                          if(data.data.status=='success'){
                             $.UIkit.notify({
                               message : "Source Template '"+name +"' deleted.",//+data.data.msg,
                               status  : 'success',
                               timeout : 2500,
                               pos     : 'top-center'
                             });

                             vm.reloadTemplate("","delete","");
                             $('#sourceViewModal'+index).modal('toggle');
                             $(".modal-backdrop").remove();
                          }
                          else
                             console.log(data.data.msg);
                     });
              };
          }]
        });
      };
      $scope.showIcons=function(index){
        $scope.showEditIcons[index]=true;
      };
      $scope.hideIcons=function(index){
        $scope.showEditIcons[index]=false;
      };

}];