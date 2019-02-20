module.exports = ['$scope', '$sce','$state', '$rootScope','Upload','dataManagementService', '$location', '$http','ngDialog',  function($scope,$sce, $state, $rootScope, Upload,dataManagementService,$location,$http,ngDialog) {
	'use strict';
	var vm = this;
	$scope.fileType='';
	$scope.filetypes ={'data':'dictionary'};
	$scope.fileUploadView = "haveFile";
	$rootScope.currentState = 'terminology';
	$scope.showTerm = false;
	$(".resourceStyle").css('max-height', $(window).height()-80);
	$(".scrollTermsDiv").css('max-height', $(window).height()-250);
	$scope.tagNameFilter = "";
	 //console.log($scope.selectedName);
	 $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    $scope.showTermDetails = function(term){
        document.getElementById("showTermData").style.width = "40%";
        $scope.termDetailsSelected = term;
    };
    $scope.cancelTermDetails = function(){
        document.getElementById("showTermData").style.width = "0%";
    };

    $scope.uploadCorpus = function(file){
       $scope.filetypes.data=file;
       if($scope.filetypes.data=='corpus'){
         $scope.fileformat = ['txt','json','csv'];
            //$scope.files = ['text/plain','application/json','application/msword','text/csv'];
       }
       else if($scope.filetypes.data='dictionary'){
        //$scope.files = ['json'];
        $scope.fileformat = ['txt','json','csv'];
            $scope.files = ['text/plain','application/json','application/msword','text/csv'];
        }
        else if($scope.filetypes.data=='ontology'){
            console.log('upload ontology');
            $scope.fileformat = ['owl'];
            $scope.files = ['application/rdf+xml'];
        }

    };

    /*$scope.uploadDictionary = function(){
    console.log('upload dictionary');
        if($scope.filetypes='dictionary'){
        //$scope.files = ['json'];
        $scope.files = ['text/plain','application/json','application/msword','text/csv'];
        document.getElementById("uploadDictionary").style.width = "40%";
        }
    };

    $scope.uploadOntology = function(){
        if($scope.filetypes='ontology'){
        console.log('upload ontology');
        $scope.files = ['application/rdf+xml'];
        document.getElementById("uploadOntology").style.width = "40%";
        }
    };
*/

    $scope.cancelmodel = function(){
        document.getElementById("uploadCorpus").style.width = "0%";
    };

    $scope.saveFile= function(){
        var file = $scope.browseFile;
        console.log($scope.browseFile);
          if($scope.browseFile == undefined || $scope.browseFile == null || $scope.browseFile == ''){
             $scope.browseFileError = true;
             $.UIkit.notify({
                 message : "Please upload file ",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
               });
          }
          else if(vm.tag == undefined || vm.tag == ""){

          }
          else {
                var re = /(?:\.([^.]+))?$/;
              var selectedFileType=file.name;
              var ext = "."+re.exec(file.name)[1];
                //var ext = file.type;
                ext=ext.replace(".","");
               var fileAccept = $scope.fileformat.indexOf(ext);
                console.log(ext);
             console.log(fileAccept);
                 //if(validateFileType($scope.fileType,ext)){
            if(fileAccept != -1){
                console.log("validate");
              var dataObj={"tag": vm.tag,"type": $scope.filetypes.data,"is_system":false};
               console.log(dataObj);
               console.log(file);
               file.upload = Upload.upload({
                    url: 'api/data/upload/',
                    method: 'POST',
                    headers: {"sess_token": $scope.loginData.sess_id},
                    data:dataObj,
                    file: file
               });
               file.upload.then(function (response) {
               console.log(response);
                    if(response.data.status=='failure'){

                        $.UIkit.notify({
                           message : response.data.msg,
                           status  : 'warning',
                           timeout : 2000,
                           pos     : 'top-center'
                        });
                    }
                    else{
                        $.UIkit.notify({
                               message : response.data.msg,
                               status  : 'success',
                               timeout : 2000,
                               pos     : 'top-center'
                        });
                         $scope.fileName = '';
                         $scope.browseName = '';
                         $scope.fileDescription = '';
                         vm.tag = "";
                         $scope.endNum = 0;
                         $scope.search_term = '';
                         $scope.searchTerm = false;
                         $scope.filetypes.data ='dictionary';
                         $scope.UploadDetails = [];
                         setTimeout(function(){
                            vm.allTags();
                            $scope.corpusTab();
                         }, 500);

                         $scope.uploadedFiles();
                       // $scope.getUploadDetails($scope.filetypes);
                    }
                    $scope.cancelmodel();
               }, function (response) {
               });
           } else{
                //$scope.browseName = '';
                //$scope.browseFile = '';
                //$scope.inputModel = '';
                //$scope.fileType = '';
                //$scope.fileName = '';
                //$scope.fileDescription = '';
              $.UIkit.notify({
                 message : "Please import '"+$scope.fileformat+"' extension files only",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
               });
            }
             //$scope.browseName = '';
              //$scope.browseFile = '';
                /*$scope.browseFile = '';

                $scope.browseFile = '';
                $scope.inputModel = '';
                $scope.fileType = '';
                $scope.fileName = '';
                $scope.fileDescription = '';*/
            //}
          }

        };


    $scope.uploadFile = function(file){

        $scope.uploadCorpus($scope.filetypes.data);
        if($scope.fileType!=undefined){
        console.log("uploaded");
            if(file!=null){
              $scope.browseName = file.name;
              $scope.browseFile = file;
              $scope.browseFileError = false;
              $scope.showChangeBtn=true;
            }
        }
        else{
          $.UIkit.notify({
             message : "Please select the resource type.",
             status  : 'success',
             timeout : 2000,
             pos     : 'top-center'
          });
        }
      };

      $scope.startNum = 1;
      $scope.endNum = 0;
      $scope.UploadDetails = [];
      $scope.search_term = '';
    $scope.corpusTab = function(){
        var reqObj = {};
        reqObj.from = $scope.endNum;
        reqObj.size = 10;

        if($scope.search_term!=undefined &&  $scope.search_term!=''){
            reqObj.term = $scope.search_term;
        }

        if($scope.tagNameFilter!=undefined &&  $scope.tagNameFilter!=''){
            reqObj.tag = $scope.tagNameFilter;
        }

         dataManagementService.getUploadTerms($scope.loginData.sess_id,reqObj).then(function(data){
          if(data.data.status == 'success'){
            $scope.UploadDetails = angular.copy($scope.UploadDetails.concat(data.data.data));
            $scope.showSpinnerLoading = false;
          }else{
              $.UIkit.notify({
                 message : data.data.msg,
                 status  : 'danger',
                 timeout : 2000,
                 pos     : 'top-center'
              });
              $scope.showSpinnerLoading = false;
          }



        },function(err){
          $.UIkit.notify({
                 message : 'Internal Server Error',
                 status  : 'warning',
                 timeout : 2000,
                 pos     : 'top-center'
          });
          $scope.showSpinnerLoading = false;
        });

    };

    $scope.corpusTab();

    $scope.uploadedFiles = function(){
        dataManagementService.getUploadDocuments($scope.loginData.sess_id).then(function(data){
          if(data.data.status == 'success'){
              $scope.uploadedFilesList = data.data.data;
          }else{
              $.UIkit.notify({
                 message : data.data.msg,
                 status  : 'danger',
                 timeout : 2000,
                 pos     : 'top-center'
              });
          }
        },function(err){
          $.UIkit.notify({
                 message : 'Internal Server Error',
                 status  : 'warning',
                 timeout : 2000,
                 pos     : 'top-center'
          });
        });
    };

//    $scope.uploadedFiles();
    vm.tagsArray = [];

    vm.allTags = function(){
        dataManagementService.getAllTags($scope.loginData.sess_id).then(function(data){
          if(data.data.status == 'success'){
              vm.tagsList = data.data.data;
              vm.tagsArray = vm.tagsList.map(function(e){return e.tag});
          }else{
              $.UIkit.notify({
                 message : data.data.msg,
                 status  : 'danger',
                 timeout : 2000,
                 pos     : 'top-center'
              });
          }
        },function(err){
          $.UIkit.notify({
                 message : 'Internal Server Error',
                 status  : 'warning',
                 timeout : 2000,
                 pos     : 'top-center'
          });
        });
    };

    vm.allTags();

      $scope.requestForNext = function(){
         $scope.startNum = $scope.startNum+10;
         $scope.endNum = $scope.endNum+10;
         $scope.corpusTab();
      };

      $scope.requestForPrev = function(){
         $scope.startNum = $scope.startNum-10;
         $scope.endNum = $scope.endNum-10;
         $scope.corpusTab();
      };

      $('.scrollTermsDiv').scroll(function() {
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-10) {
                $scope.requestForNext();
                $scope.showSpinnerLoading = true;
            }
      });

      vm.addTermObj = {"tagInTerm":"","preferredLabel":"","alternativeLabel":"","hierarchyTags":[]};

      $scope.avlTags = [

      ];

       vm.saveNewTerm = function(){
           if(vm.addTermObj.tagInTerm == undefined || vm.addTermObj.tagInTerm == "" || vm.addTermObj.preferredLabel == undefined || vm.addTermObj.preferredLabel == ""){

           }
           else{
               var sendObj = {
                              "contents":  "",
                              "type": "dictionary",
                              "tag": "",
                              "is_system":false
                             }
               if(vm.addTermObj.alternativeLabel != ""){
                   $scope.newTermAdd = {};
                   $scope.newTermAdd[vm.addTermObj.preferredLabel] = vm.addTermObj.alternativeLabel;
                   sendObj.type = "dictionary";
                   sendObj.contents = $scope.newTermAdd;
                   sendObj.tag = vm.addTermObj.tagInTerm;
                   if(vm.addTermObj.hierarchyTags.length != 0){
                       sendObj.hierarchy = vm.addTermObj.hierarchyTags;
                   }
               }
               else{
                   $scope.newTermAdd = [];
                   $scope.newTermAdd.push(vm.addTermObj.preferredLabel);
                   sendObj.type = "corpus";
                   sendObj.contents = $scope.newTermAdd;
                   sendObj.tag = vm.addTermObj.tagInTerm;
               }
               dataManagementService.addResourceKey($scope.loginData.sess_id,sendObj).then(function(data){
                  if(data.data.status == 'success'){
                      $scope.UploadDetails = [];
                      $scope.searchTerm = false;
                      $scope.search_term = '';
                      $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                      });
                      vm.addTermObj = {"tagInTerm":"","preferredLabel":"","alternativeLabel":"","hierarchyTags":[]};
                      $scope.endNum = 0;
                      setTimeout(function(){
                           vm.allTags();
                           $scope.corpusTab();
                      }, 500);
                  }else{
                      $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                      });

                  }
                },function(err){
                  $.UIkit.notify({
                         message : 'Internal Server Error',
                         status  : 'warning',
                         timeout : 2000,
                         pos     : 'top-center'
                  });

                });
           }
       };

       function suggest_state(term) {
            var q = term.toLowerCase().trim();
            var results = [];

            // Find first 10 nerTypeList that start with `term`.
            for (var i = 0; i < vm.tagsArray.length; i++) {
              var state = vm.tagsArray[i];
              if (state.toLowerCase().indexOf(q) === 0)
                results.push({ label: state, value: state });
            }

            return results;
       }

       function add_tag(selected){
            $scope.getHierarchyClasses(selected.value);
       }

       $scope.autocomplete_options = {
            suggest: suggest_state,
            on_select: add_tag
       };

       $scope.getHierarchyClasses = function(){
            var reqObj = {"tag": vm.addTermObj.tagInTerm};
            dataManagementService.getTagHierarchyClasses($scope.loginData.sess_id,reqObj).then(function(data){
              if(data.data.status == 'success'){
                  $scope.hierarchyClasses = data.data.data;
                  $scope.avlTags = $scope.hierarchyClasses.hierarchy;

              }else{
                  $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                  });
              }
            },function(err){
              $.UIkit.notify({
                     message : 'Internal Server Error',
                     status  : 'warning',
                     timeout : 2000,
                     pos     : 'top-center'
              });
            });
       };

       $scope.nextLevel = function(){
           setTimeout(function(){
                var arr = vm.addTermObj.hierarchyTags;
                var str = arr.join('.');
                str = 'hierarchy.'+str;
                if($scope.hierarchyClasses != undefined){
                    $scope.avlTags = $scope.hierarchyClasses[str];
                }
           }, 100);
       };

       $scope.tagTermsFilter = function(){
            var reqObj = {};
            reqObj.from = 0;
            reqObj.size = 10;
            reqObj.tag = $scope.tagNameFilter;

            dataManagementService.getUploadTerms($scope.loginData.sess_id,reqObj).then(function(data){
              if(data.data.status == 'success'){
                $scope.UploadDetails = data.data.data;
              }else{
                  $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                  });
              }
            },function(err){
              $.UIkit.notify({
                     message : 'Internal Server Error',
                     status  : 'warning',
                     timeout : 2000,
                     pos     : 'top-center'
              });
            });
       };

       $scope.filterWithTag = function(tagName){
            $scope.search_term = '';
            $scope.searchTerm = false;
            $scope.tagNameFilter = tagName;
            $scope.tagTermsFilter();
       };

       $scope.clearFilter = function(){
            $scope.search_term = '';
            $scope.searchTerm = false;
            $scope.tagNameFilter = "";
            $scope.UploadDetails = [];
            $scope.paramTagFilter = "";
            $scope.endNum = 0;
            $scope.corpusTab();
            vm.allTags();
       };

       $scope.showDelIcon = function(index){
            $scope.delTermShow = [];
            $scope.delTermShow[index] = true;
       };

       vm.deleteTerm = function(obj,e){
            e.stopPropagation();
            var reqObj = {"tag":obj.tag,"term": obj.key};
            var sess_id = $scope.loginData.sess_id;
            ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete this '+obj.key+' term ?';
                  $scope.onConfirmActivation = function (){
                      ngDialog.close();
                      dataManagementService.deleteResourceKey(sess_id,reqObj).then(function(data){
                          if(data.data.status == 'success'){
                               $.UIkit.notify({
                                 message : 'Term Deleted Successfully',
                                 status  : 'success',
                                 timeout : 2000,
                                 pos     : 'top-center'
                               });
                               setTimeout(function(){
                                    vm.termsReloadFunct();
                                    vm.tagsReloadFunct();
                               }, 500);
                          }else{
                              $.UIkit.notify({
                                 message : data.data.msg,
                                 status  : 'danger',
                                 timeout : 2000,
                                 pos     : 'top-center'
                              });
                          }
                        },function(err){
                          $.UIkit.notify({
                                 message : 'Internal Server Error',
                                 status  : 'warning',
                                 timeout : 2000,
                                 pos     : 'top-center'
                          });
                        });
                  };
              }]
            });
       };

       vm.termsReloadFunct = function(){
            $scope.UploadDetails = [];
            $scope.corpusTab();
       };

       $scope.showDelTagIcon = function(index){
            $scope.delTagShow = [];
            $scope.delTagShow[index] = true;
       };

       vm.tagsReloadFunct = function(){
            $scope.UploadDetails = [];
            $scope.corpusTab();
            vm.allTags();
       };

       vm.deleteTag = function(obj,e){
            e.stopPropagation();
            var reqObj = {"tag":obj.tag};
            var sess_id = $scope.loginData.sess_id;
            ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete this '+obj.tag+' tag ?';
                  $scope.onConfirmActivation = function (){
                      ngDialog.close();
                      dataManagementService.deleteResourceKey(sess_id,reqObj).then(function(data){
                          if(data.data.status == 'success'){
                                $.UIkit.notify({
                                     message : data.data.msg,
                                     status  : 'success',
                                     timeout : 2000,
                                     pos     : 'top-center'
                                });
                               setTimeout(function(){
                                    vm.tagsReloadFunct();
                               }, 500);
                          }else{
                              $.UIkit.notify({
                                 message : data.data.msg,
                                 status  : 'danger',
                                 timeout : 2000,
                                 pos     : 'top-center'
                              });
                          }
                        },function(err){
                          $.UIkit.notify({
                                 message : 'Internal Server Error',
                                 status  : 'warning',
                                 timeout : 2000,
                                 pos     : 'top-center'
                          });
                        });
                  };
              }]
            });
       };




       $scope.searchTermFilter = function(){
          if($scope.search_term!=undefined && $scope.search_term!=''){
               $scope.tagNameFilter = '';
               $scope.showFilter = true;
               $scope.endNum = 0;
               $scope.UploadDetails = [];
               $scope.corpusTab();
           }
       };

       $scope.keyEnter = function (event) {
           if(event.which === 13) {
               $scope.searchTermFilter();
           }

       };

       $scope.clearTerm = function(){
           $scope.search_term = '';
           $scope.showFilter = false;
           $scope.endNum = 0;
           $scope.UploadDetails = [];
           $scope.corpusTab();
       };

}];

