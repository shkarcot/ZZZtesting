module.exports = ['$scope','$state','$compile','$rootScope','$sce','$location','documentsListService','newDashboardService', function($scope,$state,$compile,$rootScope,$sce,$location,documentsListService,newDashboardService) {
	  'use strict';

	  var vm = this;
      var url = $location.path();
      var arr = url.split("/");
      window.scrollTo(0,0);
      $rootScope.currentState = 'dashboard';
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $rootScope.inSolution = true;
      $scope.showlist=true;
      $scope.processListDataList = [];
      $scope.filter_obj ={'page_no':1,'no_of_recs':8,'sort_by': 'ts', 'order_by': false,'totalRecords':0,'doc_state':'processed'};

    $scope.date = {
        startDate: moment().subtract(1, "days"),
        endDate: moment()
    };
    $scope.date2 = {
        startDate: moment().subtract(1, "days"),
        endDate: moment()
    };

    vm.getDashboardData = function(){
        var reqObj = {"chart_filter":"wtd","date_range":{"start_date":"","end_date":""},"charts":["tab_data"]}
        newDashboardService.getChartData({'sess_id':vm.sess_id,data: reqObj}).then(function(data){
               if(data.data.status=="success"){
                     vm.tabData = data.data.data.tab_data;
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
    vm.getDashboardData();

    $scope.opts = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "Použít",
            fromLabel: "Od",
            toLabel: "Do",
            cancelLabel: 'Zrušit',
            customRangeLabel: 'Vlastní rozsah',
            daysOfWeek: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
            firstDay: 1,
            monthNames: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září',
                'Říjen', 'Listopad', 'Prosinec'
            ]
        },
        ranges: {
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()]
        }
    };
    $scope.setStartDate = function () {
        $scope.date.startDate = moment().subtract(4, "days");
    };
    $scope.setRange = function () {
        $scope.date = {
            startDate: moment().subtract(5, "days"),
            endDate: moment()
        };
    };
    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        console.log('New date set: ', newDate);
    }, false);

      var filterObj = JSON.parse(localStorage.getItem('filterObj'));
      var stateParam = localStorage.getItem('state');
         if(filterObj == null || filterObj == undefined){
            $scope.filter_obj = $scope.filter_obj;
            $scope.filter_obj.doc_state = stateParam;
            $scope.filter_obj.template_name = 'All Document Types';
            $scope.filter_obj.search_string = '';
         }else{
           $scope.filter_obj = filterObj;
           $scope.filter_obj.doc_state = stateParam;
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

         documentsListService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':reqObj}}).then(function(data){
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
            $state.go("app.processDetails",{id:obj.doc_id, type:prop})
          else{
            if(obj.child_documents.length>0){
              if(!obj.isExpanded){
                  obj.spinner = true;
                  documentsListService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':{'doc_id':obj.doc_id,'child_documents':true}}}).then(function(data){
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
             $state.go("app.processDetails",{id:obj.doc_id, type:prop})
            }
          }
        //}
      };

      $scope.stateChange = function(obj,type,index){
          $scope.filter_obj.current_record_no = index;
          localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
          if(obj.hasOwnProperty("is_digital"))
                var prop = "none";
          else if(obj.mime_type == "email")
                var prop = obj.mime_type;
          else
                var prop = "none";
          if(type=='child')
                $state.go("app.review",{id:obj.doc_id, type:prop})
          else{
                if(obj.child_documents.length>0 && obj.mime_type != "email"){
                      if(!obj.isExpanded){
                          obj.spinner = true;
                          documentsListService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':{'doc_id':obj.doc_id,'child_documents':true}}}).then(function(data){
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
      };

      $scope.getProcessListDetails =function(obj,type,index){
            if($scope.filter_obj.doc_state == 'processing'){
            }
            else if($scope.filter_obj.doc_state == 'classified'){
                $state.go("app.multiPage",{id:obj.doc_id})
            }
            else if($scope.filter_obj.doc_state == 'extracted'){
                $state.go("app.extraction",{id:obj.doc_id,type:'none'})
            }
            else if($scope.filter_obj.doc_state == 'entity_linked'){
                $state.go("app.entityLinking",{id:obj.doc_id,type:'none'})
            }

            else{
                if(obj.extn != "email"){
                    if(obj.is_failed==undefined)
                       $scope.stateChange(obj,type,index);
                    else{
                       if(!obj.is_failed)
                         $scope.stateChange(obj,type,index);
                    }
                }
                else{
                    $state.go("app.review",{id:obj.doc_id, type:"email"})
                }
            }

      };

      $scope.pageChanged = function(newPage) {
        $scope.filter_obj.page_no = newPage;
        $scope.getDocumentsList();
      };

    $scope.sort = {
        column: 'updated_ts',
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
        localStorage.setItem('state',type);
        $scope.getDocumentsList();
    };

    $scope.getDocumentTypes = function () {
        documentsListService.getDocumentTypesList({'sess_id':vm.sess_id}).then(function (data) {
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
    $scope.goToClassification = function (row) {
        $state.go('app.multiPage',{id:row.doc_id});
    };

    var chart = c3.generate({
        data: {
        columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
                ]
            }
    });
    $scope.filter_obj.doc_state = localStorage.getItem('state');
    vm.showReviewBtn = [];
    vm.showReviewBtnChild = [];

    $scope.highlightBtn = function(index){
        vm.showReviewBtn = [];
        vm.showReviewBtn[index] = true;
    };

    $scope.removeBtn = function(){
        vm.showReviewBtn = [];
    };

    $scope.highlightBtnChild = function(index){
        vm.showReviewBtnChild = [];
        vm.showReviewBtnChild[index] = true;
    };

    $scope.removeBtnChild = function(){
        vm.showReviewBtnChild = [];
    };

    $scope.monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    $scope.formatDateInList = function(ts){
       var date = new Date();
       var tsDate = new Date(ts);
       var currentDate = date.getMonth() + "-" + date.getDate() + "-" + date.getYear();
       var yestrdyDate = date.getMonth() + "-" + (date.getDate()-1) + "-" + date.getYear();
       var updatedTs = tsDate.getMonth() + "-" + tsDate.getDate() + "-" + tsDate.getYear();
       if(currentDate == updatedTs){
           if(tsDate.getHours()<12){
               return tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "AM";
           }
           else{
               if(tsDate.getHours()==12)
                   return tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "PM";
               else
                   return (tsDate.getHours()-12)+':'+tsDate.getMinutes()+" "+ "PM";
           }
       }
       else if(yestrdyDate == updatedTs){
           if(tsDate.getHours()<12)
               return 'Yesterday @ '+tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "AM";
           else{
               if(tsDate.getHours()==12)
                   return 'Yesterday @ '+tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "PM";
               else
                   return 'Yesterday @ '+(tsDate.getHours()-12)+':'+tsDate.getMinutes()+" "+ "PM";
           }
       }
       else{
           if(tsDate.getHours()<12)
               return tsDate.getDate()+' '+$scope.monthShort[tsDate.getMonth()]+', '+tsDate.getHours()+' '+'AM';
           else{
               if(tsDate.getHours()==12)
                   return tsDate.getDate()+' '+$scope.monthShort[tsDate.getMonth()]+', '+tsDate.getHours()+' '+'PM';
               else
                   return tsDate.getDate()+' '+$scope.monthShort[tsDate.getMonth()]+', '+(tsDate.getHours()-12)+' '+'PM';
           }
       }
    };

}];