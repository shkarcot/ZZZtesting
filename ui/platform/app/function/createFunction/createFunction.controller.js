module.exports = ['$scope', '$state', '$rootScope', 'createFunctionService', '$sce',
function($scope, $state,$rootScope,createFunctionService,$sce) {
	'use strict';
	  var vm = this;
	  $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      var userData=localStorage.getItem('userInfo');
      userData=JSON.parse(userData);
      vm.sess_id = userData.sess_id;
	  vm.createFunctionObj = {};
	  vm.createFunctionObj.description = '';

	  vm.saveFunction = function(){
            var requestObj = {
                "function_name": vm.createFunctionObj.name,
                "function_desc": vm.createFunctionObj.description,
                "function_type": vm.createFunctionObj.type
            }
            $scope.enableFunctionLoader = true;
            createFunctionService.createFunction({'sess_id':vm.sess_id,"data":requestObj}).then(function(response){
                if(response.data.status=="success"){
                    $scope.enableFunctionLoader = false;
                    $scope.functCreateResp = response.data.data;
                    $scope.jupiterUrl = $sce.trustAsResourceUrl($scope.functCreateResp.jupyter_url);
                    $scope.jupiterNotebook = true;
                }
                else{
                    vm.createFunctionObj = {};
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableFunctionLoader = false;
                }
            },function(err){
                vm.createFunctionObj = {};
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableFunctionLoader = false;
            });
      };

      vm.saveJupiter = function(){
            var reqObj={'function_name':$scope.functCreateResp.function_name,"function_version":$scope.functCreateResp.version};
            $scope.enableJupiterLoader = true;
            createFunctionService.postJupiter({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                if(response.data.status=="success"){
                    $scope.enableJupiterLoader = false;
                    $state.go("app.functionDetail", {"name": $scope.functCreateResp.function_name});
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableJupiterLoader = false;
                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableJupiterLoader = false;
            });
      };

}];