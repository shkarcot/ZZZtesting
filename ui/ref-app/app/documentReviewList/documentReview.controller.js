module.exports = ['$scope','$state','$compile','$rootScope','$location','$sce','documentReviewService','dashboardService',function($scope,$state,$compile,$rootScope,$location,$sce,documentReviewService,dashboardService) {
	'use strict';
      var vm = this;
      var url = $location.path();
      var arr = url.split("/");
      window.scrollTo(0,0);
      $scope.selectedObj={};
      $scope.selectedObj.val='processed'
      $rootScope.currentState = 'documentReview';
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $rootScope.inSolution = true;
      $scope.showlist=true;
      $scope.processListDataList = [];
      $scope.filter_obj ={'page_no':1,'no_of_recs':8,'sort_by': 'ts', 'order_by': false,'totalRecords':0};

      var filterObj = JSON.parse(localStorage.getItem('filterObj'));
         if(filterObj == null || filterObj == undefined){
            $scope.filter_obj = $scope.filter_obj;
            $scope.filter_obj.doc_state = 'processed';
            $scope.filter_obj.template_name = 'All Document Types';
            $scope.filter_obj.search_string = '';
         }else{
           $scope.filter_obj = filterObj;
         }
      $scope.getDocumentsList = function(){
         var reqObj = angular.copy($scope.filter_obj);
             delete reqObj.totalRecords;
             if(reqObj.hasOwnProperty('current_record_no')){
               delete reqObj.current_record_no;
             }
             if(reqObj.hasOwnProperty('template_name')){
               if(reqObj.template_name == 'All Document Types')
                 delete reqObj.template_name;
             }
             if(reqObj.hasOwnProperty('search_string')){
               if(reqObj.search_string == '')
                 delete reqObj.search_string;
             }

         dashboardService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':reqObj}}).then(function(data){
                       if(data.data.status=="success"){
                          $scope.processListData=data.data.data;
                          $scope.processListDataList = $scope.processListData.data;
                          $scope.filter_obj.totalRecords = data.data.data.total_count;
                          $scope.recentRecords = [];
                          angular.forEach($scope.processListDataList,function(value,key){
                             var digital = false
                            if(value.hasOwnProperty('is_digital'))
                               digital = true;
                            $scope.recentRecords.push({'doc_id':value.doc_id,'mime_type':value.mime_type,'is_digital':digital});
                          });
                          localStorage.setItem('recentRecords',JSON.stringify($scope.recentRecords))
                          localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
                       }
                       else{
                         $.UIkit.notify({
                                   message : data.data.msg,
                                   status  : 'danger',
                                   timeout : 3000,
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

      $scope.getDocumentsList();


      $scope.getProcessListDetails =function(obj,type,index){
        //if((obj['Status'].value).toLowerCase() !='pending'){
          $scope.filter_obj.current_record_no = index;
          localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
          if(obj.hasOwnProperty("is_digital"))
             var prop = "none";
          else
             var prop = "none"
          if(type=='child')
            $state.go("app.review",{id:obj.doc_id, type:prop})
          else{
            if(obj.child_documents.length>0 && obj.mime_type != "email"){
              if(!obj.isExpanded){
                  obj.spinner = true;
                  dashboardService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':{'doc_id':obj.doc_id,'child_documents':true}}}).then(function(data){
                       if(data.data.status=="success"){
                          $scope.processListData=data.data.data;
                          obj.child_documents = $scope.processListData.data;
                          obj.isExpanded = !obj.isExpanded;
                          obj.spinner = false;
                       }
                       else{
                         $.UIkit.notify({
                                   message : data.data.msg,
                                   status  : 'danger',
                                   timeout : 3000,
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
              }
              else{
                obj.isExpanded = !obj.isExpanded
              }

            }
            else{
             $state.go("app.review",{id:obj.doc_id, type:prop})
            }
          }
        //}

      };

      $scope.getProcessListDetailsForEmail = function(obj,type,index,e){
          e.stopPropagation();
         //if((obj['Status'].value).toLowerCase() !='pending'){
          $scope.filter_obj.current_record_no = index;
          localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
          if(obj.hasOwnProperty("is_digital"))
             var prop = "none";
          else
             var prop = "none"
          if(type=='child')
            $state.go("app.review",{id:obj.doc_id, type:prop})
          else{
            if(obj.child_documents.length>0){
              if(!obj.isExpanded){
                  obj.spinner = true;
                  dashboardService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':{'doc_id':obj.doc_id,'child_documents':true}}}).then(function(data){
                       if(data.data.status=="success"){
                          $scope.processListData=data.data.data;
                          obj.child_documents = $scope.processListData.data;
                          obj.isExpanded = !obj.isExpanded;
                          obj.spinner = false;
                       }
                       else{
                         $.UIkit.notify({
                                   message : data.data.msg,
                                   status  : 'danger',
                                   timeout : 3000,
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
              }
              else{
                obj.isExpanded = !obj.isExpanded
              }

            }
            else{
             $state.go("app.review",{id:obj.doc_id, type:prop})
            }
          }
        //}
      };

      $scope.pageChanged = function(newPage) {
        $scope.filter_obj.page_no = newPage;
        $scope.getDocumentsList();
      };

       $scope.sort = {
        column: 'ts',
        descending: false
    };


    $scope.selectedCls = function(column) {
        return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
    };

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }

        $scope.filter_obj.sort_by = column;
        $scope.filter_obj.order_by = sort.descending;
        if(column == 'mime_type'){
          $scope.filter_obj.sort_by = 'metadata.mime_type'
        }
        $scope.getDocumentsList();

    };
    $scope.changeDocState = function(type){
        $scope.filter_obj.doc_state = type;
        $scope.getDocumentsList();
    };

    $scope.getDocumentTypes = function () {
        dashboardService.getDocumentTypesList({'sess_id':vm.sess_id}).then(function (data) {
            if(data.data.status=='success'){
                $scope.listOfDocumentTypes = data.data.doc_types;
                $scope.listOfDocumentTypes.unshift({'template_name':'All Document Types'});
            }
            else{
                $.UIkit.notify({
                                   message : data.data.msg,
                                   status  : 'danger',
                                   timeout : 3000,
                                   pos     : 'top-center'
                });
            }
        },function (err) {
            $.UIkit.notify({
                           message : "Internal server error",
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
            });
        })
    };

    $scope.getDocumentTypes();

    $scope.keyEnter = function (event) {
       if(event.which === 13) {
           $scope.getDocumentsList();
       }
       if($scope.filter_obj.search_string == '')
          $scope.getDocumentsList();

    };

    $scope.clearSearch = function () {
        $scope.filter_obj.search_string = '';
        $scope.getDocumentsList();
    };

}];