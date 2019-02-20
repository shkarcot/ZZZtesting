(function() {
'use strict';

angular.module('console.services.identifytables')
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
  .controller('configureTableCtrl', configureTableCtrl)

    function configureTableCtrl($scope,$rootScope,ngDialog,identifyTablesServices) {
      var vm = this;
      $rootScope.currentState = 'services';
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      $scope.sess_id= $scope.loginData.sess_id;
      $scope.tableName="";
      $scope.showSaveBtn=false;
      $scope.showSpinner=false;
      vm.data=[];

      $scope.getIdentityTables=function(){
      var reqObj={"data": {"service_name": "document-microservice","configuration_field":"table_config"},
                    "trigger": "get_configuration"};
         identifyTablesServices.getIdentityTables({'sess_id':$scope.sess_id}).then(function(response){
           if(response.data.status=="success"){
            vm.data=response.data.data;
            if(response.data.data.length>0)
                $scope.showSaveBtn=true;

           }
           else{
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
        });
      };
      $scope.getIdentityTables();


      $scope.addTable=function(){
            if($scope.tableName!=""){
                vm.data.unshift({"headings":["","","","","",""],"top_keys":[],"bottom_keys":[],"table_name":$scope.tableName});
                $scope.tableName="";
                if(vm.data.length>0){
                    $scope.showSaveBtn=true;
                };
            }
            else{
                $.UIkit.notify({
                   message : "Please enter the table name.",
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
            };
      };

      $scope.addColumn = function(idx){
       vm.data[idx].headings.push("");
      };

      $scope.removeColumn = function (parentIndex,cellIndex) {
        vm.data[parentIndex].headings.splice(cellIndex, 1);
      };
      $scope.deleteTable = function (index,name) {
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +name+ "'" +' ' + 'table ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.data.splice(index, 1);
                  if(vm.data.length>0)
                    $scope.showSaveBtn=true;
                  vm.saveIdentifyTables();
              };
          }]
        });
      };


      vm.saveIdentifyTables=function(){
        console.log(vm.data);
        var reqObj={"data": {"service_name": "document-microservice",
          "configuration": {"defaults": {"table_config": vm.data},"keys": {}
          }}};

        $scope.showSpinner=true;
        identifyTablesServices.configureIdentityTable({'sess_id':$scope.sess_id,'data':reqObj}).then(function(response){
           if(response.data.status=="success"){
              $scope.showSpinner=false;
              vm.data=[];
              $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
               });
              $scope.getIdentityTables();
           }
           else{
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
        });
      };

    };
     configureTableCtrl.$inject = ["$scope", "$rootScope", "ngDialog","identifyTablesServices"];

})();