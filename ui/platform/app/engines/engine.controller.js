module.exports = ['$scope','$state','$rootScope','$stateParams','ngDialog','platformService','rulesService','config',
function($scope,$state,$rootScope,$stateParams,ngDialog,platformService,rulesService,config) {
	'use strict';
      $rootScope.currentState = 'engine';
      var engine_name=localStorage.getItem("engineName");
      $scope.engineName=engine_name;
      $scope.config = config;
      $state.current.breadcrumb.subState=$scope.engineName;
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.selectActive={};
      $scope.selectActive[$scope.engineName]="active";
      if(engine_name=="Service Catalog"){
        $state.go("app.engineslist.ServiceCatalog");
      }
      else
        $state.go("app.engineslist."+engine_name);
      $scope.setActive =function(type){
        if(type=="NLP" || type=="Insights" || type=="Extraction" || type=="Service Catalog"){
          $scope.selectActive={};
          $scope.selectActive[type]="active";
        }
      };

      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      var vm = this;

      $scope.editShow = true;
      $scope.loadUrlShow = true;
      $scope.checkValue = [];
      $scope.valEnable = [];
      $scope.titleColor = [];
      $scope.colorClass = [];
      $scope.dash = true;
      $scope.dictionaryCollection = [];
      $rootScope.serverType = 'nlp';
      //console.log($scope.trainingSet);
      //console.log($scope.valEnable);

      $scope.nlpServiceData = function(){
        platformService.getNlp({'sess_id':$scope.loginData.sess_id}).then(function(response){
            console.log(response.data);
            if(response.data != [] || response.data != null || response.data != undefined){
               $scope.nlpServiceDash = response.data;
            }
            else{
               $scope.configureShow = true;
            }

        });
      };
      $scope.nlpServiceData();

      $scope.color = function(index){
        $scope.checkStyle = {'pointer-events':'none'};
        if(index){
          return  'circleBase enableText enableCircle';
        }
        else{
          return 'circleBase disableText disableCircle';
        }
      };
      $scope.color2 = function(index){
        $scope.checkStyle = {'pointer-events':'none'};
        if(index){
          return  'enableText';
        }
        else{
          return 'disableText';
        }
      };

      $scope.nlpServiceSave = function(){
         $scope.loadUrlShow = false;
         $scope.editShow = false;
         $scope.checkStyle = {'pointer-events':'none'};
         console.log($scope.checkValue);
         for(var i=0;i<$scope.checkValue.length;i++){
            if($scope.checkValue[i]){
               $scope.titleColor[i]="blackCls";
            }
            else{
               $scope.titleColor[i]="redCls";
            }
         }
      };

      $scope.toggleFunc = function(toggle,index){
          if(toggle){
             $scope.titleColor[index]="blackCls";
          }
          else{
             $scope.titleColor[index]="redCls";
          }
      };

      $scope.checkStatus = function(value){
          if(value=="true"){
             return true;
          }
          else{
             return false;
          }
      };

      $scope.bindKey = function(obj){
         angular.forEach(obj,function(value,key){
             if(key != "is_enabled" && key != "$$hashKey"){
                $scope.bindVal = key;
             }
         });
         return $scope.bindVal;
      };

      $scope.bindCheck = function(obj){
         angular.forEach(obj,function(value,key){
             if(key == "is_enabled"){
                $scope.bindCheck = value;
             }
         });
         return $scope.bindCheck;
      };

      // test a intent model
      $scope.savedSentences = [];

      rulesService.getDictionaryList({"server_type":$rootScope.serverType,"sess_id":$scope.loginData.sess_id}).then(function(response){
        $scope.trainingSet=response.data.data;
        angular.forEach($scope.trainingSet,function(value,key){
           if(value.type=="Dictionary"){
              $scope.dictionaryCollection.push(value);
           }
        });
      });

      $scope.sendSentence = function(sentence){
          if(sentence == "" || sentence == undefined){
             $scope.errorMsg = "Please enter the sentence";
          }
          else{
              var senArray = [];
              senArray.push(sentence);
              platformService.sentence(senArray,$scope.loginData.sess_id).then(function(data){
                 if(data.data == null){
                 }
                 else{
                   console.log(data.data);
                   $scope.errorMsg = "";
                   $scope.verb_deps = data.data.result.result.metadata[0].training_set[0].verb_deps;
                 }
              }, function(){});
        }
      };

      $scope.dictionarySelect = function(object){
        $scope.dictionarySelected = object;
      };

      $scope.checkChange = function(index,value){
        for(var i=0;i<$scope.verb_deps.length;i++){
          if(index == i){
             $scope.verb_deps[i].is_intent_verb = value;
             if(value==true){
               $scope.savedSentences.push({"sentence":$scope.sentence,verb_deps:$scope.verb_deps});
               $scope.sentence = '';
               $scope.verb_deps = [];
             }
          }
          else{
             $scope.verb_deps[i].is_intent_verb = false;
          }
        }
      };

      $scope.clearSentence = function(){
         $scope.sentence = '';
         $scope.verb_deps = [];
      };

      $scope.clearVerbs = function(){
        for(var i=0;i<$scope.verb_deps.length;i++){
           $scope.verb_deps[i].is_intent_verb = false;
        }
      };

      $scope.removeSentence = function(index){
        $scope.savedSentences.splice(index,1);
      };




}];
