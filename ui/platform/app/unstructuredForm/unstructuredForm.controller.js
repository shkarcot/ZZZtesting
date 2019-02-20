module.exports = ['$scope', '$sce','$state', '$rootScope', '$location', 'ngDialog', 'documentService', function($scope,$sce, $state, $rootScope, $location, ngDialog, documentService) {
	'use strict';
	var vm = this;
     $rootScope.currentState = 'unknownFormat';
     $scope.createTemplate = function(){
        $state.go('app.createUnStructuredForm',{name:'',id:"new"})
     };
     $scope.filter_obj ={"page_no": 1, "no_of_recs": 100, "sort_by": "created_ts","template_type":"unknown"};
     vm.getDocumentList = function(){
           documentService.getDocumentsUnknown(vm.sess_id,$scope.filter_obj).then(function(resp){
              console.log(resp);
              if(resp.data.status=='success'){
                vm.totalRecords = resp.data.total_count;
                $scope.filter_obj.totalRecords = vm.totalRecords;
                vm.documentsList=resp.data.data;
              }
              else{
                $.UIkit.notify({
                         message : resp.data.msg,
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                });
              }

           },function(err){
               console.log(err)
               $.UIkit.notify({
                       message : "Internal server error",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
               });
           });
     };

     $scope.goToDetails = function(list){
         $state.go('app.createUnStructuredForm',{name:list.template_name,id:list.template_id})
     };

     $scope.deleteRecord = function(obj){

          ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +obj.template_name+ "'" +' ' + 'Template ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                documentService.removeTemplate(vm.sess_id,{'template_id':obj.template_id,"is_deleted": true}).then(function(resp){
                  console.log(resp);

                  if(angular.equals(resp.data.status,'success')){
                      vm.getDocumentList();
                      $.UIkit.notify({
                             message : resp.data.msg,
                             status  : 'success',
                             timeout : 2000,
                             pos     : 'top-center'
                      });
                  }
                  else{
                    $.UIkit.notify({
                             message : resp.data.msg,
                             status  : 'danger',
                             timeout : 2000,
                             pos     : 'top-center'
                    });
                  }
                },function(err){
                   console.log(err)
                   vm.isDisable = false;
                   $.UIkit.notify({
                           message : "Internal server error",
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                }
                );

              }
          }]
          });

     };

     vm.getDocumentList();

}];
