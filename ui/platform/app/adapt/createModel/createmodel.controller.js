module.exports = ['$scope', '$sce','$state', '$rootScope', '$location','adaptServices','sourceConfigService', 'Upload','$timeout',
function($scope,$sce, $state, $rootScope, $location, adaptServices,sourceConfigService, Upload,$timeout) {
	'use strict';
	var vm = this;
    $rootScope.currentState = 'createmodel';
    var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    vm.sess_id = userData.sess_id;
    $scope.modelCreateType = "platform";
    $(".iframeHeight").css('height', $(window).height()-100);

    //jQuery time
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function(){
        if(animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //activate next step on progressbar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                left = (now * 50)+"%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({
            'transform': 'scale('+scale+')',
            'position': 'absolute'
          });
                next_fs.css({'left': left, 'opacity': opacity});
            },
            duration: 800,
            complete: function(){
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $(".previous").click(function(){
        if(animating) return false;
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1-now) * 50)+"%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'left': left});
                previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
            },
            duration: 800,
            complete: function(){
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $(".submit").click(function(){
        return false;
    })

    // create code

    adaptServices.getModelTypes({'sess_id':vm.sess_id}).then(function(response){
        if(response.data.status=="success"){
            vm.modelTypeList=response.data.data;
            vm.platformModelTypes = response.data.data.model_types;
            var ind = vm.platformModelTypes.indexOf("custom_classification_model");
            vm.platformModelTypes.splice(ind,1);
             var ind1 = vm.platformModelTypes.indexOf("custom_regression_model");
            vm.platformModelTypes.splice(ind1,1);
            vm.allModelTypes = {
                                "custom":["custom_classification_model","custom_regression_model"],
                                "platform": vm.platformModelTypes
                               }
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

    vm.createModelObj = {"name":"","description":"","column":"","dataset_id":"","model_type":""};
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

    vm.setColumnList = function(dataset_id){
        var filterObj = vm.listOfDataSets.filter(function(e){if(e.dataset_id==dataset_id){return e}});
        vm.listOfColumns = filterObj[0].columns;
    };

    vm.createNewModel = function(type){
        var columnVal = [];
        columnVal.push(vm.createModelObj.column);
        var requestObj = {
            "name": vm.createModelObj.name,
            "description": vm.createModelObj.description,
            "column": columnVal,
            "dataset_id": vm.createModelObj.dataset_id,
            "model_type": vm.createModelObj.model_type
        }
        var reqObj={'sess_id':vm.sess_id,'data': requestObj};
        $scope.enableCreateModelLoader = true;
        if(type=="platform"){
            adaptServices.createModel(reqObj).then(function(response){
                if(response.data.status=="success"){
                    $scope.enableCreateModelLoader = false;
                    vm.createModelObj = {"name":"","description":"","column":"","dataset_id":"","model_type":""};
                    $.UIkit.notify({
                       message : "Job is submitted",
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                    $state.go("app.adapt");
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
        }
        else{
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

    //import dataset code

    vm.importDsObj = {"name":"","description":"","dataType":""};

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

    vm.saveCustomModel = function(saveParam){
        var columnVal = [];
        columnVal.push(vm.createModelObj.column);
        var requestObj = {
                "model_id":vm.modelIdForCustom,
                "model_type": vm.createModelObj.model_type,
				"description": vm.createModelObj.description,
				"dataset_id": vm.createModelObj.dataset_id,
				"column":  columnVal,
				"name": vm.createModelObj.name
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
                $.UIkit.notify({
                   message : "Job is submitted",
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                $state.go("app.adapt");
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
