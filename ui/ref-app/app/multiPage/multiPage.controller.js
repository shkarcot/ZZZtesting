module.exports = ['$scope','$state','$stateParams','$rootScope','$sce','$location','documentsListService','$window',function($scope,$state,$stateParams,$rootScope,$sce,$location,documentsListService,$window) {
    'use strict';
    var vm = this;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    vm.sess_id= $scope.loginData.sess_id;
    $scope.multiImage = $window.innerHeight-148;
    vm.i =0;
    vm.displayMsg = [];
    vm.displayFlag = false;
    $scope.currentQueueName = localStorage.getItem("queueName");
    $scope.parentfilename = localStorage.getItem("parentfilename");

    vm.mutlicolumnsDefault = function () {
        if(vm.no_of_pages >= 4){
            vm.mutlicolumns = "col-lg-3 col-sm-3 col-md-3 col-xs-3";
            vm.i = 3;
        }

        else if(vm.no_of_pages >=2){
            vm.mutlicolumns = "col-lg-6 col-sm-6 col-md-6 col-xs-6";
            vm.i = 2;
        }
        else {
            vm.mutlicolumns = "col-lg-12 col-sm-12 col-md-12 col-xs-12";
            vm.i = 1;
        }
    };
    vm.zoominColumn = function () {
        if(vm.i==2){
            vm.mutlicolumns = "col-lg-12 col-sm-12 col-md-12 col-xs-12";
            vm.i = 1;
        }
        else if(vm.i==3){
            vm.mutlicolumns = "col-lg-6 col-sm-6 col-md-6 col-xs-6";
            vm.i = 2;
        }

    };
    vm.zoomoutColumn = function () {
        if(vm.i==1){
            vm.mutlicolumns = "col-lg-6 col-sm-6 col-md-6 col-xs-6";
            vm.i = 2;

        }
        else if(vm.i==2){
            if(vm.no_of_pages ==2){
                vm.noZoom = true;
            }
            else{
                vm.mutlicolumns = "col-lg-3 col-sm-3 col-md-3 col-xs-3";
                vm.i = 3;
            }
        }

    };


    vm.range_validations = function (event,index,obj,type) {
        vm.displayMsg = [];
        vm.displayFlag = false;
        if(type=='start_page'){
            if(obj.start_page=='' || obj.start_page==null || obj.start_page==undefined){
                vm.displayMsg[index] = 'Start Value Required';
                vm.displayFlag = true;
                return;
            }
            if(index == 0){
                if(obj.start_page==1){

                }
                else{
                    vm.displayMsg[index] = 'Start Value Must be 1';
                    vm.displayFlag = true;
                    return '';
                }
            }
            else{
                if(obj.start_page>vm.groups[index-1].end_page){

                }
                else{

                    vm.displayMsg[index] = 'Start page value must be greater than previous row End page value';
                    vm.displayFlag = true;
                    return '';
                }

                if(obj.end_page!='' && obj.end_page!=null &&  obj.end_page!=undefined){
                    if(obj.start_page<=obj.end_page){

                    }
                    else{
                        vm.displayMsg[index] = 'Start page value must be less than or equal to End page value';
                        vm.displayFlag = true;
                        return;
                    }
                }
                if(obj.start_page<vm.no_of_pages){

                }
                else{
                    if(obj.start_page==vm.no_of_pages){

                    }
                    else {
                        vm.displayMsg[index] = 'Start page value must be less than End page value';
                        vm.displayFlag = true;
                        return;
                    }
                }

            }
        }
        if(type=='end_page'){
            // if(!(obj.end_page>=obj.start_page )){
            //     alert("it small then start_page");
            // }
            // else{
            //     if(obj.end_page>vm.groups.length){
            //         alert('exceed number');
            //     }
            //     else if(obj.end_page==vm.groups.length){
            //         if(index+1<vm.groups.length){
            //             alert("are you sure delete remaining items");
            //             for(var i=index+1;i<vm.groups.length;i++){
            //                 vm.groups.splice(i,1);
            //             }
            //
            //         }
            //     }
            //
            // }
           if(obj.end_page=='' || obj.end_page==null || obj.end_page==undefined){
                vm.displayMsg[index] = 'End page value Required';
                vm.displayFlag = true;
                return;
            }
           if(obj.end_page>vm.no_of_pages){
               vm.displayMsg[index] = 'End page value must be less than or equal to last page count';
               vm.displayFlag = true;
               return;
           }
           else{
             if(obj.end_page == vm.no_of_pages){
                 if(index+1<vm.groups.length){
                        // vm.displayMsg[index] = 'are you sure delete remaining below items';
                        // vm.displayFlag = true;
                        vm.groups.splice(index+1,vm.groups.length-(index+1));
                        return;

                 }
             }
             if(obj.start_page!='' && obj.start_page!=null &&  obj.start_page!=undefined){
                 if(index+1<vm.groups.length){
                    if(vm.groups[index+1].start_page!='' &&  vm.groups[index+1].start_page!=null && vm.groups[index+1].start_page!=undefined) {
                        if (vm.groups[index + 1].start_page > obj.end_page) {

                        }
                        else {
                            vm.displayMsg[index] = 'End page value must be less then below row Start page value';
                            vm.displayFlag = true;
                            //alert("end Value must be less then below row start value");
                            return
                        }
                    }
                 }
             }
             if(obj.start_page<=obj.end_page){

             }
             else{
                 vm.displayMsg[index] = 'End page value must be less then or equal to  Start page value';
                 vm.displayFlag = true;
             }
           }
           if(obj.end_page<vm.no_of_pages){
               if(index+1==vm.groups.length){
                   vm.groups.push({
                         "start_page": '',
                         "end_page": '',
                         "template_name": 'unknown',
                         "template_id":'unknown'
                   })
                   vm.updateDocuments($scope.typesList);
               }
           }


        }

    };

    vm.getClassificationDetails = function () {
        documentsListService.getClassificationInfo({'sess_id':vm.sess_id,'id':$stateParams.id}).then(function (data) {
            if(data.data.status=='success'){
                vm.multi_page_info = data.data.data;
                vm.images = vm.multi_page_info.pages;
                vm.groups = vm.multi_page_info.page_groups;
                vm.temp = Object.keys(vm.images).length;
                vm.no_of_pages = vm.multi_page_info.metadata.properties.num_pages;
                vm.volume = vm.multi_page_info.volume;
                vm.mutlicolumnsDefault();
                vm.getDocumentTypes();
                console.log(data.data);


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

    vm.updateDocuments = function(data){
        for(var i=0;i<vm.groups.length;i++){
                    vm.listOfDocumentTypes[i] = angular.copy(data);
                    vm.listOfDocumentTypes[i].unshift({'template_id':'unknown','template_name':'unknown'})
                    vm.listOfDocumentTypes[i].push({'template_id':'Choose Domain Objects >','template_name':'Choose Domain Objects >'});
                    vm.listOfDocumentTypesDup[i] = angular.copy(vm.listOfDocumentTypes[i]);
                    vm.document_types_map = {};
                    angular.forEach(vm.listOfDocumentTypes[0],function (value,key) {
                        vm.document_types_map[value.template_id] = value;
                    })
        }
    };
    vm.getDocumentTypes = function () {
        vm.listOfDocumentTypes = [];
        vm.listOfDocumentTypesDup = [];

        documentsListService.getDocumentTypesList({'sess_id':vm.sess_id}).then(function (data) {
            if(data.data.status=='success'){
                $scope.typesList = data.data.data;
                vm.updateDocuments($scope.typesList);


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
    vm.change_classification = function (obj) {
         if(obj.template_id=='Choose Domain Objects >'){
            vm.listOfDocumentTypes[obj.index] = $scope.domainObjectsListDup;
         }
         else if(obj.template_id=='Choose Template <'){
           vm.listOfDocumentTypes[obj.index] = vm.listOfDocumentTypesDup[obj.index];
         }
         else{
             vm.displayMsg = [];
             vm.displayFlag = false;
             if(obj.start_page=='' || obj.start_page==null || obj.start_page==undefined){
                 vm.displayMsg[index] = 'Start page value required';
                 vm.displayFlag = true;
                 return;
             }
             else{
                  if(obj.end_page=='' || obj.end_page==null || obj.end_page==undefined){
                    vm.displayMsg[index] = 'End page value required';
                    vm.displayFlag = true;
                    return;
                 }
                 var index = vm.getIndex(obj);
                 if(index+1 == vm.groups.length) {
                     if (obj.end_page < vm.no_of_pages) {
                         vm.groups.push({
                             "start_page": '',
                             "end_page": '',
                             "template_name": 'unknown',
                             "template_id":'unknown'
                         })
                         vm.updateDocuments($scope.typesList);
                     }
                 }

             }

             if(vm.document_types_map[obj.template_id] == undefined){
                obj.domain_mapping =  vm.domainObjectsMap[obj.template_id];
             }
             else{
                obj.template_name = vm.document_types_map[obj.template_id].template_name;
             }
         }

    };


    vm.getClassificationDetails();
    vm.getIndex = function (obj) {
        for (var i = 0; i < vm.groups.length ; i++) {
                if (vm.groups[i].template_id === obj.template_id) {
                    return i;
                }
        }

    };

    vm.submitClassificationReview = function () {
        console.log(vm.groups);
        vm.displayMsg = [];
        vm.displayFlag = false;
        vm.count = 0
        for(var i=0;i<vm.groups.length;i++){
           if(vm.groups[i].start_page=='' || vm.groups[i].start_page==null || vm.groups[i].start_page==undefined || vm.groups[i].end_page=='' || vm.groups[i].end_page==null || vm.groups[i].end_page==undefined || vm.groups[i].template_name=='' || vm.groups[i].template_name==null || vm.groups[i].template_name==undefined){
                vm.displayMsg[i] = 'Please Fill Empty Value';
                vm.displayFlag = true;
                return;
           }
           for(var j=vm.groups[i].start_page;j<=vm.groups[i].end_page;j++) {
               vm.count++;
           }
        }
        if(vm.count!=vm.no_of_pages){
            vm.displayFlag = true;
            vm.displayMsg[100] = 'Some Pages are Missing';
            return;
        }

        for(var i=0;i<vm.groups.length;i++) {
            delete vm.groups[i]['index'];
            if(vm.groups[i].domain_mapping!=undefined){
                vm.groups[i].template_name = 'unknown';
                vm.groups[i].template_id = 'unknown';
            }

        }



        documentsListService.reviewedClassification({'sess_id':vm.sess_id,'id':$stateParams.id,'data':{"page_groups":vm.groups}}).then(function (resp) {
            if(resp.data.status=='success'){
                $.UIkit.notify({
                                   message : resp.data.msg,
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                });
                if($scope.loginData.role == "sv"){
                    $state.go("app.supervisorDocumentsList",{"id":$stateParams.queue});
                }
                else{
                    $state.go("app.agentDocumentsList",{"id":$stateParams.queue});
                }
            }
            else{
                $.UIkit.notify({
                                   message : resp.data.msg,
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

    vm.getDomainObjectsInfo = function(){
        $scope.sectionEntitiesList = [];
        $scope.entitiesList = [];
        documentsListService.getDomainObjectsList({'sess_id':vm.sess_id}).then(function(resp){
          console.log(resp.data);
          $scope.domainObjectsList = resp.data.domain_object;
          $scope.domainObjectsListDup = [];
          vm.domainObjectsMap = {};
          angular.forEach($scope.domainObjectsList,function(value,key){
                var obj = {'template_id':value,'template_name':value};
                 vm.domainObjectsMap[obj.template_id] = obj.template_name;
                $scope.domainObjectsListDup.push(obj);
          })
          $scope.domainObjectsListDup.push({'template_id':'Choose Template <','template_name':'Choose Template <'})

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
    vm.getDomainObjectsInfo();

    $scope.goToCaseDashboard = function(){
        if($scope.loginData.role == "sv"){
            $state.go("app.supervisorDocumentsList",{"id":$stateParams.queue});
        }
        else{
            $state.go("app.agentDocumentsList",{"id":$stateParams.queue});
        }
    };



}];