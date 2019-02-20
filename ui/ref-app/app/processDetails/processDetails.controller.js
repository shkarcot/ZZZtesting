module.exports = ['$scope','$state','$stateParams','$compile','$rootScope','$sce','$location','processDetailsServices','dashboardService',function($scope,$state,$stateParams,$compile,$rootScope,$sce,$location,processDetailsServices,dashboardService) {
	'use strict';
      var vm = this;
      var url = $location.path();
      var arr = url.split("/");
      window.scrollTo(0,0);
      $rootScope.currentState = 'dashboard';
      $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $scope.iframeHeight = window.innerHeight;
      $scope.showIframe=false;
      $rootScope.inSolution = true;
      $scope.showIframeImage=false;
      $scope.showNavigation = false;
      $scope.current_page = 1;

      vm.navigatePage = function(type){

        if(type == 'next'){
           var rec_num = $scope.filter_obj.current_record_no+1;
           if(rec_num < $scope.recentRecords.length){
              var prop = 'none';
              if($scope.recentRecords[rec_num].is_digital){
                    prop = 'digital';
              }
              $scope.filter_obj.current_record_no = rec_num;
              localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
              $state.go("app.processDetails",{id:$scope.recentRecords[rec_num].doc_id, type:prop},{reload:true})
           }
           else{
              $scope.filter_obj.page_no = $scope.filter_obj.page_no+1;
              $scope.filter_obj.current_record_no = -1;
              $scope.getDocumentsListData(type);

           }
        }
        else if(type == 'prev'){
          var rec_num = $scope.filter_obj.current_record_no-1;
          if(rec_num >= 0){
              var prop = 'none';
              if($scope.recentRecords[rec_num].is_digital){
                    prop = 'digital';
              }
              $scope.filter_obj.current_record_no = rec_num;
              localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
              $state.go("app.processDetails",{id:$scope.recentRecords[rec_num].doc_id, type:prop},{reload:true})
          }
          else{
              $scope.filter_obj.page_no = $scope.filter_obj.page_no-1;
              $scope.filter_obj.current_record_no = $scope.recentRecords.length;
              $scope.getDocumentsListData(type);

          }
        }
      }

      $scope.updateFilterObj = function(type){
          $scope.filter_obj = JSON.parse(localStorage.getItem('filterObj'));
          if($scope.filter_obj == null || $scope.filter_obj == undefined){
            $scope.showNavigation = false;
          }
          else{
            if($scope.filter_obj.hasOwnProperty('current_record_no')){
                $scope.showNavigation = true;
                $scope.recentRecords = JSON.parse(localStorage.getItem('recentRecords'));
                if( $scope.recentRecords == null ||  $scope.recentRecords == undefined){
                }else{
                  $scope.total_records =  $scope.filter_obj.totalRecords;
                  $scope.no_of_records =  (($scope.filter_obj.page_no-1) *$scope.filter_obj.no_of_recs) + $scope.filter_obj.current_record_no+1;
                }
            }
            else{
              $scope.showNavigation = false;
            }

          }

          vm.navigatePage(type);
      };

      $scope.updateFilterObj('none');



      if($stateParams.type.toLowerCase() != "digital"){
          vm.getGroups = function () {
              processDetailsServices.getListOfGroups($stateParams.id, vm.sess_id).then(function (data) {
                   if (data.data.status == "success") {
                       $scope.showlistDetails = true;
                       $scope.processListDetails = data.data.data;
                       $scope.no_of_pages = data.data.data.data.no_of_pages;
                       $scope.pagesInfo = data.data.data.data.pages;
                       $scope.volume = $scope.processListDetails.volume;
                       $scope.entity = $scope.processListDetails.entity;
                       $scope.fieldsDataConfig = $scope.processListDetails.config.fields_data;
                       $scope.recordDataConfig = $scope.processListDetails.config.record_data;
                       $scope.recordData = $scope.processListDetails.data;
                       vm.changeDocumentInfo(1);
                   }
                   else{
                       $.UIkit.notify({
                          message: data.data.msg,
                          status: 'danger',
                          timeout: 3000,
                          pos: 'top-center'
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
          vm.getGroups();

          vm.changeDocumentInfo = function (page) {

              $scope.current_page = page;
              processDetailsServices.postProcessList($stateParams.id,$scope.current_page, vm.sess_id).then(function (data) {

                  if (data.data.status == "success") {
                      // $scope.showlistDetails = true;
                      // $scope.processListDetails = data.data.data;
                      // $scope.fieldsDataConfig = $scope.processListDetails.config.fields_data;
                      $scope.page_details_Info = data.data.data.elements;
                      $scope.tablesData = [];
                      $scope.fieldsData = [];
                      angular.forEach($scope.page_details_Info,function (value,key) {
                          if(value.type == 'table'){
                              $scope.tablesData.push(value);
                          }
                          else{
                               $scope.fieldsData.push(value);
                          }
                      })

                      if ($scope.tablesData.length > 0) {
                          $scope.tableDataList = $scope.tablesData;
                      }

                      // $scope.recordDataConfig = $scope.processListDetails.config.record_data;
                      // $scope.recordData = $scope.processListDetails.data;
                  }
                  else {
                      $.UIkit.notify({
                          message: data.data.msg,
                          status: 'danger',
                          timeout: 3000,
                          pos: 'top-center'
                      });
                  }
              }, function (err) {
                  console.log(err)
                  $.UIkit.notify({
                      message: "Internal server error",
                      status: 'warning',
                      timeout: 3000,
                      pos: 'top-center'
                  });
              });
          };

        vm.changePageNum = function (type) {
            if(type == 'next')
                $scope.current_page++;
            else
                $scope.current_page--;

            vm.changeDocumentInfo($scope.current_page);

        };

        vm.keyEnter = function (event) {
            if(event.which === 13) {
               if($scope.current_page<=$scope.no_of_pages) {
                   if($scope.current_page>0)
                     vm.changeDocumentInfo($scope.current_page);
                   else{
                                $.UIkit.notify({
                                     message : 'Please Enter  Valid Page number',
                                     status  : 'warning',
                                     timeout : 3000,
                                     pos     : 'top-center'
                                });
                   }
               }
               else{
                                $.UIkit.notify({
                                     message : 'Please Enter Page number less than no.of pages',
                                     status  : 'warning',
                                     timeout : 3000,
                                     pos     : 'top-center'
                                });
               }
            }
        };








          $scope.backtolist= function(){
             $state.go("app.dashboard")
          };

          $scope.backtoDetails= function(){
             $scope.showIframe = false;
             $scope.showIframeImage = false;
             $scope.showEmail = false
             $scope.showlistDetails=true;
          };



          $scope.iframeUrl="";





          $scope.displayImage = function(value){

              $scope.showlistDetails=false;
              var str = $scope.pagesInfo[$scope.current_page-1].file_path;
              var last = str.substring(str.lastIndexOf(".") + 1, str.length);
              var last ='png'
              if(last == 'pdf'){
                $scope.iframeUrl = $sce.trustAsResourceUrl(value);
                $scope.showIframe=true;
                $scope.showIframeImage=false;
              }
              else{
                $scope.iframeUrl = $scope.pagesInfo[$scope.current_page-1].file_path;
                $scope.showIframe=false;
                $scope.showIframeImage=true;
              }


          };

          $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
          $scope.download =function(){
            var downloadUrl = $scope.url+'/api/download/json/'+$scope.processListDetails.data.doc_id+'/';
            window.location.assign(downloadUrl);
          };
       }
       else{
          processDetailsServices.postProcessList($stateParams.id,vm.sess_id).then(function(data){
               if(data.data.status=="success"){
                  vm.documentType = $stateParams.type.toLowerCase();
                  $scope.recordDataConfig = data.data.data.config.record_data;
                  $scope.recordData =data.data.data.data;
                  vm.digitalDocumentData =angular.copy(data.data.data.data.elements.digital);
                  vm.heightOfWindow = $(window).height()-70;
                  vm.heightOfWindow1 = $(window).height()-120;
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

          $scope.emailAttachments = function(htmldata){
              return $sce.trustAsHtml(htmldata);
          }

       }



      $scope.getDocumentsListData = function(type){

         dashboardService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':$scope.filter_obj}}).then(function(data){
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
                          //$scope.updateFilterObj(type);
                          vm.navigatePage(type);

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





}];