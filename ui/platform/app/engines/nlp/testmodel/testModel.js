'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.engine.nlp')
.controller('testModelCtrl', function ($scope,$state,$compile,$timeout,$rootScope,nlpTrainService,rulesService,$location,ngDialog) {
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $scope.savedSentences = [];
      $scope.selectedModel="";
      $scope.selectedModelForAction="";
      $scope.verbsDisable = true;
      $scope.yesNoEnable = true;
      $scope.actionShow = false;
      $scope.intentShow = false;

      $rootScope.reloadModelsInTest = function(title){
         if(title!="Test Model" && title!="Models" && title!="Train Data Generation"){
          //alert(title+" from Test Model");
          $scope.selectedModel="";
          $scope.dictionarySelected = "";
          $scope.actionShow = false;
          $scope.intentShow = false;
          $scope.getModels();
        }
      };

      $scope.getModels =function(type,id){
        var obj={"server":"nlp","sess_id":$scope.loginData.sess_id};
        rulesService.getModels(obj).then(function(response){
          vm.modelsObj={};
          vm.modelsObjForAction={};
          vm.modelsObj=response.data.data;
          vm.modelsObjForAction=response.data.data;
          console.log(vm.modelsObj);

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
      $scope.getModels();

      $scope.sendSentence = function(sentence){
          $scope.failureMsg = "";
          if(sentence == "" || sentence == undefined){
             $scope.errorMsg = "Please enter the sentence";
          }
          else{
              if($scope.dictionarySelected != undefined && $scope.dictionarySelected != ""){
                  var senArray = [];
                  senArray.push(sentence);
                  $scope.yesNoEnable = false;
                  var data = {'_id': $scope.dictionarySelected._id, "data" : { 'sentences': senArray}}
                  $scope.isTestSubmit = true;

                  nlpTrainService.testSentence(data,$scope.loginData.sess_id).then(function(data){
                     if(data.data.status == "failure"){
                       $scope.isTestSubmit = false;
                       $scope.failureMsg = data.data.msg;
                     }
                     else{
                       $scope.isTestSubmit = false;
                       console.log(data.data);
                       $scope.errorMsg = "";
                       $scope.failureMsg = "";
                       $scope.intentVerbs = angular.copy(data.data.result.result.metadata.result);
                     }
                  }, function(){})
              }
              else{
                  $scope.modelSelectError = "please select the model";
              }
        }
      }

      $scope.dictionarySelect = function(object){
        if(object == ""){
          $scope.modelSelectError = "please select the model";
          $scope.dictionarySelected = "";
          $scope.actionShow = false;
          $scope.intentShow = false;
        }
        else{
          $scope.dictionarySelected = JSON.parse(object);
          if($scope.dictionarySelected.type=="intent_classifier" || $scope.dictionarySelected.type== undefined){
            $scope.intentShow = true;
            $scope.actionShow = false;
          }
          if($scope.dictionarySelected.type=="action_classifier"){
            $scope.actionShow = true;
            $scope.intentShow = false;
            $scope.spinGetModelData = true;
            $scope.testActionObjConstruct = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
            nlpTrainService.getModelData({"_id":$scope.dictionarySelected._id},$scope.loginData.sess_id).then(function(response){
              $scope.testActionObj = response.data;
              $scope.constructActionModal();
              $scope.spinGetModelData = false;
            });
          }
          $scope.modelSelectError = "";
        }
      }

      $scope.checkChange = function(index,value){
        for(var i=0;i<$scope.verb_deps.length;i++){
          if(index == i){
             $scope.verb_deps[i].is_intent_verb = value;
             if(value==true){
//               $scope.savedSentences.push({"sentence":$scope.sentence,verb_deps:$scope.verb_deps});
//               $scope.sentence = '';
//               $scope.verb_deps = [];
             }
          }
          else{
             $scope.verb_deps[i].is_intent_verb = false;
          }
        }
      }

      $scope.clearSentence = function(){
         $scope.sentence = '';
         $scope.verb_deps = [];
         $scope.intentVerbs = [];
      }

      $scope.clearVerbs = function(sentence){
//        for(var i=0;i<$scope.verb_deps.length;i++){
//           $scope.verb_deps[i].is_intent_verb = false;
//        }

        var senArray = [];
        senArray.push(sentence);
        $scope.isTestSubmit = true;
        nlpTrainService.sentence(senArray,$scope.loginData.sess_id).then(function(data){
           $scope.isTestSubmit = false;
           $scope.verb_deps = data.data.result.result.metadata.training_set[0].verb_deps;
           $scope.modifyButton = true;
           $scope.verbsDisable = false;
        }, function(){})
      }

      $scope.addToModify = function(sen){
        $scope.savedSentences.push({"sentence":sen,verb_deps:$scope.verb_deps});
        $scope.modifyButton = false;
        $scope.verbsDisable = true;
        $scope.yesNoEnable = true;
        $scope.sentence = '';
        $scope.verb_deps = [];
        $scope.intentVerbs = [];
      }

      $scope.cancelModify = function(){
        $scope.modifyButton = false;
        $scope.verbsDisable = true;
      }

      $scope.isIntentVerb = function(data){
         var flag = false;
         for(var i=0;i<data.length;i++){
            if(data.is_intent_verb){
              flag = true;
              break;
            }
         }
         if(flag)
           return false;
         else
           return true;
      }

      $scope.removeSentence = function(index){
        $scope.savedSentences.splice(index,1);
      }

      $scope.retrain = function(){
        if($scope.dictionarySelected != undefined && $scope.dictionarySelected != ""){
            var obj = {"_id":$scope.dictionarySelected._id , "data":$scope.savedSentences}
            $scope.isRetrainSubmit = true;
            $scope.failureRetrain = "";
            $scope.successMsg = "";
            nlpTrainService.retrain(obj,$scope.loginData.sess_id).then(function(data){
               if(data.data.status == "failure"){
                 $scope.isRetrainSubmit = false;
                 $scope.failureRetrain = data.data.msg;
                 setTimeout(function(){
                   $scope.failureRetrain = "";
                 }, 2000);
               }
               else{
                 $scope.isRetrainSubmit = false;
                 $scope.savedSentences = [];
                 $scope.sentence = "";
                 $scope.verb_deps = [];
                 $scope.intentVerbs = [];
                 $scope.failureRetrain = "";
                 $scope.successMsg = data.data.msg;
                 setTimeout(function(){
                   $scope.successMsg = "";
                 }, 2000);
               }
            }, function(){})
        }
      }


      //TEST MODAL (ACTION) CODE STARTS

      $scope.sendVerb = function(verb){
          $scope.failureMsg = "";
          if(verb == "" || verb == undefined){
             $scope.errorMsg = "Please enter the verb";
          }
          else{
              if($scope.dictionarySelected != undefined && $scope.dictionarySelected != ""){
                  $scope.modifyActionButton = false;
                  $scope.isTestActionSubmit = true;
                  var data = {'_id': $scope.dictionarySelected._id, "data" : { 'word': verb}}
                  nlpTrainService.getTestVerbMeanings(data,$scope.loginData.sess_id).then(function(data){
                     if(data.data.status == "failure"){
                       $scope.isTestActionSubmit = false;
                     }
                     else{

                        $scope.isTestActionSubmit = false;
                        $scope.testActionMeanings = data.data.result.result.metadata;
                     }
                  }, function(){})
              }
              else{
                  $scope.modelSelectError = "please select model";
              }
        }
      }

      $scope.clearVerb = function(){
        $scope.testActionMeanings = {};
        $scope.verbMeaningsArray = {};
      }

      $scope.cancelModifyAction = function(){
        $scope.modifyActionButton = false;
      }

      $scope.clearMeaning = function(verb){
        $scope.isTestActionSubmit = true;
        nlpTrainService.getMeaningsForVerb(verb,{'sess_id':$scope.loginData.sess_id}).then(function(response){
            var res=response.data;
            $scope.modifyActionButton = true;
            $scope.isTestActionSubmit = false;
            $scope.verbMeaningsArray=res.result.result.result.metadata;
        });
      }

      $scope.deleteGetEntityVerb = function(key,index){
        var verb = $scope.testActionObjConstruct[key][index].word;
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +verb+ "'" +' ' + 'verb ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.removeTestVerbFunct(key,index);
              }
          }]
        });
      }

      vm.removeTestVerbFunct = function(key,index){
        $scope.testActionObjConstruct[key].splice(index,1);
      }

      $scope.removeMeaning = function(key,parent,index,data){
        setTimeout(function(){
          var indx = ($scope.testActionObjConstruct[key][parent].meanings).indexOf(data);
          if (indx != -1)
            $scope.testActionObjConstruct[key][parent].meanings.splice(indx,1);
        }, 1000);
      }

      $scope.retrainTestAction = function(){
          $scope.isRetrainSubmitAction = true;
          $scope.failureRetrainAction = "";
          $scope.successMsgRetrainAction = "";
          $scope.finalActionObj={"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
          angular.forEach($scope.testActionObjConstruct, function(obj,key){
            $scope.getActionIntent(obj,key);
          });
          console.log($scope.finalActionObj);
          var obj = {"_id": $scope.dictionarySelected._id,"data":$scope.finalActionObj}

          nlpTrainService.retrainAction(obj,$scope.loginData.sess_id).then(function(data){
             if(data.data.status == "failure"){
               $scope.isRetrainSubmitAction = false;
               $scope.failureRetrainAction = data.data.msg;
               setTimeout(function(){
                 $scope.failureRetrain = "";
               }, 2000);
             }
             else{
               $scope.isRetrainSubmitAction = false;
               $scope.savedSentences = [];
               $scope.sentence = "";
               $scope.verb_deps = [];
               $scope.intentVerbs = [];
               $scope.failureRetrainAction = "";
               $scope.successMsgRetrainAction = data.data.msg;
               setTimeout(function(){
                 $scope.successMsg = "";
               }, 2000);
             }
          }, function(){})
      }

      $scope.getActionIntent=function(obj,actionIntent){
        angular.forEach(obj, function(verb,key){
            $scope.getselectedMeanings(verb,actionIntent);
        });
      };
      $scope.getselectedMeanings=function(verb,actionIntent){
        angular.forEach(verb.meanings, function(meanObj,key){
          if(meanObj.is_selected==true)
            $scope.finalActionObj[actionIntent].push(meanObj);
            //$scope.finalActionObj[key1][key2].meaning.splice(key,1);
        });
      };

      $scope.constructActionModal = function(){
          $scope.testActionObjConstruct = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};


          var groups = $scope.testActionObj.get_entity.reduce(function(obj,item){
              obj[item.word] = obj[item.word] || [];
              obj[item.word].push(item);
              return obj;
          }, {});
          $scope.testActionObjConstruct.get_entity = Object.keys(groups).map(function(key){
              return {word: key, meanings: groups[key]};
          });

          var groups = $scope.testActionObj.create_entity.reduce(function(obj,item){
              obj[item.word] = obj[item.word] || [];
              obj[item.word].push(item);
              return obj;
          }, {});
          $scope.testActionObjConstruct.create_entity = Object.keys(groups).map(function(key){
              return {word: key, meanings: groups[key]};
          });

          var groups = $scope.testActionObj.update_entity.reduce(function(obj,item){
              obj[item.word] = obj[item.word] || [];
              obj[item.word].push(item);
              return obj;
          }, {});
          $scope.testActionObjConstruct.update_entity = Object.keys(groups).map(function(key){
              return {word: key, meanings: groups[key]};
          });

          var groups = $scope.testActionObj.delete_entity.reduce(function(obj,item){
              obj[item.word] = obj[item.word] || [];
              obj[item.word].push(item);
              return obj;
          }, {});
          $scope.testActionObjConstruct.delete_entity = Object.keys(groups).map(function(key){
              return {word: key, meanings: groups[key]};
          });

          var groups = $scope.testActionObj.set_value.reduce(function(obj,item){
              obj[item.word] = obj[item.word] || [];
              obj[item.word].push(item);
              return obj;
          }, {});
          $scope.testActionObjConstruct.set_value = Object.keys(groups).map(function(key){
              return {word: key, meanings: groups[key]};
          });

          var groups = $scope.testActionObj.send_message.reduce(function(obj,item){
              obj[item.word] = obj[item.word] || [];
              obj[item.word].push(item);
              return obj;
          }, {});
          $scope.testActionObjConstruct.send_message = Object.keys(groups).map(function(key){
              return {word: key, meanings: groups[key]};
          });
          console.log($scope.testActionObjConstruct);
      }

      $scope.addTo = function(){
        var verbDefinitionsArray = {"word":$scope.verbMeaningsArray.word,"meanings":[]};
        angular.forEach($scope.verbMeaningsArray.meanings, function(meanObj,key){
          if(meanObj.is_selected)
            verbDefinitionsArray.meanings.push(meanObj);
        });
        $scope.testActionObjConstruct[$scope.radioSelect].push(verbDefinitionsArray);
        $scope.verb = "";
        $scope.testActionMeanings = {};
        $scope.verbMeaningsArray = {};
        $scope.modifyActionButton = false;
      }

      $scope.dragedFrom={"key":"","word":"","wordIdx":"","meaningIndex":"","data":{}};
      $scope.onDropComplete=function(data,evt,key,idx){
        if(data!=null){
          $scope.testActionObjConstruct[key][idx].meanings.push($scope.dragedFrom.data);
          //var index = ($scope.testActionObjConstruct[$scope.dragedFrom.key][$scope.dragedFrom.wordIdx].meanings).indexOf($scope.dragedFrom.data);
          //if (index != -1)
           $scope.testActionObjConstruct[$scope.dragedFrom.key][$scope.dragedFrom.wordIdx].meanings.splice($scope.dragedFrom.meaningIndex,1)
        }
      };
      $scope.onDragSuccess=function(data,evt,key,word,wordIdx,idx,dat){
        $scope.dragedFrom={"key":"","word":"","wordIdx":"","meaningIndex":"","data":{}};
        if(data!=null){
          $scope.dragedFrom={"key":key,"word":word,"wordIdx":wordIdx,"meaningIndex":idx,"data":dat};
        }
      };


  });
