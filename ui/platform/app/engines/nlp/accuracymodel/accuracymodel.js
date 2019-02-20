'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.engine.nlp')
/*.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('app.engineslist.NLP', {
        url: '/NLP',
        breadcrumb: {state: 'Engines', subState: 'NLP' },
        views: {
          'accuracymodel': {
            templateUrl: 'views/accuracymodel.html',
            controller: 'accuracyModelCtrl as am',
            cache:false
           *//* resolve: {
              dictionaryList: ['$stateParams', 'rulesService', function($stateParams, rulesService){
                    var loginData = JSON.parse(localStorage.getItem('userInfo'));
                    var sess_id= loginData.sess_id;
                    return rulesService.getDictionary({'sess_id':sess_id});
                }]
            }*//*
          }
        }
      })
  }])*/
  .controller('accuracyModelCtrl', function ($scope,$state,$compile,$timeout,$rootScope,nlpTrainService,$location,ngDialog) {
      var vm = this;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;

      $scope.savedSentences = [];
      $scope.selectedModelInAccuracy="";
      $scope.selectedModelForAction="";
      $scope.verbsDisable = true;
      $scope.yesNoEnable = true;
      $scope.actionShowForMA = false;
      $scope.intentShowForMA = false;

      $scope.spinGetModelStatistics=false;
      $rootScope.reloadModels = function(title){
        if(title!="Model Accuracy" && title!="Models" && title!="Train Data Generation"){
          //alert(title+" from Model Accuracy");
          $scope.selectedModelInAccuracy="";
          $scope.dictionarySelected1 = "";
          $scope.actionShowForMA = false;
          $scope.intentShowForMA = false;
          $scope.chartData="";
          $scope.chartData=[];
          $scope.chartData[0]=['x', 'SVC', 'BernoulliNB', 'MultinomialNB', 'LogisticRegression', 'GaussianNB', 'Ensemble Accuracy'];
          $scope.StatisticsData="";
          $("#chart1").empty();
          //$scope.testActionObjConstruct1 = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
          $scope.getTheModels();
        }
      }

      $scope.getTheModels =function(type,id){
        var obj={"server":"nlp","sess_id":$scope.loginData.sess_id};
        nlpTrainService.getModels(obj).then(function(response){
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
      $scope.getTheModels();

      $scope.modelSelectError="";

      $scope.sendSentence1 = function(sentence){
          $scope.failureMsg = "";
          if(sentence == "" || sentence == undefined){
             $scope.errorMsg = "Please enter the sentence";
          }
          else{
              if($scope.dictionarySelected1 != undefined && $scope.dictionarySelected1 != ""){
                  var senArray = [];
                  senArray.push(sentence);
                  $scope.yesNoEnable = false;
                  var data = {'_id': $scope.dictionarySelected1._id, "data" : { 'sentences': senArray}}
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
                       $scope.intentVerbs1 = angular.copy(data.data.result.result.metadata.result);
                     }
                     $scope.isTestSubmit = false;
                  }, function(){})
              }
              else{
                  $scope.modelSelectError = "please select model";
              }
        }
      }

      $scope.chartData=[];
      $scope.chartData[0]=['x', 'SVC', 'BernoulliNB', 'MultinomialNB', 'LogisticRegression', 'GaussianNB', 'Ensemble Accuracy'];
      $scope.selectedIntentModelObj={}
      $scope.selectTheModel = function(object){
          $scope.chartData="";
          $scope.chartData=[];
          $scope.chartData[0]=['x', 'SVC', 'BernoulliNB', 'MultinomialNB', 'LogisticRegression', 'GaussianNB', 'Ensemble Accuracy'];
          $scope.StatisticsData="";
          $("#chart1").empty();
        if(object == ""){
          $scope.modelSelectError = "please select the model";
          $scope.spinGetModelStatistics=false;
          $scope.dictionarySelected1 = "";
          $scope.actionShowForMA = false;
          $scope.intentShowForMA = false;
          $scope.spinGetModelData = false;
          $scope.testActionObjConstruct1 = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};

        }
        else{
          $scope.dictionarySelected1 = JSON.parse(object);
          if($scope.dictionarySelected1.type=="intent_classifier" || $scope.dictionarySelected1.type== undefined){
            $scope.intentShowForMA = true;
            $scope.actionShowForMA = false;
            $scope.selectedIntentModelObj=JSON.parse(object);
            $scope.getModelVersions($scope.selectedIntentModelObj);
          }
          if($scope.dictionarySelected1.type=="action_classifier"){
            $scope.actionShowForMA = true;
            $scope.intentShowForMA = false;
            $scope.spinGetModelData = true;
            $scope.testActionObjConstruct1 = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
            nlpTrainService.getModelData({"_id":$scope.dictionarySelected1._id},$scope.loginData.sess_id).then(function(response){
              $scope.testActionObj = response.data;
              $scope.constructActionModal1();
              $scope.spinGetModelData = false;
            });
          }
          $scope.modelSelectError = "";
        }
      }
      $scope.isVersions="";
      $scope.versionsExits=false;
      $scope.modelNameForDisplay="";
      $scope.selectedVersions=[];
      $scope.xAxis=[];
      $scope.yAxis=[];
      $scope.xAxis[0]="x";
      $scope.yAxis[0]="Accuracy";
      $scope.more=false;

      $scope.getModelVersions = function(object){
        //$scope.spinGetModelData=true;
        //$scope.isVersions="";
        $scope.spinGetModelStatistics=true;
        $scope.versionsExits=false;
        $scope.xAxis=[];
        $scope.yAxis=[];
        $scope.xAxis[0]="x";
        $scope.yAxis[0]="Accuracy";

        $("#chart1").empty();
        $scope.modelNameForDisplay="";
        $scope.StatisticsData="";
        if(object.model_id!=undefined){
          nlpTrainService.getModelVersions({"data":object,"sessId":$scope.loginData.sess_id}).then(function(response){
            $scope.spinGetModelStatistics=false;
            if(response.data.data.status= "success"){
              $scope.StatisticsData = response.data.data.result.result.metadata;

              angular.forEach($scope.StatisticsData.history, function(obj,key){
                if(obj.trained_model_scores!=undefined){
                  $scope.chartData[key+1]=[
                    obj.version,
                    obj.trained_model_scores.SVC,
                    obj.trained_model_scores.BernoulliNB,
                    obj.trained_model_scores.MultinomialNB,
                    obj.trained_model_scores.LogisticRegression,
                    obj.trained_model_scores.GaussianNB,
                    obj.model_score.accuracy
                  ];
                }
              });
              console.log($scope.chartData);
              $scope.versionsExits=true;
              //$scope.isVersions="versions-div";

              $scope.modelNameForDisplay=object.name + " -V ";
              $scope.showChart($scope.xAxis,$scope.yAxis);
            }

          });
        }
        else{
          $scope.spinGetModelStatistics=false;
        }
         //$scope.spinGetModelData=true;
      };

      $scope.setAccurance=function(indx,val,checked,obj){
        if(checked==false){
          $scope.xAxis.splice(indx+1, 1);
          $scope.yAxis.splice(indx+1, 1);
          $scope.chartData[indx+1]=[];
        }
        else{
         $scope.xAxis.splice(indx+1, 0, "V"+indx);
         $scope.yAxis.splice(indx+1, 0, val);
         $scope.chartData[indx+1]=[
                  obj.version,
                  obj.trained_model_scores.SVC,
                  obj.trained_model_scores.BernoulliNB,
                  obj.trained_model_scores.MultinomialNB,
                  obj.trained_model_scores.LogisticRegression,
                  obj.trained_model_scores.GaussianNB,
                  obj.model_score.accuracy
                ];
        }
        $scope.showChart($scope.xAxis,$scope.yAxis);
      };


      $scope.showChart=function(x,y){
        setTimeout(function () {
          var chart = c3.generate({
            data: {
                x: "x",
                columns: [x,y]
            },
            axis: {
                x: {
                    type: 'category',
                    label: {
                    text: 'Versions'
                  }
                },
                y: {
                    max: 1,
                    min: 0,
                    label:{
                     text: 'Accuracy'
                    }
                }
            }
         });
        }, 1000);

        var colors = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

        var chart1 = c3.generate({
          bindto :'#chart1',
          data: {
              x : 'x',
              columns:$scope.chartData,
              type: 'bar',
              color: function (color, d) {
                    var version=d.id;
                    if(version!=undefined){
                      var res = version.split("");
                      var idx=res[1];
                      console.log(idx);
                      return colors[idx];
                    }
                }
          },
          axis: {
              x: {
                  type: 'category',
                  tick: {
                      rotate: -30,
                      multiline:true
                  },
                  label: {
                    text: 'Trained Model Scores',
                    position: 'outer-center'
                  },
                  height: 100
              }
          }
        });

       setTimeout(function () {
        var $firstDiv1 = $("#chart1 svg g g.c3-axis-x g:eq(0)");$firstDiv1.find("text").attr({x:"-20",y:"9"});
        var $firstDiv1 = $("#chart1 svg g g.c3-axis-x g:eq(1)");$firstDiv1.find("text").attr({x:"-50",y:"10"});
        var $firstDiv1 = $("#chart1 svg g g.c3-axis-x g:eq(2)");$firstDiv1.find("text").attr({x:"-60",y:"10"});
        var $firstDiv1 = $("#chart1 svg g g.c3-axis-x g:eq(3)");$firstDiv1.find("text").attr({x:"-85",y:"5"});
        var $firstDiv1 = $("#chart1 svg g g.c3-axis-x g:eq(4)");$firstDiv1.find("text").attr({x:"-60",y:"4"});
        var $firstDiv1 = $("#chart1 svg g g.c3-axis-x g:eq(5)");$firstDiv1.find("text").attr({x:"-85",y:"8"});
        }, 300);
      };

      $scope.getMoreModelVersions= function(){

      };

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
         $scope.intentVerbs1 = [];
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
        $scope.intentVerbs1 = [];
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

      $scope.retrain1 = function(){
        if($scope.dictionarySelected1 != undefined && $scope.dictionarySelected1 != ""){
            var obj = {"_id":$scope.dictionarySelected1._id , "data":$scope.savedSentences}
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
                 $scope.intentVerbs1 = [];
                 $scope.failureRetrain = "";
                 $scope.successMsg = data.data.msg;
                 setTimeout(function(){
                   $scope.successMsg = "";
                 }, 2000);
               }
               $scope.getModelVersions($scope.selectedIntentModelObj);
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
              if($scope.dictionarySelected1 != undefined && $scope.dictionarySelected1 != ""){
                  $scope.modifyActionButton = false;
                  $scope.isTestActionSubmit = true;
                  var data = {'_id': $scope.dictionarySelected1._id, "data" : { 'word': verb}}
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

      $scope.deleteGetEntityVerb1 = function(key,index){
        var verb = $scope.testActionObjConstruct1[key][index].word;
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
        $scope.testActionObjConstruct1[key].splice(index,1);
      }

      $scope.removeMeaning1 = function(key,parent,index,data){
        setTimeout(function(){
          var indx = ($scope.testActionObjConstruct1[key][parent].meanings).indexOf(data);
          if (indx != -1)
            $scope.testActionObjConstruct1[key][parent].meanings.splice(indx,1);
        }, 500);
      }

      $scope.retrainTestAction1 = function(){
          $scope.isRetrainSubmitAction = true;
          $scope.failureRetrainAction = "";
          $scope.successMsgRetrainAction = "";
          $scope.finalActionObj={"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
          angular.forEach($scope.testActionObjConstruct1, function(obj,key){
            $scope.getActionIntent(obj,key);
          });
          console.log($scope.finalActionObj);
          var obj = {"_id": $scope.dictionarySelected1._id,"data":$scope.finalActionObj}

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
               $scope.intentVerbs1 = [];
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

      $scope.constructActionModal1 = function(){
          $scope.testActionObjConstruct1 = {"get_entity":[],"create_entity":[],"update_entity":[],"delete_entity":[],"set_value":[],"send_message":[]};
          if($scope.testActionObj.status!="failure"){
            var groups = $scope.testActionObj.get_entity.reduce(function(obj,item){
                obj[item.word] = obj[item.word] || [];
                obj[item.word].push(item);
                return obj;
            }, {});
            $scope.testActionObjConstruct1.get_entity = Object.keys(groups).map(function(key){
                return {word: key, meanings: groups[key]};
            });

            var groups = $scope.testActionObj.create_entity.reduce(function(obj,item){
                obj[item.word] = obj[item.word] || [];
                obj[item.word].push(item);
                return obj;
            }, {});
            $scope.testActionObjConstruct1.create_entity = Object.keys(groups).map(function(key){
                return {word: key, meanings: groups[key]};
            });

            var groups = $scope.testActionObj.update_entity.reduce(function(obj,item){
                obj[item.word] = obj[item.word] || [];
                obj[item.word].push(item);
                return obj;
            }, {});
            $scope.testActionObjConstruct1.update_entity = Object.keys(groups).map(function(key){
                return {word: key, meanings: groups[key]};
            });

            var groups = $scope.testActionObj.delete_entity.reduce(function(obj,item){
                obj[item.word] = obj[item.word] || [];
                obj[item.word].push(item);
                return obj;
            }, {});
            $scope.testActionObjConstruct1.delete_entity = Object.keys(groups).map(function(key){
                return {word: key, meanings: groups[key]};
            });

            var groups = $scope.testActionObj.set_value.reduce(function(obj,item){
                obj[item.word] = obj[item.word] || [];
                obj[item.word].push(item);
                return obj;
            }, {});
            $scope.testActionObjConstruct1.set_value = Object.keys(groups).map(function(key){
                return {word: key, meanings: groups[key]};
            });

            var groups = $scope.testActionObj.send_message.reduce(function(obj,item){
                obj[item.word] = obj[item.word] || [];
                obj[item.word].push(item);
                return obj;
            }, {});
            $scope.testActionObjConstruct1.send_message = Object.keys(groups).map(function(key){
                return {word: key, meanings: groups[key]};
            });
            console.log($scope.testActionObjConstruct1);

        }
        else{
        //msg:"Error in getting model file contents"
          $.UIkit.notify({
            message : $scope.testActionObj.msg,
           status  : 'danger',
           timeout : 2000,
           pos     : 'top-center'
          });

        }
      }

      $scope.addTo = function(){
        var verbDefinitionsArray = {"word":$scope.verbMeaningsArray.word,"meanings":[]};
        angular.forEach($scope.verbMeaningsArray.meanings, function(meanObj,key){
          if(meanObj.is_selected)
            verbDefinitionsArray.meanings.push(meanObj);
        });
        $scope.testActionObjConstruct1[$scope.radioSelect].push(verbDefinitionsArray);
        $scope.verb = "";
        $scope.testActionMeanings = {};
        $scope.verbMeaningsArray = {};
        $scope.modifyActionButton = false;
      }

      $scope.dragedFrom={"key":"","word":"","wordIdx":"","meaningIndex":"","data":{}};
      $scope.onDropComplete=function(data,evt,key,idx){
        if(data!=null){
          $scope.testActionObjConstruct1[key][idx].meanings.push($scope.dragedFrom.data);
          //var index = ($scope.testActionObjConstruct[$scope.dragedFrom.key][$scope.dragedFrom.wordIdx].meanings).indexOf($scope.dragedFrom.data);
          //if (index != -1)
           $scope.testActionObjConstruct1[$scope.dragedFrom.key][$scope.dragedFrom.wordIdx].meanings.splice($scope.dragedFrom.meaningIndex,1)
        }
      };
      $scope.onDragSuccess=function(data,evt,key,word,wordIdx,idx,dat){
        $scope.dragedFrom={"key":"","word":"","wordIdx":"","meaningIndex":"","data":{}};
        if(data!=null){
          $scope.dragedFrom={"key":key,"word":word,"wordIdx":wordIdx,"meaningIndex":idx,"data":dat};
        }
      };

  });
