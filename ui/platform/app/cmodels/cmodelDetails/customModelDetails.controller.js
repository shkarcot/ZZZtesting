module.exports = ['$scope','$rootScope','ngDialog','Upload','$state','customModelDetailsService','$stateParams','$location','$timeout','$sce', function($scope,$rootScope,ngDialog,Upload,$state,customModelDetailsService,$stateParams,$location,$timeout,$sce) {
	'use strict';

    var vm = this;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    vm.sess_id = userData.sess_id;
    vm.filterGraphModel = "tagged";
    vm.modelName = $stateParams.name;
    vm.setDetailsFlag = true;
    $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();

     $scope.adtTrainObj= [];

    vm.getDatasetTypeList = function(){
        customModelDetailsService.getDatasetTypes({'sess_id':vm.sess_id}).then(function(response){
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

    vm.getDatasetTypeList();

    vm.generateVersionsGraph =function(divId,versionData){
        $scope.allColumns = [];
        angular.forEach(versionData.version_scores, function(value,key){
            $scope.arr = angular.copy(value);
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

    vm.graphFilter = function(){
        if(vm.filterGraphModel == "tagged"){
            vm.generateVersionsGraph("#versionsGraph",vm.modelDetailsObj)
        }
        else{
            var obj = {"version_scores":{"name":[]}};
            angular.forEach(vm.modelDetailsObj.model_score,function(value,key){
                if(value != null){
                    if(key != "Mean Absolute error" && key != "Neg mean square error"){
                        obj.version_scores[key] = [];
                    }
                }
            });
            for(var i=0;i<vm.modelDetailsObj.versions.length;i++){
                if(vm.modelDetailsObj.versions[i].is_active){
                    obj.version_scores["name"].push(vm.modelDetailsObj.versions[i].name+'(Active)');
                }
                else{
                    obj.version_scores["name"].push(vm.modelDetailsObj.versions[i].name);
                }
                angular.forEach(vm.modelDetailsObj.versions[i].model_score,function(value,key){
                    if(value != null){
                        if(key != "Mean Absolute error" && key != "Neg mean square error"){
                            obj.version_scores[key].push(value);
                        }
                    }
                });
            }
            vm.generateVersionsGraph("#versionsGraph",obj);
        }
    };

    vm.getModelVersionsFunct = function(){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id': $stateParams.id}};
        customModelDetailsService.getModelVersions(reqObj).then(function(response){
            if(response.data.status=="success"){
                vm.modelDetailsObj=response.data.data;
                var activeVersionArry = vm.modelDetailsObj.versions.filter(function(e){if(e.is_active){return e}});
                if(activeVersionArry.length>0)
                    vm.activeVersionName = activeVersionArry[0].name;
                vm.classHeadings = vm.modelDetailsObj.classes;
                if(vm.modelDetailsObj.model_type=="custom_classification_model" || vm.modelDetailsObj.model_type=="custom_regression_model"){
                    vm.algorithmType = "custom";
                }
                else{
                    vm.algorithmType = "platform";
                }
                vm.setDetailsFlag = false;
                var filterArr = vm.modelDetailsObj.versions.filter(function(e){if(e.status=="processing"){return e}});
                if(filterArr.length>0){
                    $scope.clearTimeOutVar = setTimeout(function(){ vm.getModelVersionsFunct(); }, 10000);
                }
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

    vm.getModelVersionsFunct();
    $scope.showEditIcons = [];
    $scope.showIcons=function(index){
        $scope.showEditIcons[index]=true;
    };
    $scope.hideIcons=function(index){
        $scope.showEditIcons[index]=false;
    };

    vm.getEvaluationResultsFunct = function(){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id': $stateParams.id}};

        customModelDetailsService.getEvaluateResults(reqObj).then(function(response){
            if(response.data.status=="success"){
                vm.lastEvaluatedResults = response.data.data;
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

    vm.getEvaluationResultsFunct();

    vm.downloadFile = function(path){
        var downloadUrl = $scope.url+'/api/models/version/download/'+path;
        window.location.assign(downloadUrl);
    };



    // versions tab

    vm.showTaggedVersions = function(val){
        if(!val){
            $scope.taggedVersionFlag = "";
        }
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

    vm.setTaggedToVersion = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":obj.version_id,"is_tagged":obj.is_tagged}};
        vm.updateModel(reqObj);
    };

    vm.setActiveToVersion = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":obj.version_id,"is_active":obj.is_active}};
        vm.updateModel(reqObj,'rename');
    };

    vm.updateModel = function(reqObj,param){
        customModelDetailsService.updateModelData(reqObj).then(function(response){
            if(response.data.status=="success"){
                var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id}};
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

    vm.activeVersionDetails = function(){
        vm.versionDetailShow = true;
        vm.versionTableShow = false;
        vm.showTrainVersion = false;
        vm.showEditModel = false;
        $('.dash-act-pane').removeClass('active in');
        $('.allversion').addClass('active in');
        $('.appendActive').removeClass('active');
        $('.appendActive1').addClass('active');
        var filterArr = vm.modelDetailsObj.versions.filter(function(e){if(e.is_active){return e}});
        vm.versionSelectedDetail = angular.copy(filterArr[0]);
        vm.priorRuns = [];
        vm.getAllPreviousRuns();
    };

    vm.trainVersion = function(){
        vm.versionDetailShow = false;
        vm.versionTableShow = false;
        vm.showTrainVersion = true;
        vm.showEditModel = false;
        $('.trainModal').modal('hide');
    };

    vm.allVersionsTable = function(){
        vm.versionDetailShow = false;
        vm.versionTableShow = true;
        vm.showTrainVersion = false;
        vm.showEditModel = false;
    };
    $scope.showEditIconsRuns = [];

    vm.cancelRunModel = function () {
        document.getElementById("runModelId").style.width = "0%";
    };

    vm.openRunModel = function(){
        document.getElementById("runModelId").style.width = "40%";
    };

    vm.evaluateVersion = function(){
        vm.openEvaluateModel();
        $('.evaluateModal').modal('hide');
    };

    $scope.showIconsRun=function(index){
        $scope.showEditIconsRuns[index]=true;
    };
    $scope.hideIconsRun=function(index){
        $scope.showEditIconsRuns[index]=false;
    };

    vm.downloadFileRuns = function(path){
        var downloadUrl = $scope.url+'/api/models/previousrun/download/'+path;
        window.location.assign(downloadUrl);
    };

    vm.getAllPreviousRuns = function(){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id': $stateParams.id,'version_id': vm.versionSelectedDetail.version_id}};
        customModelDetailsService.getPreviousRuns(reqObj).then(function(response){
            if(response.data.status=="success"){
                vm.priorRuns = response.data.data;
                vm.datasetSelectedForRun = "";
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

    vm.navToVersionDetails = function(versionObj){
        if(versionObj.status != "processing"){
            vm.versionDetailShow = true;
            vm.versionTableShow = false;
            vm.showTrainVersion = false;
            vm.showEditModel = false;
            vm.versionSelectedDetail = angular.copy(versionObj);
            vm.priorRuns = [];
            vm.getAllPreviousRuns();
        }
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

    vm.getModelComponents = function(reqObj){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id': $stateParams.id}};
        customModelDetailsService.getModelComponents(reqObj).then(function(response){
            if(response.data.status=="success"){
                vm.ensembleModels = response.data.data.models;
                vm.ensembleStrategy = response.data.data.ensemble;
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

    vm.getModelComponents();

    vm.getAllDataSets = function(){
        customModelDetailsService.getDataSets({'sess_id':vm.sess_id}).then(function(response){
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

    vm.runModel = function(){
        if(vm.datasetSelectedForRun != "" && vm.datasetSelectedForRun != undefined){
            var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":vm.versionSelectedDetail.version_id,"dataset_id":vm.datasetSelectedForRun}};
            if(vm.modelDetailsObj.resource_ids != undefined){
                reqObj.data.resource_ids = angular.copy(vm.modelDetailsObj.resource_ids);
            }
            $scope.enableRunLoader = true;
            customModelDetailsService.testModelData(reqObj).then(function(response){
                if(response.data.status=="success"){
                    vm.getAllPreviousRuns();
                    $scope.enableRunLoader = false;
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableRunLoader = false;
                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableRunLoader = false;
            });
        }
        else{
            $.UIkit.notify({
               message : "Please select the dataset",
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });

        }
    };

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
       vm.retrainModel = function()
    {
      if($scope.adtTrainObj != '')
      {
         if(vm.newmodel == 'newmodel' && typeof(vm.custModel) != 'undefined')
         {
            vm.retrainmodelapi(vm.custModel);

         }
         else if(vm.newmodel == 'existingmodel' && typeof(vm.modelName_Train) != 'undefined')
         {
          vm.retrainmodelapi(vm.modelName_Train);

         }
         else
         {
            $.UIkit.notify({
                   message : "Select and Enter Model Name is Required",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
         }
       }
        else
        {
           $.UIkit.notify({
                   message : "Please select a dataset ",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
        }
    }
    vm.retrainmodelapi = function(Model)
    {
     vm.description = vm.descModel;
     $scope.modeltrainloader = true;
    // vm.exterurl = vm.extramodel;
    // vm.traindatalocation = vm.traindata;
     var dataObj =  {
                 'launch_id':vm.launch_TrainID,
                 'tags':vm.launch_TrainID,
                 'model_id':Model,
                 'description': vm.descModel,
                 'data':$scope.adtTrainObj
                 }



     customModelDetailsService.retrainModelDataSam(dataObj).then(function(response){

                if(response.data.status == 'success')
                {
                     vm.newmodel = '';
                     vm.descModel = '';
                     vm.custModel = '';
                     vm.newmodel = '';
                     $scope.enableRetrainModel = false;
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                   $scope.modeltrainloader = false;
                }
                else
                {
                  vm.newmodel = '';
                  vm.descModel = '';
                  vm.custModel = '';
                  vm.newmodel = '';
                  $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });
                  $scope.modeltrainloader = false;
                }

            },function(err){
                $scope.enableRetrainModel = false;
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.modeltrainloader = false;
            });
    }

   vm.showCreateModel = function(){
        vm.createModel = true;
    };

    vm.backToCreateModel = function(){
        vm.createModel = false;
    };

    vm.showEditModelFunct = function(){
        vm.versionDetailShow = false;
        vm.versionTableShow = false;
        vm.showTrainVersion = false;
        vm.showEditModel = true;
        if(vm.modelDetailsObj.algo_type == "custom_classification_model" || vm.modelDetailsObj.algo_type == "custom_regression_model"){
            vm.ensembleType = "custom"
        }
        else{
            vm.ensembleType = "platform";
        }
    };

    vm.backToVersionDashboard = function(){
        vm.versionDetailShow = true;
        vm.versionTableShow = false;
        vm.showTrainVersion = false;
        vm.showEditModel = false;
    };

    vm.openEvaluateModel = function(){
        document.getElementById("evaluateModelId").style.width = "40%";
    };

    vm.cancelEvaluateModel = function() {
        document.getElementById("evaluateModelId").style.width = "0%";
    };

    vm.evaluateModelWithActive = function(){
        var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":vm.modelDetailsObj.version_id,"dataset_id":vm.datasetSelectedForEvaluate}};
        customModelDetailsService.evaluateDataset(reqObj).then(function(response){
            if(response.data.status=="success"){
                vm.evaluateResultForActive = response.data.data.evaluation;
                vm.confForEvalWithActive = response.data.data.confusion_matrix;
                vm.clsForEvalWithActive = response.data.data.classes;
                vm.evaluationResultsShow = true;
                vm.cancelEvaluateModel();
                var obj = {"version_scores":{"name":[]}};
                angular.forEach(vm.evaluateResultForActive.score,function(value,key){
                    if(value != null){
                        obj.version_scores[key] = [];
                        obj.version_scores[key].push(value);
                    }
                });
                obj.version_scores["name"].push(vm.evaluateResultForActive.version_name);
                console.log(obj);
                setTimeout(function(){
                    vm.generateVersionsGraph("#evalActVersionsGraph",obj);
                },2000);
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

    vm.evaluateModel = function(){
        if(vm.datasetSelectedForEvaluate != "" && vm.datasetSelectedForEvaluate != undefined){
            vm.evaluateModelWithActive();
            var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":vm.versionSelectedDetail.version_id,"dataset_id":vm.datasetSelectedForEvaluate}};
            $scope.enableEvaluateLoader = true;
            customModelDetailsService.evaluateDataset(reqObj).then(function(response){
                if(response.data.status=="success"){
                    $scope.enableEvaluateLoader = false;
                    vm.evaluationResult = response.data.data.evaluation;
                    vm.confForEval = response.data.data.confusion_matrix;
                    vm.clsForEval = response.data.data.classes;
                    vm.evaluateDatasetSelect = vm.evaluationResult.dataset_name;
                    vm.evaluationResultsShow = true;
                    vm.cancelEvaluateModel();
                    var obj = {"version_scores":{"name":[]}};
                    angular.forEach(vm.evaluationResult.score,function(value,key){
                        if(value != null){
                            obj.version_scores[key] = [];
                            obj.version_scores[key].push(value);
                        }
                    });
                    vm.datasetSelectedForEvaluate = "";
                    obj.version_scores["name"].push(vm.evaluationResult.version_name);
                    console.log(obj);
                    setTimeout(function(){
                        var topScroll = ($('#evaluateResultId').offset().top)-50;
                        $(window).scrollTop(topScroll);
                    },1000);
                    vm.generateVersionsGraph("#evalVersionsGraph",obj);
                }
                else{
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $scope.enableEvaluateLoader = false;
                }
            },function(err){
                $.UIkit.notify({
                   message : "Internal server error",
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableEvaluateLoader = false;
            });
        }
        else{
            $.UIkit.notify({
               message : "Please select the dataset",
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });

        }
    };

    vm.saveAsEvaluationSet = function(){
        if(vm.datasetSelectedForEvaluate == "" || vm.datasetSelectedForEvaluate == undefined){
            $.UIkit.notify({
               message : "Please select the dataset",
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });
        }
        else{
            var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id,"version_id":vm.versionSelectedDetail.version_id,"dataset":{"dataset_id":vm.datasetSelectedForEvaluate}}};
            vm.updateModel(reqObj);
        }
    };

    vm.downloadEvaluationFile = function(path){
        var downloadUrl = $scope.url+'/api/models/dataset/download/'+path;
        window.location.assign(downloadUrl);
    };

    // upload dataset

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

    // edit model code

    vm.saveAllModels = function(){
        $('.edit-tab-pane').removeClass('active in');
        $('.configureWeights').addClass('active in');
        $('.modelsActive').removeClass('active');
        $('.cwActive').addClass('active');
        vm.trainMode = vm.ensembleStrategy.mode;
    };

    vm.goToTrainTab = function(){
        $('.edit-tab-pane').removeClass('active in');
        $('.train').addClass('active in');
        $('.cwActive').removeClass('active');
        $('.trainActive').addClass('active');
    };

    vm.saveWeights = function(){
        vm.sendObj = {"model":{"name":vm.newStrategyVersionName,"model_group_name":vm.modelName,"ensemble_strategy":{"mode":"","weights":[]}}}
        if(vm.trainMode == "automatic")
            vm.sendObj.model.ensemble_strategy.mode = "automatic";
        else
            vm.sendObj.model.ensemble_strategy.mode = "manual";
        angular.forEach(vm.ensembleModels,function(value,key){
            vm.sendObj.model.ensemble_strategy.weights.push(vm.ensembleModels[key].weight);
        });
        console.log(vm.sendObj);
        $scope.enableTrainLoader = true;
        customModelDetailsService.updateModelFlow({'sess_id':vm.sess_id,'data':vm.sendObj}).then(function(response){
            if(response.data.status=="success"){
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                var reqObj={'sess_id':vm.sess_id,'data':{'model_id':vm.modelDetailsObj.model_id}};
                vm.getModelVersionsFunct(reqObj);
                vm.selectedDatasetInTrain = "";
                vm.allVersionsTable();
                $scope.enableTrainLoader = false;
            }
            else{
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $scope.enableTrainLoader = false;
            }
        },function(err){
            $.UIkit.notify({
               message : "Internal server error",
               status  : 'danger',
               timeout : 3000,
               pos     : 'top-center'
            });
            $scope.enableTrainLoader = false;
        });
    };

    vm.getJupiterNotebookUrl = function(){
        var requestObj = {
            "name": $stateParams.name,
            "description": vm.modelDetailsObj.description,
            "dataset_id": vm.modelDetailsObj.training_dataset_id,
            "model_type": vm.modelDetailsObj.model_type,
            "save_as":"model",
            "model_id":vm.modelDetailsObj.model_id
        }
        var reqObj={'sess_id':vm.sess_id,'data': requestObj};
        customModelDetailsService.getJupiterSession(reqObj).then(function(response){
            if(response.data.status=="success"){
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
        var requestObj = {
                "model_id":vm.modelIdForCustom,
                "model_type": vm.modelDetailsObj.model_type,
				"description": vm.modelDetailsObj.description,
				"dataset_id": vm.modelDetailsObj.training_dataset_id,
				"column":  vm.modelDetailsObj.column,
				"name": $stateParams.name
        };
        if(saveParam == "draft"){
            requestObj.save_as = "draft";
        }
        else{
            requestObj.save_as = "model";
        }
        var reqObj={'sess_id':vm.sess_id,'data': requestObj};
        $scope.enableCustomModel = true;
        customModelDetailsService.updateModels(reqObj).then(function(response){
            if(response.data.status=="success"){
                $scope.enableCustomModel = false;
                $('.edit-tab-pane').removeClass('active in');
                $('.configureWeights').addClass('active in');
                $('.modelsActive').removeClass('active');
                $('.cwActive').addClass('active');
                vm.showIframe = false;
                vm.getModelVersionsFunct();
                vm.getModelComponents();
                vm.trainMode = vm.ensembleStrategy.mode;
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

    vm.regenerateGraph = function(){
        vm.filterGraphModel = "tagged";
        vm.generateVersionsGraph("#versionsGraph",vm.modelDetailsObj);
    };

    $scope.$on("$destroy",function(){
        if (angular.isDefined($scope.clearTimeOutVar)) {
            clearTimeout($scope.clearTimeOutVar);
        }
    });
     vm.trainckActive = function(position,traindata)
    {
    //
     //for (var i = 0; i <trainselected.length; i++) {
          //console.log("sss:"+JSON.stringify(trainselected[i].checked));
         if (position) {

          $scope.adtTrainObj.push(traindata);

         }
         else
         {
           $scope.adtTrainObj.splice($scope.adtTrainObj.indexOf(traindata), 1);
         }
    // }

    }

    vm.launchesModels = function()
    {
        customModelDetailsService.launchesModel().then(function(response){
           if(response)
            {
                vm.launch_Id_List_Dataset = response.data;
                vm.datasetlist_lauch = response.data;
                vm.launch_Id_List_Train = response.data;
                vm.launch_Id_List_Test = response.data;
                vm.launch_Listversion = response.data;
                vm.launch_Listperformtab = response.data;
            }

        },function(err){
            console.log("error----"+err.error);
        });
    };
    vm.launchesModels();

    // change method in dataset tab dropdown value change then get value in details. @param launch iD or tags.
    vm.dataSet_Details = function(lauch_id)
    {

      customModelDetailsService.lModelgetdatasets({'launch_id':lauch_id,'tags':lauch_id}).then(function(response)
        {
            if(response.data)
            {
                vm.dataset_fetchdata_dataset = response.data;
                //vm.dataset_fetchdata_train = response.data;

            }
         else
             {
                $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                });

             }

        },function(err){
            console.log("error----"+err.error);
        });

    }
     vm.dataSet_Details_Train = function(lauch_id)
    {

      vm.newmodel = '';
      vm.descModel = '';
      vm.custModel = '';
      vm.newmodel = '';
      vm.gettrainlogModelID_Train(lauch_id);
      customModelDetailsService.lModelgetdatasets({'launch_id':lauch_id,'tags':lauch_id}).then(function(response)
        {
            if(response.data)
            {
               vm.dataset_fetchdata_train = response.data;

            }

        },function(err){
            console.log("error----"+err.error);
        });

    }
    vm.test_Tab_getdata= function(lauchid)
    {

     customModelDetailsService.lModelExisting({'launch_id':lauchid,'tags':lauchid}).then(function(response)
        {
            if(response.data)
            {
               vm.fetchdata_test = response.data;

            }

        },function(err){
            console.log("error----"+err.error);
        });

    }

    vm.gettrainlogModelID_Train = function(lauch_id)
    {
    vm.model_name = [];
      customModelDetailsService.lModelExisting({'launch_id':lauch_id,'tags':lauch_id}).then(function(response){
           if(response)
            {
               for(var i=0;i<response.data.length;i++)
               {
                vm.model_name.push(response.data[i].model_id);
               }

               console.log("error--dss--"+JSON.stringify(vm.lModelExistingDatalist));
            }

        },function(err){
            console.log("error--ffff--"+err.error);
        });
    }
    vm.gerenateModel = function()
    {
       $scope.modeltestloader = true;
      var modelid = vm.fetchdata_test[0].model_id;
       customModelDetailsService.gerenateMode({'launch_id':vm.testLaunch_id,'tags':vm.testLaunch_id,'model_id':modelid}).then(function(response){
           if(response.data.status == 'success')
                {

                vm.test_Tab_getdata(vm.testLaunch_id);
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                 $scope.modeltestloader = false;
                }
                else
                {
                  $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });
                  $scope.modeltestloader = false;
                }

        },function(err){
            console.log("error----"+err.error);
            $scope.modeltestloader = false;
        });

    }
    vm.deployModel = function()
    {
      $scope.modeltestloader = true;
      var modelid = vm.fetchdata_test[0].model_id;
          customModelDetailsService.deployMode({'launch_id':vm.testLaunch_id,'tags':vm.testLaunch_id,'model_id':modelid}).then(function(response){
          if(response.data.status == 'success')
                {

                vm.test_Tab_getdata(vm.testLaunch_id);
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                 $scope.modeltestloader = false;
                }
                else
                {
                  $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });
                   $scope.modeltestloader = false;
                }

        },function(err){
            console.log("error----"+err.error);
            $scope.modeltestloader = false;
        });
    }
     vm.testSModel = function()
    {

       var modelid = vm.fetchdata_test[0].model_id;
       //console.log("sddsdsdsd::"+JSON.stringify(modelid));
       var data_grid_value = vm.fetchdata_test[0];
       customModelDetailsService.stopModel({'launch_id':vm.testLaunch_id,'tags':vm.testLaunch_id,'model_id':modelid,'data':data_grid_value}).then(function(response){

              if(response.data.status == 'success')
                {

                 //$scope.enableRetrainModel = false;
                 // vm.updatelaunchesch(vm.selectTestLaunches,'Test');
                 vm.test_Tab_getdata(vm.testLaunch_id);
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });

                }
                else
                {
                  $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });

                }

        },function(err){

            console.log("error----"+err.error);
        });
    }
    // dataset Model. Save
    vm.datasetModel = function()
    {
     var dataset_json = {
                         'name':vm.name,
                         'tags':vm.tags,
                         'description':vm.desc,
                         'filesCount':vm.files,
                         'shapesCount':vm.shapes,
                         'path_in_s3':vm.path_in_s3
                        }
      customModelDetailsService.saveDataset(dataset_json).then(function(response){

              if(response.data.status == 'success')
                {

                   vm.dataSet_Details(vm.tags);
                   vm.name = '';
                   vm.tags = '';
                   vm.desc = '';
                   vm.files = '';
                   vm.shapes = '';
                   vm.path_in_s3 = '';
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });

                }
                else
                {
                  $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });

                }

        },function(err){
            console.log("error----"+err.error);
        });
      //console.log("json::"+JSON.stringify(dataset_json));saveDataset

    }
    $scope.checkList1 = [];
    vm.setActiveToVersion = function(launch_IdV,indexl,modelid,datasetlist)
    {

      angular.forEach(datasetlist, function(subscription, index) {
       // alert(subscription.checked);
            if (indexl != index)
                subscription.checked = false;
                  vm.modelid = modelid;

            }
        );

    }
     vm.version_getdata = function(v_launchId)
    {

      customModelDetailsService.vgetdeployedmodels({'launch_id':v_launchId,'tags':v_launchId}).then(function(response)
        {
           if(response)
            {
                vm.v_dataset = response.data;
                for(var i=0;i<response.data.length;i++)
                {
                 if(response.data[i].checked == "true")
                 {
                    $scope.checkList1[i] = true;
                 }

                }

            }

        },function(err){
            console.log("error----"+err.error);
        });
    }
     vm.setActiveToVersion = function(launch_IdV,indexl,modelid,datasetlist)
    {

      angular.forEach(datasetlist, function(list, index) {
            if (indexl != index)
                list.checked = false;
                  vm.modelid = modelid;

            }
        );

    }


    vm.vAction = function()
    {


      customModelDetailsService.setmodelactive({'model_id':vm.modelid ,'launch_id':vm.versionLaunch_id,'tags':vm.versionLaunch_id}).then(function(response){
           if(response.data.status == 'success')
            {
              $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'success',
                    timeout : 2000,
                    pos     : 'top-center'
                  });

            }
            else{

               $.UIkit.notify({
                    message : response.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });

            }

        },function(err){
            console.log("error----"+err.error);
        });

    }


    vm.refreshTrain = function()
    {
       var launchI = vm.launch_TrainID;
       if(launchI != '')
       {
         vm.dataSet_Details_Train(launchI);
       }
       else
       {
          $.UIkit.notify({
                    message :  'Please select one value',
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });
       }


    }
     vm.perform_tab_getmodel = function(p_launch_id)
    {
       customModelDetailsService.performgetdeployedmodels({'launch_id':p_launch_id,'tags':p_launch_id}).then(function(response)
        {
           if(response)
            {
                 vm.perform_get_modelarray = [];
                for(var i=0;i<response.data.length;i++)
                {
                    vm.perform_get_modelarray.push(response.data[i].model_id);
                }


            }

        },function(err){
            console.log("error----"+err.error);
        });
    }
    vm.performGraph_getdata = function(launchId)
    {
    var   launch_id =  vm.performLaunch_id;
    var   model_id =   vm.performModelId;
      customModelDetailsService.gettrainlogdtl({'launch_id':launch_id,'tags':launch_id,'model_id':model_id}).then(function(response){
           if(response)
            {
                vm.perform_data_info = response.data;
                //avg_loss
               // alert("get:::"+JSON.stringify(vm.perform_data_info));
                vm.generateVGraph('#vGraph',vm.perform_data_info);
            }

        },function(err){
            console.log("error----"+err.error);
        });

    }

    vm.generateVGraph = function(divId1,versiondata)
    {

       var chart = c3.generate({
        bindto:divId1,
        data: {
        json: versiondata,

        keys: {
             x:'steps',
            value: ['avg_time', 'avg_loss'],
        },
        axes: {
          'avg_loss':'y2'
        },
        type: 'line',
        types: {
          'avg_loss': 'line'
        }
      },

        axis: {
       x: {
          //type: 'category',
          label:'step'

         },
         y: {
            label: 'avg_time'
        },
       y2:{
          show:true,
          label: 'avg_loss'
        }
      }
     });
    }


}];