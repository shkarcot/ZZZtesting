'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.engine.nlp')
  .controller('modelCtrl', function ($scope,$state,$compile,$timeout,$rootScope,nlpTrainService,$location,ngDialog) {
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $scope.blinkingRow={};

      $scope.removeBlinking=function(){
       angular.forEach($scope.blinkingRow,function(value,index){
         $scope.blinkingRow[index]="";
       });
      };

      //var getModels={"data": [{"service": "nlp", "is_published": false, "model_ref": [{"key_name": "LifeSciences//trainingset.json", "bucket_name": "xpmsdevdata"}], "name": "mmm", "solution_id": "iuh_manhohur", "description": "dddd", "_id": "599350f0428d342bb549853c"}, {"service": "nlp", "is_published": false, "model_ref": [{"key_name": "LifeSciences//trainingset.json", "bucket_name": "xpmsdevdata"}], "name": "ss", "solution_id": "iuh_manhohur", "description": "sdsa", "_id": "599351b9428d342bb549853d"}, {"service": "nlp", "is_published": false, "model_ref": [{"key_name": "LifeSciences//trainingset.json", "bucket_name": "xpmsdevdata"}], "name": "ss", "solution_id": "iuh_manhohur", "description": "sdsa", "_id": "599351be428d342bb549853e"}]};
      vm.getModels =function(type,id){
        var obj={"server":"nlp","sess_id":$scope.loginData.sess_id};
        nlpTrainService.getModels(obj).then(function(response){
          vm.modelsObj={};
          vm.modelsObjForAction={};
          vm.modelsObj=response.data.data;
          vm.modelsObjForAction=[];
          vm.modelsObjForIntent = [];
          console.log(vm.modelsObj);
          angular.forEach(vm.modelsObj,function(value,key){
            if(value.type=="action_classifier"){
              vm.modelsObjForAction.push(value);
            }
            else{
              vm.modelsObjForIntent.push(value);
            }
          })

          if(type=="save"){
            $scope.blinkingRow[vm.modelsObj[0]._id]="blinking";
            $timeout($scope.removeBlinking, 3000);
          }
          else if(type=="update"){
            $scope.blinkingRow[id]="blinking";
            $timeout($scope.removeBlinking, 3000);
          }
        });
      };
      vm.getModels();

      resourceServices.getDictionary({'sess_id':vm.sess_id}).then(function(response){
          vm.trainingSetArray=[];
          var dictionaryList = response;
          angular.forEach(dictionaryList.data.data,function(value,key){
            if(value.type=="training_set")
              vm.trainingSetArray.push(value);
          });
      });

      vm.valEnable2 = [];
      /*$(".collapseOne").collapse('show');*/
      $scope.hideAndCollapse="fa-minus";
      $scope.expand =function(){
        if($scope.hideAndCollapse=="fa-minus")
          $scope.hideAndCollapse="fa-plus";
        else
          $scope.hideAndCollapse="fa-minus"
      };
      $scope.modelObj={"modelName":"","modelDescription":"","trainingSet":"","type":""};

      $scope.saveModel=function(){
        var obj= $scope.modelObj;
        var obj1=angular.fromJson($scope.modelObj.trainingSet);
        var flag=false;
        angular.forEach(vm.modelsObj,function(value,key){
          console.log(value.name);
          var string=value.model_ref[0].key_name;
          var trSet = string.split('/');
          console.log(trSet[1]);
          if(obj1.file_name== trSet[1] && value.name==$scope.modelObj.modelName)
            flag=true;
        });
        if(flag==false){
          var data={};
          data.training_set_id=obj1._id;
          data.name=$scope.modelObj.modelName;
          data.description=$scope.modelObj.modelDescription;
          data.type=$scope.modelObj.type;
          data.service="nlp";

          var req={"sess_id":$scope.loginData.sess_id,"data":data}
          $scope.isTrained = true;
          nlpTrainService.saveModel(req).then(function(response){
            if(response.data==""){
              $.UIkit.notify({
                 message : "Timeout error.",
                 status  : 'warning',
                 timeout : 2000,
                 pos     : 'top-center'
              });
              vm.getModels("save","");
              $scope.isTrained = false;
              $scope.modelObj={"modelName":"","modelDescription":"","trainingSet":""};
            }
            else if(response.data.status=="success"){
                $.UIkit.notify({
                   message : "'"+$scope.modelObj.modelName+ "' model has been created.",
                   status  : 'success',
                   timeout : 2000,
                   pos     : 'top-center'
                });
                //disableall(data._id,index);
                vm.getModels("save","");
                $scope.isTrained = false;
                $scope.modelObj={"modelName":"","modelDescription":"","trainingSet":""};
             }
             else if(response.data.status=="failure" ||response.data.status==undefined){
                $.UIkit.notify({
                   message : response.data.msg +"<br>"+ response.data.error,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.isTrained = false;
             }
             console.log(response);
            });
          }
          else{
            $.UIkit.notify({
               message :   "Model name '"+$scope.modelObj.modelName+ "' already exists for "+obj1.file_name+".",
               status  : 'warning',
               timeout : 2000,
               pos     : 'top-center'
            });
          }
        };


       $scope.intentToggleStatus = function(toggle,obj,id){
          var status="";
          if(toggle==true)
            status="enable";
          else
            status="disable";

          var data = {};
          vm.valEnable2[id]=toggle;
          data._id = id;
          data.service = "nlp";
          var req={"status":status,"sess_id":$scope.loginData.sess_id,"data":data};

          ngDialog.open({ template: 'confirmBox',
            controller: ['$scope','$state' ,function($scope,$state) {
                $scope.activePopupText = 'Are you sure you want to change the status?';
                $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  nlpTrainService.setTrainingSetModelStatus(req).then(function(response){
                   if(response.data.status=="success"){
                      $.UIkit.notify({
                         message : response.data.msg,//"'"+obj.name+ "' model status has been updated.",
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                      });
                      //disableall(data._id,index);
                   }
                   else if(response.data.status=="failure"){
                      $.UIkit.notify({
                         message :response.data.msg, //"Opps,'"+obj.name+ "' model status has not been updated.",
                         status  : 'warning',
                         timeout : 2000,
                         pos     : 'top-center'
                      });
                     //vm.modelObj[index].services.nlp=!toggle;
                     vm.valEnable2[id]=!toggle;
                   }
                   console.log(response);
                   vm.getModels();
                  });

                }
            }]
          });
          $scope.$on('ngDialog.closed', function(e, $dialog) {
            vm.getModels("update",id);
            //vm.valEnable2[id]=!toggle;
            //console.log(vm.valEnable2);
            /*angular.forEach(vm.modelsObj,function(value,key){
              if(value._id==id)
                vm.modelsObj[key].is_enabled=!toggle;
            });*/
            //console.log(vm.modelsObj);
          });
      };


      function disableall(id,index){
        console.log(id);

        angular.forEach(vm.trainingSetArray,function(value,key){
          if(id!=value._id && value.is_published!="false"){
            $scope.changeIntentRecStatus(value,key);

          }
        });
          console.log("trainingSetArray-----------");
          console.log(vm.trainingSetArray);
      };
      $scope.changeIntentRecStatus =function(value,key){
        var data = {};
        data.is_published="false";
        data.server_type = "nlp";
        data._id =value._id;
        console.log(value._id);
         resourceServices.getDictionary(data).then(function(response){
            console.log(data);
            console.log(response.data);
            vm.trainingSetArray[key].is_published="false";
            vm.valEnable2[key]="false";
          });
      }
      $scope.getClassifier=function(type){
          if(type=="intent_classifier")
            return "Intent Classifier"
          else if(type=="action_classifier")
            return "Action Classifier"
          else
            return ""
      };

      $scope.deleteModel = function(type,id,model_name){
         ngDialog.open({ template: 'confirmDeleteBox',
            controller: ['$scope','$state' ,function($scope,$state) {
                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +model_name+ "'" +' ' + 'model ?';
                $scope.onConfirmActivation = function (){
                  ngDialog.close();

                  nlpTrainService.deleteModel({'_id':id,'sess_id':vm.sess_id}).then(function(data){
                    if(data.data.status=='success'){
                      $.UIkit.notify({
                        message : data.data.msg,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                      });
                      vm.getModels();
                    }
                    else
                      console.log(data.data.msg)
                  });

                }
            }]
         });
      }
  });
