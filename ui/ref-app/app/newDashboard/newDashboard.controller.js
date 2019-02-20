module.exports = ['$scope','$state','$compile','$timeout', '$rootScope','$sce','$location','newDashboardService', function($scope,$state,$compile,$timeout,$rootScope,$sce,$location,newDashboardService) {
	  'use strict';

	  var vm = this;
      var url = $location.path();
      var arr = url.split("/");
      window.scrollTo(0,0);
      $rootScope.currentState = 'newDashboard';
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $scope.date = {
       startDate: moment().subtract(1, "days"),
       endDate: moment()
     };
     $scope.date1 = {
       startDate: moment().subtract(1, "days"),
       endDate: moment()
     };
     $scope.date2 = {
       startDate: moment().subtract(1, "days"),
       endDate: moment()
     };

     vm.cardLength = 4;
     $('.carousel').carousel({
        interval: false
    });

     var chart1 = c3.generate({
        bindto: "#chart1",
        data: {
            columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
            ]
        }
     });

     var chart2 = c3.generate({
        bindto: "#chart2",
        data: {
            columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
            ]
        }
     });

    vm.generateGraph = function(){
        var chart = c3.generate({
            bindto: "#chart",
            data: {
                x : 'x',
                columns: vm.columnValues,
                colors: vm.colorKeys
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 90,
                        multiline: false
                    }
                }
            }
        });
    };


    vm.callGenerateDocumentGraph = function(data){
        vm.graphDataForStats = data.data.data.graph.document_summary.stats;
        vm.graphValues = data.data.data.graph.document_summary.graph;
        vm.columnValues = [];
        vm.colorKeys = {};

        angular.forEach(vm.graphValues,function(value,key){
            if(key=="labels"){
                value.unshift("x");
                vm.columnValues.push(value);
                console.log(value);
            }
            else{

                if(key=="processed"){
                    value.unshift('Post Processing');
                    vm.colorKeys['Post Processing'] = "#94c856";
                }
                if(key=="processing"){
                    value.unshift('Processing');
                    vm.colorKeys['Processing'] = "#f7c36b";
                }
                if(key=="reviewed"){
                    value.unshift('Reviewed');
                    vm.colorKeys['Reviewed'] = "#53b3fc";
                }
                if(key=="failed"){
                    value.unshift('Error');
                    vm.colorKeys['Error'] = "#df5162";
                }
                vm.columnValues.push(value);
            }
        });
        vm.generateGraph();
    };

    vm.getDashboardData = function(type){
        newDashboardService.getChartData({'sess_id':vm.sess_id,data: vm.filterObj}).then(function(data){
               if(data.data.status=="success"){
                    if(type == "all"){
                        vm.tabData = data.data.data.tab_data;
                        vm.individualData = [];
                        for(var i=0;i<vm.tabData.length/vm.cardLength;i++){
                            vm.individualData[i] = [];
                        };
                        for(var i=0;i<vm.tabData.length;i++){
                            for(var j=0;j<vm.individualData.length;j++){
                               if(vm.individualData[j].length < vm.cardLength){
                                     vm.individualData[j].push(vm.tabData[i]);
                                     break;
                               }
                            }
                        }
                        console.log(vm.individualData);
                        vm.callGenerateDocumentGraph(data);
                    }
                    else if(type == "documentChart"){
                        vm.callGenerateDocumentGraph(data);
                    }
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
    vm.filterObj = {"chart_filter":"wtd","date_range":{"start_date":"","end_date":""},"charts":["tab_data","document"]};
    vm.getDashboardData("all");
    $scope.activeDate = [];
    $scope.activeDate[0] = "activeDateCss";

    $scope.filterGraphWithDate = function(type,index){
        $scope.activeDate = [];
        $scope.activeDate[index] = "activeDateCss";
        vm.filterObj = {"chart_filter":type,"charts":["document"]}
        vm.getDashboardData("documentChart");
    };

     $scope.convertDate = function (date) {
         var date = new Date(date);
         var year = date.getFullYear();
         var month = date.getMonth() + 1;
         var day = date.getDate();
         var hour = date.getHours();
         var minute = date.getMinutes();
         var sec = date.getSeconds();
         if(month<10){
           month = '0'+month;
         }
         if(day<10){
           day = '0'+day;
         }
         var format = year+'-'+month+'-'+day;
         return format;

     };

    $scope.filterWithDocumentDate = function(){
//        $scope.date = {
//           startDate: moment().subtract(1, "days"),
//           endDate: moment()
//        };

        $scope.activeDate = [];
        vm.filterObj = {"date_range":{"start_date":$scope.convertDate($scope.date.startDate),"end_date":$scope.convertDate($scope.date.endDate)},"charts":["document"],"chart_filter":"custom"};
        vm.getDashboardData("documentChart");
        console.log("data"+JSON.stringify($scope.date));
    };

    vm.documentDashboard = function(param){
        localStorage.setItem('state',param);
        $state.go("app.documentsList");
    };

    var initializing = true;

    $scope.$watch('date', function(newDate) {
        if (initializing) {
            $timeout(function() { initializing = false; });
        }
        else{
            console.log('New date set: ', newDate);
            $scope.filterWithDocumentDate();
        }
    }, false);


}];