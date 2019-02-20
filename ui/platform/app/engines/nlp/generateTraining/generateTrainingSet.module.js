'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.engine.nlp')
  .controller('generateTrainingCtrl', function ($scope,$state,$compile,$timeout,$rootScope,nlpTrainService,$location,ngDialog) {
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $scope.sentenceArray = [{"sentence":"","verb_deps":[]}];
      $scope.verbsList = [];
      $scope.loadVerbs = [];
      $scope.msg = "";
      $scope.errorMsg = "";
      vm.importData = {};
      vm.importData.data = [];
      vm.importData.subData = [];
      $rootScope.serverType='nlp';
      $scope.csv = {
              content: null,
              header: true,
              separator: ',',
              result: vm.importData
      };

      $scope.sendsentenceData = function(value,index){
        if($scope.sentenceArray[index].sentence == "" || $scope.sentenceArray[index].sentence == undefined){
           $scope.errorMsg = "Please enter the sentence";
        }
        else{
            var senArray = [];
            senArray.push(value);
            $scope.loadVerbs[index] = true;
            nlpTrainService.sentence(senArray,$scope.loginData.sess_id).then(function(data){
               console.log(data.data.result.result.metadata.training_set[0]);
               $scope.errorMsg = "";
               $scope.loadVerbs[index] = false;
               $scope.sentenceArray[index].verb_deps = data.data.result.result.metadata.training_set[0].verb_deps;
               if(!angular.equals($scope.sentenceArray[$scope.sentenceArray.length-1],{"sentence":"","verb_deps":[]})){
                  $scope.sentenceArray.push({"sentence":"","verb_deps":[]});
               }
            },function(err){
                 console.log(err)
                 $scope.loadVerbs[index] = false;
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
            });
        }
      }

      $scope.addSentence = function(index){
          if($scope.sentenceArray[index].verb_deps.length == 0 || $scope.sentenceArray[index].verb_deps == undefined){
             $scope.errorMsg = "Please submit the sentence";
          }
          else{
             $scope.sentenceArray.push({"sentence":"","verb_deps":[]});
          }
      }

      $scope.reloadJsonDirective = function(){
          vm.users = {};
          vm.users.data = [];
          vm.users.subData = [];
          $scope.csv = {
                  content: null,
                  header: true,
                  separator: ',',
                  result: vm.users
          };
          $("#importJsonLink").empty();
          var htmlContent = '<span tooltip="Import" style="margin-right:10px;position:relative;float:right"><label style="padding: 5px;padding-right: 10px;padding-left: 10px;margin-top: 1px;" alt="import" title="import"> <i class="fa fa-download" aria-hidden="true"></i> Import</label><ng-csv-import class="import" content="csv.content" header="csv.header" separator="csv.separator" result="csv.result" confirm-action = "parseToJson()"></ng-csv-import></span>';
          var el = $compile( htmlContent )($scope);
          var element = document.getElementById("importJsonLink");
          angular.element(document.getElementById("importJsonLink")).append(el);
      }

      $scope.export = function(){
          console.log($scope.sentenceArray);
          var obj=$scope.sentenceArray;
          var lastArray=obj[obj.length-1];
          var finalObj=[];
          if(lastArray.sentence=="")
            var finalObj=obj.slice(0,obj.length-1);
          if(finalObj.length>0) {
//            var link = document.createElement("a");
//            link.download = "trainingSet.json";
//            var data = "text/json;charset=utf-8," + encodeURIComponent(angular.toJson(finalObj));
//            link.href = "data:" + data;
//            link.click();

            var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalObj));
            $('<a href="data:' + data + '" download="data.json" id="download">download JSON</a>').appendTo('#container');
            var link = document.getElementById("download");
            link.click();
          }
      }

      $scope.clearSentenceImport = function(){
         $scope.sentenceArray = [{"sentence":"","verb_deps":[]}];
      }

      function IsJsonString(str) {
          try {
              JSON.parse(str);
          } catch (e) {
              return false;
          }
          return true;
      }

      $scope.parseToJson = function(){
           if(IsJsonString($scope.csv.result.subData)){
              var senArray  = JSON.parse($scope.csv.result.subData);
              if(senArray.sentences == undefined && senArray.constructor === Array){
                $scope.loadVerbs[0] = true;
                nlpTrainService.sentence(senArray,$scope.loginData.sess_id).then(function(data){
                   console.log(data.data.result.result.metadata.training_set);
                   for(var i=0;i<data.data.result.result.metadata.training_set.length;i++){
                      $scope.sentenceArray[i] = {"sentence":"","verb_deps":[]};
                      $scope.sentenceArray[i].sentence = data.data.result.result.metadata.training_set[i].sentence;
                      $scope.sentenceArray[i].verb_deps = data.data.result.result.metadata.training_set[i].verb_deps;
                      $scope.errorMsg = "";
                   }
                   $scope.loadVerbs[0] = false;
                   $scope.sentenceArray.push({"sentence":"","verb_deps":[]});
                   $scope.reloadJsonDirective();
                },function(err){
                     console.log(err)
                     $scope.loadVerbs[index] = false;
                     $.UIkit.notify({
                             message : "Internal server error",
                             status  : 'warning',
                             timeout : 3000,
                             pos     : 'top-center'
                     });
                });
              }
              else if(senArray.sentences != undefined){
                if(senArray.sentences.constructor === Array){
                  senArray = senArray.sentences;
                  $scope.loadVerbs[0] = true;
                  nlpTrainService.sentence(senArray,$scope.loginData.sess_id).then(function(data){
                     console.log(data.data.result.result.metadata.training_set);
                     for(var i=0;i<data.data.result.result.metadata.training_set.length;i++){
                        $scope.sentenceArray[i] = {"sentence":"","verb_deps":[]};
                        $scope.sentenceArray[i].sentence = data.data.result.result.metadata.training_set[i].sentence;
                        $scope.sentenceArray[i].verb_deps = data.data.result.result.metadata.training_set[i].verb_deps;
                        $scope.errorMsg = "";
                     }
                     $scope.loadVerbs[0] = false;
                     $scope.sentenceArray.push({"sentence":"","verb_deps":[]});
                     $scope.reloadJsonDirective();
                  },function(err){
                         console.log(err)
                         $scope.loadVerbs[index] = false;
                         $.UIkit.notify({
                                 message : "Internal server error",
                                 status  : 'warning',
                                 timeout : 3000,
                                 pos     : 'top-center'
                         });
                    });
                }
              }
              else{
                $.UIkit.notify({
                   message : "No sentences found",
                   status  : 'danger',
                   timeout : 2000,
                   pos     : 'top-center'
                });
                $scope.reloadJsonDirective();
              }
           }
           else{
              $.UIkit.notify({
                 message : "Please import valid json",
                 status  : 'danger',
                 timeout : 2000,
                 pos     : 'top-center'
              });
              $scope.reloadJsonDirective();
           }
      };


      //Intent action generation code

      $(document).click(function() {
        $scope.getEntityError = "";
        $scope.createEntityError = "";
        $scope.updateEntityError = "";
        $scope.deleteEntityError = "";
        $scope.setValueError = "";
        $scope.sendMessageError = "";
      });

      $scope.actionObj = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
      $scope.action = {"getEntityVerb":"","createEntityVerb":"","updateEntityVerb":"","deleteEntityVerb":"","setValueVerb":"","sendMessageVerb":""};
      $scope.loadMeanings={"get_entity":false,"create_entity":false,"update_entity":false,"delete_entity":false,"set_value":false,"send_message":false};
      $scope.getMeanings=function(actionIntent){
        var word="";
        if(actionIntent=='get_entity')
          word=$scope.action.getEntityVerb;
        else if(actionIntent=='create_entity')
          word=$scope.action.createEntityVerb;
        else if(actionIntent=='update_entity')
          word=$scope.action.updateEntityVerb;
        else if(actionIntent=='delete_entity')
          word=$scope.action.deleteEntityVerb;
        else if(actionIntent=='set_value')
          word=$scope.action.setValueVerb;
        else if(actionIntent=='send_message')
          word=$scope.action.sendMessageVerb;

        if(word!=""){
          $scope.loadMeanings[actionIntent]=true;
          nlpTrainService.getMeaningsForVerb(word,{'sess_id':$scope.loginData.sess_id}).then(function(response){
            var res=response.data;
            $scope.loadMeanings[actionIntent]=false;
            if(res.status=="success"){
              if(actionIntent=='get_entity'){
                if(res.result.result.result.metadata.meanings.length>0){
                  $scope.actionObj.get_entity.unshift(res.result.result.result.metadata);
                  $scope.action.getEntityVerb="";
                }
                else{
                  $scope.getEntityError = "No definitions found";
                }
              }
              else if(actionIntent=='create_entity'){
                if(res.result.result.result.metadata.meanings.length>0){
                  $scope.actionObj.create_entity.unshift(res.result.result.result.metadata);
                  $scope.action.createEntityVerb="";
                }
                else{
                  $scope.createEntityError = "No definitions found";
                }
              }
              else if(actionIntent=='update_entity'){
                if(res.result.result.result.metadata.meanings.length>0){
                  $scope.actionObj.update_entity.unshift(res.result.result.result.metadata);
                  $scope.action.updateEntityVerb="";
                }
                else{
                  $scope.updateEntityError = "No definitions found";
                }
              }
              else if(actionIntent=='delete_entity'){
                if(res.result.result.result.metadata.meanings.length>0){
                  $scope.actionObj.delete_entity.unshift(res.result.result.result.metadata);
                  $scope.action.deleteEntityVerb="";
                }
                else{
                  $scope.deleteEntityError = "No definitions found";
                }
              }
              else if(actionIntent=='set_value'){
              if(res.result.result.result.metadata.meanings.length>0){
                  $scope.actionObj.set_value.unshift(res.result.result.result.metadata);
                  $scope.action.setValueVerb="";
                }
                else{
                  $scope.setValueError = "No definitions found";
                }
              }
              else if(actionIntent=='send_message'){
              if(res.result.result.result.metadata.meanings.length>0){
                  $scope.actionObj.send_message.unshift(res.result.result.result.metadata);
                  $scope.action.sendMessageVerb="";
                }
                else{
                  $scope.sendMessageError = "No definitions found";
                }
              }
            }
            else{
              $.UIkit.notify({
                 message : res.msg,
                 status  : 'danger',
                 timeout : 2000,
                 pos     : 'top-center'
              });
            }
          },function(err){
                 console.log(err)
                 $scope.loadVerbs[index] = false;
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
          });
        }
         else{
            $.UIkit.notify({
               message : "Please enter the verb.",
               status  : 'warning',
               timeout : 2000,
               pos     : 'top-center'
            });
          }
      };

      $scope.finalActionObj={"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
      $scope.exportAction = function(){
        $scope.showLoaderIcon = true;
        $scope.finalActionObj={"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
        console.log($scope.actionObj);
        //$scope.finalActionObj=$scope.actionObj;

        angular.forEach($scope.actionObj, function(obj,key){
          $scope.getActionIntent(obj,key);
        });

        console.log($scope.finalActionObj);

        $timeout( function(){
          $scope.showLoaderIcon = false;
//          var link = document.createElement("a");
//          link.download = "trainingSet.json";
//          var data = "text/json;charset=utf-8," + encodeURIComponent(angular.toJson($scope.finalActionObj));
//          link.href = "data:" + data;
//          link.click();
            var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.finalActionObj));
            $('<a href="data:' + data + '" download="data.json" id="download">download JSON</a>').appendTo('#container');
            var link = document.getElementById("download");
            link.click();
        }, 3000);
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

      $scope.clearAction = function(){
          $scope.actionObj = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
      }

      $scope.deleteVerb = function(index,actionIntent){
        var verb = $scope.actionObj[actionIntent][index].word;
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +verb+ "'" +' ' + 'verb ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.removeVerbFunct(index,actionIntent);
              }
          }]
        });
      };

      vm.removeVerbFunct = function(index,actionIntent){
        $scope.actionObj[actionIntent].splice(index,1);
      }

//      $scope.selectMeaning = function(parentIdx,index,id,code,actionIntent){
//        console.log($scope.actionObj[actionIntent][parentIdx].meanings[index].is_selected);
//        $scope.actionObj[actionIntent][parentIdx].meanings[index].is_selected=!$scope.actionObj[actionIntent][parentIdx].meanings[index].is_selected;
//      }
  });
