module.exports = ['$scope', '$state', '$rootScope', 'solutionService','config',
function($scope, $state, $rootScope, solutionService,config) {
	'use strict';
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $rootScope.currentState = 'engines';
      $scope.config = config;

      $scope.gotoEngine=function(state,engine){
        if(engine=="NLP"||engine=="Insights"||engine=="Extraction"||engine=="Service Catalog"){
          localStorage.setItem("engineName",engine);
          if(engine=="Service Catalog")
            $state.go(state,{"id":'ServiceCatalog'});
          else
            $state.go(state,{"id":engine});

        }
      };

      /*$scope.gotoEngine=function(state,engine){
        if(engine=="NLP"||engine=="Insights"||engine=="Extraction"){
          localStorage.setItem("engineName",engine);
          var subState="";
          if(engine=="NLP"){subState='nlp';}
          else if(engine=="Insights"){subState='insight';}
          else if(engine=="Extraction"){subState='extraction';}
          $state.go(state+'.'+subState,{"id":engine});
        }
      };*/

      $scope.engineData=[
        {
          "title":"NLP",
          "icon_url":"",
          "description":"Detect POS, named entities, domain-specific entities, intent, and sentiment from your text. Configure processor to use custom dictionaries, ontologies and training sets."
        },
        {
        "title":"Context",
          "icon_url":"",
          "description":"Extracts, enriches and maintains contextual information of entities around location, time, weather, user device."
        },
        {
        "title":"Learning",
          "icon_url":"",
          "description":"Intelligence engine providing a rich assortment of models and ensembles abstracted to be used across the platform."
        },
        {
        "title":"Insights",
          "icon_url":"",
          "description":"Derives insights based on feedback and actions taken as well as context, preferences, and timing. Generate insights for the user automatically or on user request."
        },
        {
        "title":"Service Catalog",
          "icon_url":"",
          "description":"Derives insights based on feedback and actions taken as well as context, preferences, and timing. Generate insights for the user automatically or on user request."
        },
        {
        "title":"Actions",
          "icon_url":"",
          "description":"Processes and learns user feedback and actions."
        },
        {
        "title":"Extraction",
          "icon_url":"",
          "description":"Provides an ability to extract content from images and digital documents. "
        },
        {
        "title":"Outcomes",
          "icon_url":"",
          "description":"Provides a way to identify the desired end state so that actions taken along the way can be correlated to yielding the desired outcome. "
        },
        {
        "title":"Notifications",
          "icon_url":"",
          "description":"Data packaging, optimally formatted for relevant channel and delivery system for the platform to send data across multiple interfaces like app messages, email, sms and notifications."
        },
        {
        "title":"Scheduling",
          "icon_url":"",
          "description":"Define regularly scheduled units of execution to trigger other time based jobs."
        }
      ];

      $scope.geticon =function(type){
        if(type=="NLP")
        return "engine-icon-nlp";
        else if(type=="Context")
        return "engine-icon-context";
        else if(type=="Learning")
        return "engine-icon-learning";
        else if(type=="Insights")
        return "engine-icon-engineinsights";
        else if(type=="ServiceCatalog")
        return "engine-icon-engineinsights";
        else if(type=="Actions")
        return "engine-icon-actions";
        else if(type=="Outcomes")
        return "engine-icon-outcomes";
        else if(type=="Notifications")
        return "engine-icon-notification";
        else if(type=="Scheduling")
        return "engine-icon-scheduling";
        else if(type=="Extraction")
        return "engine-icon-image-process";
      };



}];