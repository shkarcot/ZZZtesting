module.exports = ['$scope', '$state', '$rootScope','functionService',
function($scope, $state,$rootScope,functionService) {
	'use strict';
	  var vm = this;
	  $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      var userData=localStorage.getItem('userInfo');
      userData=JSON.parse(userData);
      vm.sess_id = userData.sess_id;
      vm.searchFilter = "";
      $scope.filter_obj ={"page_no": 1, "no_of_recs": 8, "sort_by":"created_ts", "order_by":false};
      $scope.filter_obj.totalRecords = 8;

      vm.getAllFunctions = function(){
            var obj = {'searched_text':vm.searchFilter, 'filter_obj':$scope.filter_obj}
            functionService.getFunctions({'sess_id':vm.sess_id, "data": obj}).then(function(response){
                if(response.data.status=="success"){
                    vm.functionsList = response.data.data;
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
            },function(err){
                console.log("error----"+err.error);
            });
      };

      vm.getAllFunctions();

      $scope.pageChanged = function (page) {
            $scope.filter_obj.page_no = page;
            vm.getAllFunctions();
      };

      vm.goToFunctionDetail = function(name){
            $state.go("app.functionDetail", {"name": name});
      };

      vm.setActiveToFunction = function(obj){
            var reqObj={'function_name':obj.function_name,'is_active': obj.is_active};
            functionService.enableFunction({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
                if(response.data.status=="success"){
                    vm.getAllFunctions();
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });

                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            });
      };


}];