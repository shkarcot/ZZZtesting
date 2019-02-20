module.exports = ['$scope','$rootScope','ngDialog','Upload','$state','$window','modelDashboardService','$location','$timeout', function($scope,$rootScope,ngDialog,Upload,$state,$window,modelDashboardService,$location,$timeout) {
	'use strict';

    var vm = this;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    vm.sess_id = userData.sess_id;
    vm.ensembleFilter = "all";
    $scope.filter_obj ={"page_no": 1, "no_of_recs": 12, "sort_by":"update_ts", "order_by":false};
    $scope.filter_obj_dataset = {"filter_obj":{"page_no":1,"no_of_recs":12,"sort_by":"update_ts","order_by":false}};
    $scope.filter_obj_binary = {"filter_obj":{"page_no":1,"no_of_recs":12,"sort_by":"update_ts","order_by":false}};

    // models

    vm.getAllModels = function(){
        var obj = {'ensemble_type':vm.ensembleFilter, 'filter_obj':$scope.filter_obj}
        modelDashboardService.getModelsFilter({'sess_id':vm.sess_id, "data": obj}).then(function(response){
            if(response.data.status=="success"){
                vm.modelsArray=response.data.data;
                $scope.filter_obj.totalRecords = response.data.total_ensembles;
                var filterArr = vm.modelsArray.filter(function(e){if(e.status=="processing"){return e}});
                if(filterArr.length>0){
                    $scope.clearTimeOutVar = setTimeout(function(){ vm.getAllModels(); }, 10000);
                }
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
    vm.getAllModels();

    vm.goToModelDetails = function(mid,name){
        $state.go('app.modelDetails',{"name":name,"id": mid});
    };

    $scope.pageChanged = function (page) {
        $scope.filter_obj.page_no = page;
        vm.getAllModels()
    };

    // dataset

    $scope.showEditIcons = [];
    $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();

    vm.formatDate = function(date) {
          var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct",
            "Nov", "Dec"
          ];
          var newDate = new Date(date);
          var day = newDate.getDate();
          var monthIndex = newDate.getMonth();
          var year = newDate.getFullYear();
          var hours = newDate.getHours();
          var minutes = newDate.getMinutes();
          if(minutes<10)
             minutes = '0'+minutes;
          if(day<10)
             day = '0'+day;
          if(hours<10)
             hours = '0'+hours;

          return day + ' ' + monthNames[monthIndex] + ' ' + year + ' @ ' + hours + ':' + minutes;
    };

    vm.datasetTypes = function(){
        modelDashboardService.getDatasetTypes({'sess_id':vm.sess_id}).then(function(response){
            if(response.data.status=="success"){
                vm.datasetTypeList=response.data.data.dataset_types;
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
    vm.datasetTypes();

    vm.getAllDataSets = function(){
        modelDashboardService.getDataSetsList({'sess_id': vm.sess_id,"data": $scope.filter_obj_dataset}).then(function(response){
            if(response.data.status=="success"){
                vm.listOfDataSets = response.data.data;
                $scope.filter_obj_dataset.filter_obj.totalRecords = response.data.total_datasets;
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
    vm.getAllDataSets();

    $scope.pageChangedDataset = function (page) {
        $scope.filter_obj_dataset.filter_obj.page_no = page;
        vm.getAllDataSets()
    };

    vm.getAllBinaries = function(){
        modelDashboardService.getBinaries({'sess_id':vm.sess_id,"data":$scope.filter_obj_binary}).then(function(response){
            if(response.data.status=="success"){
                vm.listOfBinaries = response.data.data;
                $scope.filter_obj_binary.filter_obj.totalRecords = response.data.total_binaries;
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
    vm.getAllBinaries();

    $scope.pageChangedBinary = function (page) {
        $scope.filter_obj_binary.filter_obj.page_no = page;
        vm.getAllDataSets()
    };

    $scope.showIcons=function(index){
        $scope.showEditIcons[index]=true;
    };
    $scope.hideIcons=function(index){
        $scope.showEditIcons[index]=false;
    };

    vm.downloadFile = function(path){
        var downloadUrl = $scope.url+'/api/models/dataset/download/'+path;
        window.location.assign(downloadUrl);
    };

    vm.archiveDataset = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data': {"dataset_id":obj.dataset_id,"archive": true}};
        ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.popUpText = "Do you really want to archive the dataset?";
                  $scope.onConfirmActivation = function (){
                      modelDashboardService.archiveDataset(reqObj).then(function(response){
                            if(response.data.status=="success"){
                                vm.getAllDataSets();
                                ngDialog.close();
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
              }]
        });
    };

    vm.importDsObj = {"name":"","description":"","dataType":""};

    $scope.uploadDataset = function(attribute){
        $scope.ImportDataset="Import Dataset";
        document.getElementById("datasetImport").style.width = "40%";
    };

    $scope.canceldataSet = function () {
        document.getElementById("datasetImport").style.width = "0%";
        vm.importDsObj = {"name":"","description":"","dataType":""};
        $scope.browseFileName = '';
        $scope.browseFile="";
    };

    $scope.uploadFile = function(file){
        if(file!=null){
              $scope.browseFileName = file.name;
              $scope.browseFile = file;
        }
    };

    vm.sendDataSet = function(){
          var file = $scope.browseFile;
          if($scope.browseFile == undefined || $scope.browseFile == null|| $scope.browseFile == ""){
              $.UIkit.notify({
                 message : "Please select the file.",
                 status  : 'warning',
                 timeout : 2000,
                 pos     : 'top-center'
             });
          }
          else {
            var re = /(?:\.([^.]+))?$/;
            var selectedFileType=file.name;
            var ext = "."+re.exec(file.name)[1];
            var dataObj = {"file_name": vm.importDsObj.name,"description":vm.importDsObj.description,"format":vm.importDsObj.dataType};
            $scope.enabledatasetLoader = true;
             file.upload = Upload.upload({
                  url: 'api/models/dataset/upload/',
                  method: 'POST',
                  headers: {"sess_token": $scope.loginData.sess_id},
                  data:dataObj,
                  file: file
             });
             file.upload.then(function (response) {
                  $scope.browseFileName = '';
                  $scope.browseFile="";
                  $scope.enabledatasetLoader = false;
                 if(response.data.status=="success"){
                     vm.importDsObj = {"name":"","description":"","dataType":""};
                     $timeout(function(){ $scope.canceldataSet();}, 2000);
                     vm.getAllDataSets();
                     $.UIkit.notify({
                         message : response.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                     });
                 }
                 else if(response.data.status=="failure"){
                    $.UIkit.notify({
                         message : response.data.msg,
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                    });
                    $scope.enabledatasetLoader = false;
                 }
             }, function (response) {
                  $scope.browseFileName = '';
                  $scope.browseFile="";
                  $scope.enabledatasetLoader = false;
                   $.UIkit.notify({
                     message : 'Error in file upload',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                   });
             });
          }
    };

    // binaries code

    vm.importBinaryObj = {"name":"","description":""};
    $scope.showEditIconsBinary = [];

    $scope.uploadBinary = function(attribute){
        $scope.ImportDataset="Import Binary";
        document.getElementById("binaryImport").style.width = "40%";
    };

    $scope.cancelBinary = function () {
        document.getElementById("binaryImport").style.width = "0%";
        vm.importBinaryObj = {"name":"","description":""};
        $scope.browseFileName1 = '';
        $scope.browseFile1="";
    };

    $scope.uploadFileBinary = function(file){
        if(file!=null){
              $scope.browseFileName1 = file.name;
              $scope.browseFile1 = file;
        }
    };

    $scope.showIconsBinary=function(index){
        $scope.showEditIconsBinary[index]=true;
    };
    $scope.hideIconsBinary=function(index){
        $scope.showEditIconsBinary[index]=false;
    };

    vm.downloadFileBinary = function(path){
        var downloadUrl = $scope.url+'/api/models/dataset/download/'+path;
        window.location.assign(downloadUrl);
    };

    vm.sendBinary = function(){
          var file = $scope.browseFile1;
          if($scope.browseFile1 == undefined || $scope.browseFile1 == null|| $scope.browseFile1 == ""){
              $.UIkit.notify({
                 message : "Please select the file.",
                 status  : 'warning',
                 timeout : 2000,
                 pos     : 'top-center'
             });
          }
          else {
            var re = /(?:\.([^.]+))?$/;
            var selectedFileType=file.name;
            var ext = "."+re.exec(file.name)[1];
            var dataObj = {"file_name": vm.importBinaryObj.name,"description":vm.importBinaryObj.description};
            $scope.enablebinaryLoader = true;
             file.upload = Upload.upload({
                  url: 'api/models/binary/upload/',
                  method: 'POST',
                  headers: {"sess_token": $scope.loginData.sess_id},
                  data:dataObj,
                  file: file
             });
             file.upload.then(function (response) {
                  $scope.browseFileName1 = '';
                  $scope.browseFile1="";
                  $scope.enablebinaryLoader = false;
                 if(response.data.status=="success"){
                     vm.importBinaryObj = {"name":"","description":"","dataType":""};
                     $timeout(function(){ $scope.cancelBinary();}, 2000);
                     vm.getAllBinaries();
                     $.UIkit.notify({
                         message : response.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                     });
                 }
                 else if(response.data.status=="failure"){
                    $.UIkit.notify({
                         message : response.data.msg,
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                    });
                    $scope.enablebinaryLoader = false;
                 }
             }, function (response) {
                  $scope.browseFileName1 = '';
                  $scope.browseFile1="";
                  $scope.enablebinaryLoader = false;
                   $.UIkit.notify({
                     message : 'Error in file upload',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                   });
             });
          }
    };

    vm.archiveBinary = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data': {"resource_id":obj.resource_id,"archive": true}};
        ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.popUpText = "Do you really want to archive the binary?";
                  $scope.onConfirmActivation = function (){
                      modelDashboardService.archiveBinary(reqObj).then(function(response){
                            if(response.data.status=="success"){
                                vm.getAllBinaries();
                                ngDialog.close();
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
              }]
        });
    };

    vm.closeUploadSideBar = function(){
        $scope.canceldataSet();
        $scope.cancelBinary();
    };

    $scope.$on("$destroy",function(){
        if (angular.isDefined($scope.clearTimeOutVar)) {
            clearTimeout($scope.clearTimeOutVar);
        }
    });

}];