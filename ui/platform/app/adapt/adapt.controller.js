module.exports = ['$scope', '$sce','$state', '$rootScope', '$location','adaptServices','sourceConfigService','ngDialog','Upload','$timeout','config',
function($scope,$sce, $state, $rootScope, $location,adaptServices,sourceConfigService,ngDialog,Upload,$timeout,config) {
	'use strict';
	var vm = this;
    $rootScope.currentState = 'adapt';
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    vm.sess_id = userData.sess_id;
    vm.username = userData.username;
    vm.modelDetailsObj={};
    $scope.config = config;
    $(".models").css('max-height', $(window).height());
    $scope.showEditIcons = [];

    $scope.showIcons=function(index){
        $scope.showEditIcons[index]=true;
    };
    $scope.hideIcons=function(index){
        $scope.showEditIcons[index]=false;
    };



    vm.getAllModels = function(){
        adaptServices.getModels({'sess_id':vm.sess_id}).then(function(response){
            if(response.data.status=="success"){
                vm.modelsArray=response.data.data;
                if(vm.editModelObj != undefined){
                    var ary = vm.modelsArray.filter(function(e){if(e.model_id == vm.editModelObj.model_id){return e}});
                    vm.modelNameFromCard = ary[0].name;
                    vm.modelDescriptionFromCard = ary[0].description;
                }
                console.log("vm.modelsArray", vm.modelsArray);
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

    adaptServices.getDatasetTypes({'sess_id':vm.sess_id}).then(function(response){
        if(response.data.status=="success"){
            vm.datasetTypeList=response.data.data.dataset_types;
            console.log("vm.modelDetailsObj", vm.modelDetailsObj);
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
        adaptServices.getDataSets({'sess_id':vm.sess_id}).then(function(response){
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

    $scope.cardsLayout = 'col-lg-8 col-md-8 col-sm-8 col-xs-12';
    $scope.cardsEmptyLayout = 'col-lg-4 col-md-4 col-sm-4 col-xs-12';
    $scope.cardinnerPanels = 'col-lg-6 col-md-6 col-sm-6 col-xs-12';
    $scope.showcardContent = true;

    $scope.setcolumnsWidth = function (modelObj) {
        $scope.cardsLayout = 'col-lg-4 col-md-4 col-sm-4 col-xs-12';
        $scope.cardsEmptyLayout = 'col-lg-8 col-md-8 col-sm-8 col-xs-12';
        $scope.cardinnerPanels = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
        $scope.showcardContent = false;
        vm.modelDetailsObj={};
        vm.modelNameFromCard = modelObj.name;
        vm.modelDescriptionFromCard = modelObj.description;
        vm.modelType = modelObj.model_type;
        vm.clearAllObjects();
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id':modelObj.model_id}};
        if(modelObj.status != "in_draft"){
            vm.getModelVersionsFunct(reqObj);
            vm.getModelComponents(reqObj);
        }
        else{
            vm.showEditModelIcon = true;
            vm.modelDetailsObj = angular.copy(modelObj);
            vm.modelDetailsObj.name = "";
            vm.clearAllObjects();
            $("#versionsGraph").html("");
            vm.ensembleModels = [];
        }
    };

    vm.getModelVersionsFunct = function(reqObj){
        vm.showEditModelIcon = false;
        adaptServices.getModelVersions(reqObj).then(function(response){
            if(response.data.status=="success"){
                vm.showEditModelIcon = true;
                vm.modelDetailsObj=response.data.data;
//                if(vm.modelDetailsObj.is_auto_ensemble == undefined || vm.modelDetailsObj.is_auto_ensemble)
//                    $scope.trainMode = "automatic";
//                else{
//                    $scope.trainMode = "manual";
//                }
                console.log("vm.modelDetailsObj", vm.modelDetailsObj);
                //if(vm.modelDetailsObj.total_versions>0)
                vm.generateVersionsGraph("#versionsGraph",vm.modelDetailsObj);
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

    vm.getModelComponents = function(reqObj){
        adaptServices.getModelComponents(reqObj).then(function(response){
            if(response.data.status=="success"){
                vm.ensembleModels = response.data.data.models;
                vm.ensembleStrategy = response.data.data.ensemble;
                if(vm.ensembleStrategy.mode == "manual"){
                    $scope.trainMode = "manual";
                    $scope.saveButShow = false;
                }
                else{
                    $scope.trainMode = "automatic";
                    $scope.saveButShow = false;
                }
                $scope.initiateSliders();
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

    $scope.showOriginalCardsStyle = function () {
        $scope.cardsLayout = 'col-lg-8 col-md-8 col-sm-8 col-xs-12';
        $scope.cardsEmptyLayout = 'col-lg-4 col-md-4 col-sm-4 col-xs-12';
        $scope.cardinnerPanels = 'col-lg-6 col-md-6 col-sm-6 col-xs-12';
        $scope.showcardContent = true;
    };

    vm.generateVersionsGraph =function(divId,versionData){

        $scope.allColumns = [];
        angular.forEach(versionData.version_scores, function(value,key){
            $scope.arr = value;
            if(key == 'name'){
                $scope.arr.unshift('x');
            }
            else{
                $scope.arr.unshift(key);
            }
            $scope.allColumns.push($scope.arr);
        });

        if(versionData.version_scores.name.length<3){
            var ratioValue = 0.2;
        }
        else{
            var ratioValue = 0.4;
        }

         /*['Accuracy', 0.91, 0.90, 0.81, 0.69, 0.56, 0.45],
        ['Precision', 0.87, 0.67, 0.87, 0.98, 0.91, 0.67],
        ['Recall', 0.89, 0.87, 0.98, 0.98, 0.89, 0.99]*/

        var chart = c3.generate({
            bindto: divId,
            data: {
                x : 'x',
                columns: $scope.allColumns,
                type: 'bar'
            },
            bar:{
                width: {
                    ratio: ratioValue
                }
            },
            axis: {
                x: {
                    type: 'category'
                }
            }
        });

        setTimeout(function () {
            chart.transform('bar');
        }, 1000);
    };

    vm.roundNumberV2=function(num, scale) {
        if (Math.round(num) != num) {
            if (Math.pow(0.1, scale) > num) {
              return 0;
            }
            var sign = Math.sign(num);
            var arr = ("" + Math.abs(num)).split(".");
            if (arr.length > 1) {
              if (arr[1].length > scale) {
                var integ = +arr[0] * Math.pow(10, scale);
                var dec = integ + (+arr[1].slice(0, scale) + Math.pow(10, scale));
                var proc = +arr[1].slice(scale, scale + 1)
                if (proc >= 5) {
                  dec = dec + 1;
                }
                dec = sign * (dec - Math.pow(10, scale)) / Math.pow(10, scale);
                return dec;
              }
            }
        }
        return num;
    };

    // versions tab code

    vm.enableRenameVersion = function(index){
        $scope.renameVer = [];
        $scope.renameVer[index] = true;
    };

    vm.disableRenameVersion = function(){
        $scope.renameVer = [];
    };

    vm.setNameToVersion = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":obj.version_id,"name":obj.name}};
        vm.updateModel(reqObj,'rename');
    };

    vm.setActiveToVersion = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":obj.version_id,"is_active":obj.is_active}};
        vm.updateModel(reqObj,'rename');
    };

    vm.setTaggedToVersion = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":obj.version_id,"is_tagged":obj.is_tagged}};
        vm.updateModel(reqObj);
    };

    vm.updateModel = function(reqObj,param){
        adaptServices.updateModelData(reqObj).then(function(response){
            if(response.data.status=="success"){
                var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id}};
                $scope.renameVer = [];
                if(param == "rename"){
                    vm.getAllModels();
                }
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                vm.getModelVersionsFunct(reqObj);
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

    vm.openTestTab = function(versionId){
        vm.testObj.version_id = versionId;
        $('.nav-tabs a[href=".modeltest"]').tab('show');
    };

    vm.openTrainTab = function(versionId){
        vm.trainObj.version_id = versionId;
        $('.nav-tabs a[href=".modeltrain"]').tab('show');
    };

    vm.showTaggedVersions = function(val){
        if(!val){
            $scope.taggedVersionFlag = "";
        }
    };

    //retrain model code

    vm.trainObj = {"dataset_id":"","version_id": "","name":""};

    vm.retrainValidateCheck = function(){
        if(vm.trainObj.dataset_id == ""){
            return "Please select the dataset";
        }
        else if(vm.trainObj.version_id == ""){
            return "Please select the model version";
        }
        else{
            return "";
        }
    };

    vm.retrainModel = function(){
        var msg = vm.retrainValidateCheck();
        if(msg == ""){
            var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":vm.trainObj.version_id,"dataset_id":vm.trainObj.dataset_id,'name':vm.trainObj.name}};
            $scope.enableRetrainModel = true;
            adaptServices.retrainModelData(reqObj).then(function(response){
                if(response.data.status=="success"){
                    var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id}};
                    $scope.enableRetrainModel = false;
                    vm.getModelVersionsFunct(reqObj);
                    $.UIkit.notify({
                       message : "Job is submitted",
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
                else{
                    $scope.enableRetrainModel = false;
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
            },function(err){
                $scope.enableRetrainModel = false;
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            });
        }
        else{
            $.UIkit.notify({
               message : msg,
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });
        }
    };

    vm.setColumnList = function(dataset_id){
        var filterObj = vm.listOfDataSets.filter(function(e){if(e.dataset_id==dataset_id){return e}});
        vm.listOfColumns = filterObj[0].columns;
    };

    // Test model code

    vm.testObj = {"dataset_id":"","version_id":""};

    vm.testModelValidateCheck = function(){
        if(vm.testObj.dataset_id == ""){
            return "Please select the dataset";
        }
        else if(vm.testObj.version_id == ""){
            return "Please select the model version";
        }
        else{
            return "";
        }
    };

    vm.testModel = function(){
        var msg = vm.testModelValidateCheck();
        if(msg == ""){
            var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":vm.testObj.version_id,"dataset_id":vm.testObj.dataset_id}};
            $scope.enableTestModel = true;
            adaptServices.testModelData(reqObj).then(function(response){
                if(response.data.status=="success"){
                    $scope.enableTestModel = false;
                    vm.model_output = response.data.data.model_output;
                    vm.model_output_confidence = response.data.data.model_output_confidence;
                    vm.downloadFilePath = response.data.data.result_path;
                    vm.testOutputModel = [];
                    vm.testOutputShow = true;
                    for(var i=0;i<vm.model_output.length;i++){
                        vm.testOutputModel.push({"value":vm.model_output[i],"score":vm.model_output_confidence[i]})
                    }
                }
                else{
                    $scope.enableTestModel = false;
                    vm.model_output = "";
                    vm.model_output_confidence = "";
                    vm.downloadFilePath = "";
                    vm.testOutputShow = false;
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
            },function(err){
                $scope.enableTestModel = false;
                vm.model_output = "";
                vm.model_oputput_confidence = "";
                vm.downloadFilePath = "";
                vm.testOutputShow = false;
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            });
        }
        else{
            $.UIkit.notify({
               message : msg,
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });
        
        }
    };
    $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
    vm.downloadFile = function(path){
        var downloadUrl = $scope.url+'/api/models/dataset/download/'+path;
        window.location.assign(downloadUrl);
    };

    // import dataset code

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

    $scope.saveDataSet = function(obj){
        adaptServices.savesftpfiles(vm.sess_id,obj).then(function(data){
                if(data.data.status=="success"){
                  $scope.selection = [];
                  vm.importDsObj = {"name":"","description":"","dataType":""};
                  $timeout(function(){ $scope.canceldataSet();}, 2000);
                  vm.getAllDataSets();
                  $.UIkit.notify({
                    message : data.data.msg,
                    status  : 'success',
                    timeout : 2000,
                    pos     : 'top-center'
                  });

                }
                else{
                  $.UIkit.notify({
                    message : data.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });
                }
        },function(err){
                  console.log(err);
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
        });
    };

    vm.sendDataSet = function(){
          if($scope.selection.length>0){
            var dataObj = {"file_name": vm.importDsObj.name,"description":vm.importDsObj.description,"format":vm.importDsObj.dataType,"files":$scope.selection};
            $scope.saveDataSet(dataObj);
            return ;
          }
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
//            if(ext==".xml"){
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
//            }
//            else{
//              $.UIkit.notify({
//                 message : "Please upload .xml extension files only",
//                 status  : 'warning',
//                 timeout : 3000,
//                 pos     : 'top-center'
//               });
//            }
          }
    };

    //evaluate dataset code

    vm.evaluateDataSet = function(){
        if($scope.datasetIdForEvaluate == "" || $scope.datasetIdForEvaluate == undefined){
            $.UIkit.notify({
               message : "Please select the dataset",
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });
        }
        else{
            if($scope.versionForEvaluate == "" || $scope.versionForEvaluate == undefined){
                $.UIkit.notify({
                   message : "Please select the model version",
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
            else{
                var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":$scope.versionForEvaluate,"dataset_id":$scope.datasetIdForEvaluate}};
                $scope.enableEvaluateModel = true;
                adaptServices.evaluateDataset(reqObj).then(function(response){
                    if(response.data.status=="success"){
                        $scope.enableEvaluateModel = false;
                        vm.evaluateResult = response.data.data;
                        var idx = 0;
                        angular.forEach(vm.evaluateResult.score,function(value,key){
                            if(idx == 0){
                                $scope.scoreInEvaluate = key;
                            }
                            idx = idx++;
                        });
                        vm.evaluate_actual_values = response.data.data.actual_values;
                        vm.evaluate_predicted_values = response.data.data.predicted_values;
                        vm.downloadFilePathInEvaluate = response.data.data.result_path;
                        vm.evaluateOutput = [];
                        vm.evaluateOutputShow = true;
                        for(var i=0;i<vm.evaluate_actual_values.length;i++){
                            vm.evaluateOutput.push({"actual":vm.evaluate_actual_values[i],"predicted":vm.evaluate_predicted_values[i]})
                        }
                    }
                    else{
                        $scope.enableEvaluateModel = false;
                        $.UIkit.notify({
                           message : response.data.msg,
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                        });
                        $scope.datasetIdForEvaluate = "";
                        $scope.versionForEvaluate = "";
                        vm.evaluateOutputShow = false;
                    }
                },function(err){
                    $scope.enableEvaluateModel = false;
                    $.UIkit.notify({
                       message : "Internal server error",
                       status  : 'danger',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.datasetIdForEvaluate = "";
                    $scope.versionForEvaluate = "";
                    vm.evaluateOutputShow = false;
                });
            }
        }
    };

    vm.saveAsEvaluationSet = function(){
        if($scope.datasetIdForEvaluate == "" || $scope.datasetIdForEvaluate == undefined){
            $.UIkit.notify({
               message : "Please select the dataset",
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });
        }
        else{
            var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":$scope.versionForEvaluate,"dataset":{"dataset_id":$scope.datasetIdForEvaluate}}};
            vm.updateModel(reqObj);
        }
    };

    // common code

    vm.clearAllObjects = function(){
        vm.evaluateOutput = [];
        vm.testOutputModel = [];
        vm.testObj = {"dataset_id":"","version_id":""};
        vm.trainObj = {"dataset_id":"","version_id": "","name":""};
        $scope.datasetIdForEvaluate = "";
        $scope.versionForEvaluate = "";
        vm.evaluateOutputShow = false;
        vm.testOutputShow = false;
    };

    //edit model

    adaptServices.getModelTypes({'sess_id':vm.sess_id}).then(function(response){
        if(response.data.status=="success"){
            vm.modelTypeList=response.data.data;
            vm.allModelTypes = {
                                "custom":["custom_classification_model","custom_regression_model"],
                                "platform": response.data.data
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

    vm.editModel = function(obj){
        vm.editModelView = true;
        vm.showIframe = false;
        if(vm.modelType == "custom_classification_model" || vm.modelType == "custom_regression_model"){
            $scope.modelUpdateType = "custom";
        }
        else{
            $scope.modelUpdateType = "platform";
        }
        vm.editModelObj = {"name":vm.modelNameFromCard,"description":vm.modelDescriptionFromCard,"model_type":vm.modelType,"model_id":obj.model_id};
    };

    vm.updateModelFunct = function(type){
        var requestObj = {
            "name": vm.editModelObj.name,
            "description": vm.editModelObj.description,
            "dataset_id": vm.editModelObj.dataset_id,
            "model_type": vm.editModelObj.model_type,
            "save_as":"model",
            "model_id":vm.editModelObj.model_id
        }
        var reqObj={'sess_id':vm.sess_id,'data': requestObj};
        if(type == "platform"){
            $scope.enableCreateModelLoader = true;
            adaptServices.updateModels(reqObj).then(function(response){
                if(response.data.status=="success"){
                    $scope.enableCreateModelLoader = false;
                    $scope.enableCustomModel = false;
                    vm.editModelView = false;
                    vm.getAllModels();
                    $scope.showOriginalCardsStyle();
                    $.UIkit.notify({
                       message : "Job is submitted",
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
                else{
                    $scope.enableCreateModelLoader = false;
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                }
            },function(err){
                $scope.enableCreateModelLoader = false;
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            });
        }
        else{
            $scope.enableCreateModelLoader = true;
            vm.getJupiterNotebookUrl(reqObj);
        }
    };

    vm.getJupiterNotebookUrl = function(reqObj){
        adaptServices.getJupiterSession(reqObj).then(function(response){
            if(response.data.status=="success"){
                $scope.enableCreateModelLoader = false;
                vm.showIframe = true;
                vm.modelIdForCustom = response.data.data.model_id;
                vm.jupiterNoteBookUrl = $sce.trustAsResourceUrl(response.data.data.url_path);
                $.UIkit.notify({
                   message : "Job is submitted",
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
            else{
                $scope.enableCreateModelLoader = false;
                vm.createModelObj = {"name":"","description":"","column":"","dataset_id":"","model_type":""};
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
        },function(err){
            $scope.enableCreateModelLoader = false;
            vm.createModelObj = {"name":"","description":"","column":"","dataset_id":"","model_type":""};
            $.UIkit.notify({
               message : "Internal server error",
               status  : 'danger',
               timeout : 3000,
               pos     : 'top-center'
            });
        });
    };

    vm.saveCustomModel = function(saveParam){
        var requestObj = {
                "model_id":vm.modelIdForCustom,
                "model_type": vm.editModelObj.model_type,
				"description": vm.editModelObj.description,
				"dataset_id": vm.editModelObj.dataset_id,
				"column":  vm.editModelObj.column,
				"name": vm.editModelObj.name
        };
        if(saveParam == "draft"){
            requestObj.save_as = "draft";
        }
        else{
            requestObj.save_as = "model";
        }
        var reqObj={'sess_id':vm.sess_id,'data': requestObj};
        $scope.enableCustomModel = true;
        adaptServices.updateModels(reqObj).then(function(response){
            if(response.data.status=="success"){
                $scope.enableCustomModel = false;
                vm.editModelView = false;
                vm.getAllModels();
                $scope.showOriginalCardsStyle();
                $.UIkit.notify({
                   message : "Job is submitted",
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
            else{
                $scope.enableCustomModel = false;
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
        },function(err){
            $scope.enableCustomModel = false;
            $.UIkit.notify({
               message : "Internal server error",
               status  : 'danger',
               timeout : 3000,
               pos     : 'top-center'
            });
        });
    };

    vm.modelDetailsPage = function(){
        if(vm.modelDetailsObj.status != "in_draft"){
            var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.editModelObj.model_id}};
            vm.getModelVersionsFunct(reqObj);
            vm.getAllModels();
            vm.editModelView=false;
        }
        else{
            vm.editModelView=false;
            vm.getAllModels();
        }
    };
    $scope.colSizeClass = [];
    vm.checkForKeysLength = function(obj,idx){
        var len = Object.keys(obj).length;
        if(len == 1){
            return "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        }
        if(len == 2){
            return "col-lg-6 col-md-6 col-sm-6 col-xs-6";
        }
        if(len == 3){
            return "col-lg-4 col-md-4 col-sm-4 col-xs-4";
        }
    };

    vm.archiveDataset = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data': {"dataset_id":obj.dataset_id,"archive": true}};
        ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.onConfirmActivation = function (){
                      adaptServices.archiveDataset(reqObj).then(function(response){
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

    $scope.trainMode = "automatic";
    vm.openModal = function(){
        $('#myModal').modal('show');
    };

    vm.changeToManual = function(prop){
        if(prop == "yes"){
            $scope.trainMode = "manual";
            $scope.saveButShow = true;
            $('#myModal').modal('hide');
        }
        if(prop == "no"){
            $scope.trainMode = "automatic";
            $scope.saveButShow = false;
            $('#myModal').modal('hide');
        }
    };

    vm.showCreateModel = function(){
        $scope.saveButShow = false;
        vm.saveWeights();
    };

    $scope.initiateSliders = function(){
        $rootScope.slider = [];
        for(var i=0;i<vm.ensembleModels.length;i++){
            if(vm.ensembleModels[i].status != "failed"){
                $rootScope.slider[i] = {
                    value: vm.ensembleModels[i].weight,
                    options: {
                         floor: 0,
                         ceil: 10,
                         id: 'slider-id',
                         onEnd: function(id) {
                             console.log($rootScope.slider.value);
                         }
                    }
                };
            }
            else{
                $rootScope.slider[i] = {
                    value: 0,
                    disabled: true,
                    options: {
                         floor: 0,
                         ceil: 10,
                         id: 'slider-id',
                         onEnd: function(id) {
                             console.log($rootScope.slider.value);
                         }
                    }
                };
            }
        }
        setTimeout(function(){
            $scope.$broadcast('rzSliderForceRender');
        },100)
    };

    vm.saveWeights = function(){
        vm.sendObj = {"model":{"name":$scope.newVersionName,"model_group_name":vm.modelNameFromCard,"ensemble_strategy":{"mode":"","weights":[]}}}
        if($scope.trainMode == "automatic")
            vm.sendObj.model.ensemble_strategy.mode = "automatic";
        else
            vm.sendObj.model.ensemble_strategy.mode = "manual";
        angular.forEach(vm.ensembleModels,function(value,key){
            vm.sendObj.model.ensemble_strategy.weights.push($rootScope.slider[key].value);
        });
        console.log(vm.sendObj);
        adaptServices.updateModelFlow({'sess_id':vm.sess_id,'data':vm.sendObj}).then(function(response){
            if(response.data.status=="success"){
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.saveButShow = false;
                var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id}};
                vm.getModelVersionsFunct(reqObj);
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

    $scope.sftpList = [];
    $scope.selection = [];
    $scope.checkList = [];

    $scope.toggleSelection = function(list,index) {
        var idx = $scope.selection.indexOf(list);
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
        else {
          if($scope.selection.length>=1){
             $scope.checkList[index] = false;
             $.UIkit.notify({
               message : "Select one file at a time",
               status  : 'danger',
               timeout : 3000,
               pos     : 'top-center'
             });
          }
          else{
          $scope.selection.push(list);
          }
        }
    };

    $scope.getSFTPList = function(){

         sourceConfigService.getsftpfiles($scope.loginData.sess_id).then(function(data){
            if(data.data.status=="success"){

              $scope.sftpList = data.data.files;

            }
            else{
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'danger',
                timeout : 2000,
                pos     : 'top-center'
              });
            }
         },function(err){
                  console.log(err);
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
         });

    };
    $scope.getSFTPList();

}];
