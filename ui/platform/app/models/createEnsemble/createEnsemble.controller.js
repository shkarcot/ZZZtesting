module.exports = ['$scope','$rootScope','ngDialog','$state','createEnsembleService','$sce','modelDashboardService','Upload','$timeout', function($scope,$rootScope,ngDialog,$state,createEnsembleService,$sce,modelDashboardService,Upload,$timeout) {
	'use strict';

    var vm = this;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    vm.sess_id = userData.sess_id;
    vm.createEnsembleObj = {};
    vm.createModelObj = {};

    createEnsembleService.getModelTypes({'sess_id':vm.sess_id}).then(function(response){
        if(response.data.status=="success"){
            vm.modelTypeList=response.data.data.model_types;
            vm.modelAlgoTypes = response.data.data.algo_type;
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

    vm.getAllDataSets = function(){
        createEnsembleService.getDataSets({'sess_id':vm.sess_id}).then(function(response){
            if(response.data.status=="success"){
                vm.listOfDataSets = response.data.data;
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

    vm.getAllBinaries = function(){
        vm.listOfBinaries = [
                    {  "name":"bmi_dataset_1",
                      "resource_id":"",
                      "solution_id":"",
                  "description":"test dataset for bmi",
                      "upload_ts":"",
                      "size":130,
                      "is_archived":true
                    }
                  ]
        modelDashboardService.getBinaries({'sess_id':vm.sess_id,"data":$scope.filter_obj_binary}).then(function(response){
            if(response.data.status=="success"){
                vm.listOfBinaries = response.data.data;
                $scope.filter_obj_binary.totalRecords = response.data.total_binaries;
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

    vm.saveEnsemble = function(){
        var columnVal = [];
        columnVal.push(vm.createEnsembleObj.column);
        var requestObj = {
            "name": vm.createEnsembleObj.name,
            "description": vm.createEnsembleObj.description,
            "column": columnVal,
            "dataset_id": vm.createEnsembleObj.dataset_id,
            "model_type": vm.createEnsembleObj.model_type
        }
        if(vm.ensembleType == "platform"){
            $scope.enableEnsembleLoader = true;
            createEnsembleService.saveEnsemble({'sess_id':vm.sess_id,"data":requestObj}).then(function(response){
                if(response.data.status=="success"){
                    $('.tab-pane').removeClass('active in');
                    $('.models').addClass('active in');
                    $('.ensembleActive').removeClass('active');
                    $('.modelsActive').addClass('active');
                    $scope.enableEnsembleLoader = false;
                }
                else{
                    vm.createEnsembleObj = {"name":"","description":"","column":"","dataset_id":"","model_type":""};
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableEnsembleLoader = false;
                }
            },function(err){
                vm.createEnsembleObj = {"name":"","description":"","column":"","dataset_id":"","model_type":""};
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableEnsembleLoader = false;
            });
        }
        else{
            $('.tab-pane').removeClass('active in');
            $('.models').addClass('active in');
            $('.ensembleActive').removeClass('active');
            $('.modelsActive').addClass('active');
        }
    };

    vm.showCreateModel = function(){
        vm.createModel = true;
    };

    vm.backToCreateModel = function(){
        vm.createModel = false;
    };

    vm.setColumnList = function(dataset_id){
        var filterObj = vm.listOfDataSets.filter(function(e){if(e.dataset_id==dataset_id){return e}});
        vm.listOfColumns = filterObj[0].columns;
        vm.datasetSelectedType = filterObj[0].dataset_type;
        console.log(vm.modelTypeList[vm.datasetSelectedType].indexOf(vm.createEnsembleObj.model_type));
        if(vm.modelTypeList[vm.datasetSelectedType].indexOf(vm.createEnsembleObj.model_type) == -1){
            vm.createEnsembleObj.model_type = "";
        }
    };

    vm.checkForEnsembleType = function(){
        if(vm.createEnsembleObj.model_type == "custom_classification_model" || vm.createEnsembleObj.model_type == "custom_regression_model"){
            vm.ensembleType = "custom"
        }
        else{
            vm.ensembleType = "platform";
        }
    };

    vm.saveNewModel = function(){
        createEnsembleService.saveModel({'sess_id':vm.sess_id,"data":vm.createModelObj}).then(function(response){
            if(response.data.status=="success"){

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
    }

    vm.saveAllModels = function(){
        var reqObj = {"version_name": vm.versionName};
        createEnsembleService.saveAllModel({'sess_id':vm.sess_id,"data":reqObj}).then(function(response){
            if(response.data.status=="success"){

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


    // jupiter notebook code

    vm.getJupiterNotebookUrl = function(reqObj){
        var columnVal = [];
        columnVal.push(vm.createEnsembleObj.column);
        var requestObj = {
            "name": vm.createEnsembleObj.name,
            "description": vm.createEnsembleObj.description,
            "column": columnVal,
            "dataset_id": vm.createEnsembleObj.dataset_id,
            "model_type": vm.createEnsembleObj.model_type,
            "resource_ids": [vm.createEnsembleObj.resource_id]
        }
        if(vm.createEnsembleObj.resource_id == undefined || vm.createEnsembleObj.resource_id == ""){
            delete requestObj["resource_ids"];
        }

        createEnsembleService.getJupiterSession({'sess_id':vm.sess_id,"data":requestObj}).then(function(response){
            if(response.data.status=="success"){
                vm.modelIdForCustom = response.data.data.model_id;
                vm.showIframe = true;
                vm.jupiterNoteBookUrl = $sce.trustAsResourceUrl(response.data.data.url_path);
                $.UIkit.notify({
                   message : "Job is submitted",
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

    vm.saveCustomModel = function(saveParam){
        var columnVal = [];
        columnVal.push(vm.createEnsembleObj.column);
        var requestObj = {
                "model_id":vm.modelIdForCustom,
                "model_type": vm.createEnsembleObj.model_type,
				"description": vm.createEnsembleObj.description,
				"dataset_id": vm.createEnsembleObj.dataset_id,
				"column":  columnVal,
				"name": vm.createEnsembleObj.name,
				"resource_ids": [vm.createEnsembleObj.resource_id]
        };
        if(saveParam == "draft"){
            requestObj.save_as = "draft";
        }
        else{
            requestObj.save_as = "model";
        }
        if(vm.createEnsembleObj.resource_id == undefined || vm.createEnsembleObj.resource_id == ""){
            delete requestObj["resource_ids"];
        }
        var reqObj={'sess_id':vm.sess_id,'data': requestObj};
        $scope.enableModelSaving = true;
        createEnsembleService.updateModels(reqObj).then(function(response){
            if(response.data.status=="success"){
                $scope.enableModelSaving = false;
                $.UIkit.notify({
                   message : "Job is submitted",
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $state.go("app.modelDashboard");
            }
            else{
                $scope.enableModelSaving = false;
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
        },function(err){
            $scope.enableModelSaving = false;
            $.UIkit.notify({
               message : "Internal server error",
               status  : 'danger',
               timeout : 3000,
               pos     : 'top-center'
            });
        });
    };

    // upload dataset code

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

    vm.goToEnsemble = function(){
        $state.go("app.modelDashboard");
    };


}];