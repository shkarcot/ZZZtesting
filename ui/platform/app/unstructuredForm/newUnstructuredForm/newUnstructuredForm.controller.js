module.exports = ['$scope', '$sce', '$compile', '$state', '$rootScope','$stateParams','Upload', 'ngDialog', '$location', 'entitiesService','documentService','$window','$timeout',
function($scope,$sce, $compile, $state, $rootScope, $stateParams, Upload, ngDialog, $location,
 entitiesService,documentService,$window,$timeout) {
 'use strict';
    var vm = this;
    $scope.tags =[];
    $rootScope.currentState = 'newUnstructuredForm';
    $scope.zoomDisplay = 'zoomSize';
    $scope.rect = {
        data_color: '#337ab7',
        marker_color: '#00ad2d',
        section_color:'#FF0000',
        stroke: 5
    };
    $scope.current_page = 1;
    $scope.current_selection_page_no = 1;
    $rootScope.selectedIndex =-1;
    $rootScope.selectedPage = -1;
    $(".threshold-custom").height($(window).height());
    $scope.testHeight = $(window).height()-100;
    $scope.testHeight2 = $(window).height()-25;
    $scope.testHeight3 = $(window).height()-200;
    $(".image-style").height($(window).height());
    $(".image-style1").height($(window).height());
    $(".image-style2").height($(window).height()-25);
    $(".image-style3").height($(window).height()-200);

    $scope.showDomainTab = false;
    $scope.height = $window.innerHeight-125;
    $scope.elementHeight = $window.innerHeight-240;

    $scope.showKnownInfo = function(){
        $scope.showCreate = true;
        $scope.showTemplate = false;
        if(vm.documentTemplate.template_type=='unknown'){
            $scope.showKnownData = false;
            $scope.showUnKnownData = true;
        }
        else{
            $scope.showKnownData = true;
            $scope.showUnKnownData = false;
        }
    };
    $scope.backInfo = function(){
        $scope.showKnownData = false;
        $scope.showUnKnownData = false;
        $scope.showCreate = false;
        $scope.showTemplate = true;
    };

    $scope.cancelInfo = function(){
        $state.go('app.unstructuredForm');
    };
    function toggleChevron(e) {
        $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    }
    $('#node').on('hidden.bs.collapse', toggleChevron);
    $('#node').on('shown.bs.collapse', toggleChevron);
    $(".domainHierarchyDiv").css('max-height', $(window).height()-200);
    vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
    vm.sess_id= vm.loginData.sess_id;
    vm.loadEntitiesList = function(){
        entitiesService.getEntities({'sess_id':vm.sess_id}).then(function(data){
            if(data.data!=null && data.data!=undefined){
                $scope.domainObjects =  data.data.domain_object;
                //$scope.extractOutput = $scope.domainObjects;
            }
        });
    };
    vm.loadEntitiesList();


    $scope.extractOutput1 = [{
        "name": "Patient",
        "type":"entity",
        "confidence": "98%",
        "temp_id":"patient",
        "attributes":[
        {
        "name":"Name",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"patient_name",
        "justification":"justification text will be shown here"
        },
        {
        "name":"date",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"patient_date",
        "justification":"justification text will be shown here"
        },
        {
        "name":"age",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"patient_age",
        "justification":"justification text will be shown here"
        },
        {
        "name":"Phone number",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"patient_number",
        "justification":"justification text will be shown here"
        },
        {
        "name":"Address",
        "type":"entity",
        "confidence":"95.4%",
        "temp_id":"patient_address",
        "attributes":[
        {
        "name":"Madhapur",
        "current_value":"Madhapur",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"patient_address_madhapur",
        "justification":"justification text will be shown here"
        }]
        }
      ]
    },
    {
        "name": "Insurer",
        "type":"entity",
        "confidence": "98%",
        "temp_id":"Insurer",
        "attributes":[
        {
        "name":"Name",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"Insurer_name",
        "justification":"justification text will be shown here"
        },
        {
        "name":"date",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"Insurer_date",
        "justification":"justification text will be shown here"
        },
        {
        "name":"age",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"Insurer_age",
        "justification":"justification text will be shown here"
        },
        {
        "name":"Phone number",
        "current_value":"Chase Marsh",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"Insurer_number",
        "justification":"justification text will be shown here"
        },
        {
        "name":"Address",
        "type":"entity",
        "confidence":"95.4%",
        "temp_id":"Insurer_address",
        "attributes":[
        {
        "name":"Madhapur",
        "current_value":"Madhapur",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"Insurer_address_madhapur",
        "justification":"justification text will be shown here"
        },{
        "name":"Address2",
        "type":"entity",
        "confidence":"95.4%",
        "temp_id":"Insurer_address_address2",
        "attributes":[
        {
        "name":"Madhapur",
        "current_value":"Madhapur",
        "recommended":"Chase Marshall",
        "confidence" :"87%",
        "type":"attribute",
        "temp_id":"Insurer_address_address2_madhapur",
        "justification":"justification text will be shown here"
        }]
        }]
        }
      ]
    }];


    vm.initialiseDrawerAndSelector = function(){
        $scope.drawer = [];
        $scope.selector=[];
        for(var i=0;i<$scope.no_of_pages;i++){
            $scope.drawer[i+1] = [];
            $scope.selector[i+1] = {};
            $scope.selector[i+1].enabled=false;
            $scope.selector[i+1].id=i+1;
        }
     };
     vm.recursiveByHierarchy = function(data){
        for(var i=0;i<data.length;i++){
           if(data[i].type=='attribute'){
              vm.getAttributeByHierarchy(data[i]);

           }
           else{
                vm.recursiveByHierarchy(data[i].attributes);
           }

        }
     };
     vm.getresultByHierarchy = function(){
            vm.recursiveByHierarchy($scope.extractOutput);
     };

     vm.getAttributeByHierarchy = function(data){
            for(var i=0;i<data.attributes.length;i++){
                var val = data.attributes[i];
                if(val.current_value!=undefined){
                    if(val.current_value.length>0){
                        for(var j=0;j<val.current_value.length;j++){
                            if(val.current_value[j].value_coordinates!=undefined){
                                val.current_value[j].drawerIndexObj = {};
                                val.current_value[j].temp_id = val.temp_id;
                                vm.updateDrawer('value',val.current_value[j]);
                            }
                        }
                    }
                }
            }
     };



    $scope.removeSpace = function(value){
        var removedSpace = value.replace(" ","");
        return removedSpace;
    };

    vm.getTable = function(data){
        if(data.name==undefined)
            data.name = 'Table';
        angular.forEach(data.headings,function(value){
            if(value.hasOwnProperty('domain_mapping')) {
                var str = value.domain_mapping;
                var strLength = str.length;
                var split = str.split('.');
                var attrLength = split[split.length - 1].length;
                var finalStr = strLength - attrLength - 1;
                var res = str.substring(finalStr, 0);
                data.entity = res;
                value.attribute = split[split.length - 1];
            }
        })
        if(data.forDomainMapping != undefined){
            var domap = data.forDomainMapping;
        }
        else{
            var domap = data.headings;
        }
        if(data.entity == undefined){
            data.entity='';
        }
        var head = data.headings;
        data.headings = [];
        data.headings = angular.copy(domap);
        data.forDomainMapping = angular.copy(head);
    };
    $scope.addTableColumn = function(item){
        item.headings.push({"domain_mapping":"","entity":"","attribute":"","column":[]});
    };

    $scope.addSubColumn = function(item,index){
        if(item.headings[index].subColumn == undefined){
            item.headings[index].subColumn = angular.copy([]);
        }
        item.headings[index].subColumn.push([]);
    };

    $scope.removeTableColumn = function (item,cellIndex) {
        item.headings.splice(cellIndex, 1);
        $scope.columnAdded(item);
    };

    $scope.removeTableSubColumn = function (item,data,cellIndex) {
        data.subColumn.splice(cellIndex,1);
        if(data.subColumn.length == 0){
        delete data["subColumn"];
        }
        $scope.columnAdded(item);
    };

    $scope.columnAdded = function(item){
        setTimeout(function(){
            item.forDomainMapping = [];
            var tableHead = angular.copy(item.headings);
            for(var i=0;i<tableHead.length;i++){
                if(tableHead[i].subColumn != undefined){
                    if(tableHead[i].subColumn.length>0){
                        for(var j=0;j<tableHead[i].subColumn.length;j++){
                            var col = angular.copy(item.headings[i]);
                            col.subColumn = [];
                            col.subColumn[0] = tableHead[i].subColumn[j];
                            item.forDomainMapping.push(col);
                        }
                    }
                    else{
                        item.forDomainMapping.push(tableHead[i]);
                    }
                }
                else{
                    item.forDomainMapping.push(tableHead[i]);
                }
            }
        $scope.$apply();
        }, 500);
    };

    $scope.recursive = function(data){
        for(var i=0;i<data.length;i++){
            if(data[i].type=='section'){
                $scope.recursive(data[i].sections);
            }
            else if(data[i].type=='table'){
                vm.getTable(data[i]);

            //$scope.drawer.push(data[i]);
            }
        }
    };

    $scope.getresult = function(){
        $scope.recursive($scope.menuItems);
    };

    $scope.addElement = function(data,type){
        console.log("info"+JSON.stringify(data.item));
        var obj = {};
        if(type == 'section'){
            obj = {"name": "Section","type":"section","sections": [],"temp_id":$scope.uniqueIdGenerator()};
            if(data==''){
                $scope.menuItems.unshift(obj);
            }
            else{
               data.item.sections.unshift(obj);
            }
        }
        else if(type == 'table'){
            obj = {"name": "Table","type":type,"temp_id":$scope.uniqueIdGenerator(),"entity":"","headings":[{"domain_mapping":"","entity":"","attribute":"","column":[]},{"domain_mapping":"","entity":"","attribute":"","column":[]}]};
            if(data==''){
                $scope.menuItems.unshift(obj);
            }
            else{
                data.item.sections.unshift(obj);
            }
        }

        setTimeout(function(){
            $("."+obj.temp_id).addClass('in');
            $("."+obj.temp_id).removeAttr( 'style' );
        },100);
    };




    $scope.uniqueIdGenerator = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    vm.thresholdsData={};
    $scope.onBlurVal="";
    $scope.onFocusVal="";
    vm.showCTH=true;
    vm.getDocumentsList = function(id){
        vm.thresholdsData={};
        $scope.onBlurVal="";
        $scope.onFocusVal="";
        documentService.getDocumentDetails(vm.sess_id,id).then(function(resp){
            console.log(resp);
            if(angular.equals(resp.data.status,'success')){
                vm.documentTemplate = resp.data.data;
                if(resp.data.data.thresholds!=undefined){
                    vm.thresholdsData=resp.data.data.thresholds;
                }
                if(vm.thresholdsData.custom!=undefined  && vm.thresholdsData.custom.length>0){
                     vm.showCTH=false;
                }
                else{
                     vm.showCTH=true;
                }
                console.log(vm.thresholdsData);

                if(vm.documentTemplate){
                    $scope.template_id = vm.documentTemplate.template_id;
                    $scope.menuItems = vm.documentTemplate.sections;
                    if(vm.documentTemplate.template_type=='unknown_known')
                       $scope.getresult();

                    $scope.showKnownInfo();
                }

                return true;

            }
            else{
                $.UIkit.notify({
                message : resp.data.msg,
                status  : 'danger',
                timeout : 2000,
                pos     : 'top-center'
                });
                return false;
            }
        },function(err){
            console.log(err)
            $.UIkit.notify({
            message : "Internal server error",
            status  : 'warning',
            timeout : 3000,
            pos     : 'top-center'
            });
            return false;
        });
    };

    vm.getAttributesList = function(){
        $scope.sectionEntitiesList = [];
        $scope.entitiesList = [];
        entitiesService.getDomainObjects({'sess_id':vm.sess_id}).then(function(resp){
          console.log(resp.data);
          $scope.entitiesList = resp.data;
          angular.forEach($scope.entitiesList,function(value,key){
            $scope.sectionEntitiesList.push(key);
          })
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

    vm.getDomainObjectsInfo = function(){
        $scope.sectionEntitiesList = [];
        $scope.entitiesList = [];
        entitiesService.getDomainObjectsList({'sess_id':vm.sess_id}).then(function(resp){
          if(resp.data!=null && resp.data!=undefined){
              console.log(resp.data);
              $scope.domainObjectsList = resp.data.domain_object;
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

    vm.getAttributesList();
    vm.getDomainObjectsInfo();

    vm.deleteElement = function(item){
         ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +item.name+ "'" +' ' + '?';
              $scope.onConfirmActivation = function (){
                  item.is_delete = true;
                  ngDialog.close();
              };
          }]
         });


    };

    vm.deleteField = function(item,type){
        $('.'+item.temp_id).collapse('hide');
        if(item.type=='section'){
            if(item.section_id==undefined){
              item.is_delete = true
            }
            else{
                if(type=='delete')
                  item.is_deleted = true
                else
                   vm.getDocumentsList($scope.state_id);
            }
        }
        else {
            if(item.element_id==undefined){
              item.is_delete = true
            }
            else{
               if(type=='delete')
                  item.is_deleted = true
               else
                  vm.getDocumentsList($scope.state_id);
            }
        }
    };

    vm.cancelField = function(item,type){
        if(type=='delete'){
            ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete ' +"'" +item.name+ "'" +' ' + '?';
                  $scope.onConfirmActivation = function (){
                     ngDialog.close();
                     vm.deleteField(item,type);

                  };
              }]
            });
        }
        else{
           vm.deleteField(item,type);
        }

    };

    vm.saveTable = function(data){
        angular.forEach(data.forDomainMapping,function(value){
        value.domain_mapping=data.entity+"."+value.attribute;
        delete value.entity;
        delete value.attribute;
        })
        var domap = data.forDomainMapping;
        var head = data.headings;
        data.headings = [];
        data.headings = angular.copy(domap);
        data.forDomainMapping = angular.copy(head);
        data.type = 'table';
        data.is_variable_field = false;
        delete data.entity;
        delete data['temp_id'];
    };

    $scope.recursiveInSave = function(data){
        for(var i = data.length - 1; i >= 0; i--){

           if(data[i].is_delete){
                data.splice(i,1);
           }
           else{
                if(data[i].type=='section'){
                   delete data[i]['temp_id'];
                   $scope.recursiveInSave(data[i].sections);
                }
                else if(data[i].type=='table'){
                    vm.saveTable(data[i]);
                }
           }
        }
        return true;
    };

    $scope.getresult = function(){
        $scope.recursive($scope.menuItems);
    };

    $scope.saveTemplate = function(obj){
        documentService.saveUnknownTemplate(vm.sess_id,obj).then(function(resp){
              if(resp.data.status == "success"){

                   $scope.state_id = resp.data.template_id;
                   var flag = vm.getDocumentsList($scope.state_id);

                        $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                        });


              }
              else{
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'danger',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
              }

        },function(err){
              console.log(err)
              $scope.showFieldSave = false;

              $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
              });
        });
    };

    $scope.saveInfo = function(){
        vm.documentTemplate.is_draft = false;
        if(vm.documentTemplate.template_type=='unknown_known'){
            $scope.menuItemsCopy = angular.copy($scope.menuItems);
            $scope.flag =  $scope.recursiveInSave($scope.menuItemsCopy);
            if($scope.flag){
                vm.documentTemplate.sections = $scope.menuItemsCopy;

            }
            delete vm.documentTemplate['domain_mapping'];
        }
        else{
            delete vm.documentTemplate['sections'];
        }
        $scope.saveTemplate(vm.documentTemplate);


    };

    $scope.openId = function (id) {
        var str = id.split('_');
        var id =''
        $('.panel-collapse.in').removeClass('in');
                 // $(".group"+''+data.groupName).addClass('in');
                 // $(".group"+''+data.groupName).removeAttr( 'style' );
                 // $(".showRow"+ ''+data.indexObj.childIndex).addClass('in');
                 // $(".showRow"+''+data.indexObj.childIndex).removeAttr( 'style' );
        for(var i=0;i<str.length;i++){
            if(i==0)
               id = id+''+str[i];
            else
              id = id+'_'+str[i];

            $("."+id).addClass('in');
            $("."+id).removeAttr( 'style' );
        }
    };

    $scope.getData = function(){
        $scope.state_id = $stateParams.id;
        vm.documentTemplate = {};
        vm.documentTemplate.template_type = 'unknown_known';
        if($scope.state_id=='new'){
             $scope.showKnownData = false;
             $scope.showTemplate = true;
             $scope.menuItems = [{
                                    "name": "default",
                                    "type": "section",
                                    "section_id": "default",
                                    "sections": []
             }];
             $scope.getresult();

        }else{

             vm.getDocumentsList($scope.state_id);
        }

    };

    $scope.showEntity = function(item){
        console.log(item);
        return item.entities;
    };

    $scope.getData();

    $scope.sendDic = function(files){
          var file = files;
          if(file.length==0){

          }
          else{
             file.upload = Upload.upload({
                  url: 'api/documentTemplates/test/',
                  method: 'POST',
                  headers: {"sess_token": $scope.loginData.sess_id},
                  data:{'data':JSON.stringify({"template_name": vm.documentTemplate.template_name,"template_id":vm.documentTemplate.template_id})},
                  file: file
             });
             file.upload.then(function (response) {

                  if(response.data.status=='success'){
                             $scope.getTrainDetails($scope.state_id);
                              $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'success',
                                 timeout : 2000,
                                 pos     : 'top-center'
                              });
                              $scope.afterUpload = true;
                              $scope.getTestList();
                  }else{
                    $.UIkit.notify({
                         message : response.data.msg,
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                    });
                  }




             }, function (response) {
                   $.UIkit.notify({
                     message : 'Error in file upload',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                   });
                  //alert("error");
             });
          }

    };

    $scope.itemDocId="";
    vm.getGroups = function () {
        documentService.getTestHierarchyData(vm.sess_id,$scope.itemDocId).then(function(resp){
              if(resp.data.status == "success"){
                   if(resp.data.enriched_data!=undefined){
                       $scope.extractOutput = resp.data.enriched_data;
                       $scope.current_page = 1;
                       $scope.current_selection_page_no = 1;
                       $rootScope.selectedIndex =-1;
                       $rootScope.selectedPage = -1;
                   }
                   else{
                      $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                       });
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

        },function(err){
              console.log(err)
              $scope.showFieldSave = false;

              $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
              });
        });
    };



    $scope.getHierarchyData = function(item,index){
            $scope.itemDocId=item.doc_id;
            $scope.recordData=item;
            $scope.activeClass = [];
            $scope.activeClass[index] = "activeButton";
            $scope.documentInfo = item;
            $scope.initialiseDrawerAndSelector();
            $scope.imagePaths = angular.copy($scope.documentInfo.pages);
            angular.forEach($scope.imagePaths, function(value,key){
                $scope.imagePaths[key].file_path = "/static"+$scope.volume+$scope.imagePaths[key].file_path;
            });
            //$scope.imagePaths = [{ "file_path": "./app/images/working.png", "page_no": 1 }, { "file_path": "./app/images/working.png", "page_no": 2 }]
            $("#ImageLocation").empty();
            var htmlContent = "<div ng-repeat='path in imagePaths track by $index' id='page_{$ path.page_no $}' name='{$ path.page_no $}' class='post'>{$ path.page_no $}<div class='panel panel-default' form-image form-src='path.file_path' form-max width='auto' form-selector='selector[$index+1]' form-drawer='drawer[$index+1]'></div></div>"
            var el = $compile( htmlContent )($scope);
            var element = document.getElementById("ImageLocation");
            angular.element(document.getElementById("ImageLocation")).append(el);
            $scope.currentDocId = item.doc_id;
            $scope.extractOutput = [];
            documentService.getTestHierarchyData(vm.sess_id,item.doc_id).then(function(resp){
                  if(resp.data.status == "success"){
                       if(resp.data.enriched_data!=undefined){
                           $scope.extractOutput = resp.data.enriched_data;
                           $scope.current_page = 1;
                           $scope.current_selection_page_no = 1;
                           $rootScope.selectedIndex =-1;
                           $rootScope.selectedPage = -1;
                       }
                       else{
                          $.UIkit.notify({
                               message : resp.data.msg,
                               status  : 'success',
                               timeout : 3000,
                               pos     : 'top-center'
                           });
                       }
                       //$scope.getresultByHierarchy();
                  }
                  else{
                       $.UIkit.notify({
                               message : resp.data.msg,
                               status  : 'danger',
                               timeout : 3000,
                               pos     : 'top-center'
                       });
                  }

            },function(err){
                  console.log(err)
                  $scope.showFieldSave = false;

                  $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                  });
            });
    };
    $.fn.isInViewport = function() {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();

      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();

      return elementBottom > viewportTop && elementTop < viewportBottom;
    };
    angular.element(document.querySelector('#scrollImage')).bind('scroll', function(){
        $('.post').each(function() {
            var activePage = $(this).attr('name');
            if ($(this).isInViewport()) {
                $('.pagination-text').val(activePage);
            };
        });
    });

    $scope.getTestList = function(){
        $scope.testList = [{"file_name":"CMS","doc_id":""},{"file_name":"CSF","doc_id":""},{"file_name":"CMS","doc_id":""},{"file_name":"Resume","doc_id":""}];
        documentService.getUnknownTestTemplates(vm.sess_id,vm.documentTemplate.template_id).then(function(resp){
              if(resp.data.status == "success"){
                   $scope.testList = resp.data.data.documents;
                   $scope.volume = resp.data.data.volume;
                   if($scope.testList.length>0){
                        $scope.afterUpload = true;
                        $scope.getHierarchyData($scope.testList[0],0);
                   }else{
                        $scope.afterUpload = false;
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

        },function(err){
              console.log(err)
              $scope.showFieldSave = false;

              $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
              });
        });


    };

    $scope.activeClass = [];
    $scope.loadPdfData = function(index){
        $scope.activeClass = [];
        $scope.activeClass[index] = "activeButton";
    };
    vm.enableSelector = function(){
        $scope.zoomDisplay = 'zoomSize';
        for(var i=0;i<$scope.documentInfo.no_of_pages;i++){
           $scope.selector[i+1].clear();
           $scope.selector[i+1].enabled=true;
        }
        $scope.zoomDisplay = 'zoomSize1';
        setTimeout(function(){
            var topPos = document.getElementById('page_'+$scope.current_page).offsetTop;
            var scrollingElement = angular.copy(topPos);
            document.getElementById('scrollImage').scrollTop = scrollingElement;
        },200);
        $rootScope.imageBlur='';
        $rootScope.highlight=[];
   };
   vm.disableSelector = function(){
           $scope.current_page = 1;
           $scope.current_selection_page_no = 1;
           $rootScope.selectedIndex =-1;
           $rootScope.selectedPage = -1;
        for(var i=0;i<$scope.documentInfo.no_of_pages;i++){
           $scope.selector[i+1].clear();
           $scope.drawer[i+1] = [];
           $scope.selector[i+1].enabled=false;
        }
        $scope.zoomDisplay = 'zoomSize';
        $rootScope.imageBlur='';
        setTimeout(function(){
                       var topPos = document.getElementById('page_'+$scope.current_page).offsetTop;
                       var scrollingElement = angular.copy(topPos*0.25);
                       document.getElementById('scrollImage').scrollTop = scrollingElement;
                       document.getElementById('scrollImage').scrollLeft = 0;
        },300);

   };

   $scope.initialiseDrawerAndSelector = function(){
        $scope.drawer = [];
        $scope.selector=[];
        for(var i=0;i<$scope.documentInfo.no_of_pages;i++){
            $scope.drawer[i+1] = [];
            $scope.selector[i+1] = {};
            $scope.selector[i+1].enabled=false;
            $scope.selector[i+1].id=i+1;
        }
   };

   vm.changePageNum = function (type) {
        if(type == 'next')
            $scope.current_page++;
        else
            $scope.current_page--;
        var zoomVal = $('.'+$scope.zoomDisplay).css( "zoom" );
        setTimeout(function(){
            var topPos = document.getElementById('page_'+$scope.current_page).offsetTop;
            var scrollingElement = angular.copy(topPos*zoomVal);
            document.getElementById('scrollImage').scrollTop = scrollingElement;
        },100);
   };

   vm.keyEnter = function (event) {
        if(event.which === 13) {
           if($scope.current_page<=$scope.documentInfo.no_of_pages) {
               if($scope.current_page>0){
                   var zoomVal =$('.'+$scope.zoomDisplay).css( "zoom" );
                    setTimeout(function(){
                       var topPos = document.getElementById('page_'+$scope.current_page).offsetTop;
                       var scrollingElement = angular.copy(topPos*zoomVal);
                       document.getElementById('scrollImage').scrollTop = scrollingElement;
                    },100);
               }
               else{
                    $.UIkit.notify({
                         message : 'Please Enter Page number',
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


   vm.updateDrawer = function(type,item){
        var obj = angular.copy(item);
        obj.x1 = obj[type+''+'_coordinates'].x1;
        obj.x2 = obj[type+''+'_coordinates'].x2
        obj.y1 = obj[type+''+'_coordinates'].y1;
        obj.y2 = obj[type+''+'_coordinates'].y2;
        obj.is_display = true;
        obj.stroke = $scope.rect.stroke;
        obj.color = $scope.rect.data_color;
        if(type=='value')
            obj.color = $scope.rect.marker_color;
        obj.index = $scope.drawer[obj.page_no].length;
        item.drawerIndexObj[type] = obj.index;
        $scope.drawer[obj.page_no].push(obj);
   };

   /*vm.getAttributeByHierarchy = function(data){
        if(data.current_value!=undefined){
            if(data.current_value.length>0){
                for(var i=0;i<data.current_value.length;i++){
                    if(data.current_value[i].value_coordinates!=undefined){
                        data.current_value[i].drawerIndexObj = {};
                        data.temp_id = data.temp_id;
                        vm.updateDrawer('value',data.current_value[i]);
                    }
                }
            }
        }

   };*/

   vm.enableSelectorInEdit = function(coordinates){
        for(var i=0;i<$scope.documentInfo.no_of_pages;i++){
           $scope.selector[i+1].clear();
           $scope.selector[i+1].enabled=false;
        }
        $scope.zoomDisplay = 'zoomSize1';
        setTimeout(function(){
            var topPos = document.getElementById('page_'+$scope.current_page).offsetTop;
            var scrollingElement = angular.copy(topPos+coordinates.y1-200);
            var scrollingElementLeft = angular.copy(coordinates.x1);
            document.getElementById('scrollImage').scrollTop = scrollingElement;
            document.getElementById('scrollImage').scrollLeft = scrollingElementLeft;
        },200);
        $rootScope.imageBlur='';
   };

   $scope.calculation = function(selectedItem){
        $scope.obj = {};
        var imageWidth = parseInt($scope.imageObj.width);
        var imageHeight = parseInt($scope.imageObj.height);
        $scope.obj.right = imageWidth-(selectedItem.x2-selectedItem.x1)-selectedItem.x1;
        $scope.obj.bottom = imageHeight-(selectedItem.y2-selectedItem.y1)-selectedItem.y1;
        $scope.obj.shleftRight = imageWidth-selectedItem.x1;
        $scope.obj.shcentertopleft = selectedItem.x1;
        $scope.obj.shcentertopright = imageWidth-selectedItem.x2;
        $scope.obj.shcentertopbottom = imageHeight-selectedItem.y1;
        $scope.obj.shcenterbottomleft = selectedItem.x1;
        $scope.obj.shcenterbottomright = imageWidth-selectedItem.x2;
        $scope.obj.shcenterbottomtop = selectedItem.y2;
        $scope.obj.shrightleft = selectedItem.x2;
   };

   vm.editZone = function(item,coordinates){

      //$rootScope.selectedIndex = index;
      $(".image-style").height($(window).height()-70);
      $rootScope.highlight=[];
      $rootScope.imageBlur='imageBlurDisplay';
//      $rootScope.highlight[index] = "highlightClass";
//      $scope.zoomDisplay = 'zoomSize1';

       $scope.imageObj={};
       $scope.imageObj.width = document.getElementById("calImage").style.width.replace("px","");
       $scope.imageObj.height = document.getElementById("calImage").style.height.replace("px","");
       $scope.calculation(coordinates);
        $scope.selector[item.page_no].x1 = coordinates.x1;
        $scope.selector[item.page_no].y1 = coordinates.y1;
        $scope.selector[item.page_no].x2 = coordinates.x2;
        $scope.selector[item.page_no].y2 = coordinates.y2;
//        if($scope.drawer[index].key == 'value')
//              $scope.selector.color = $scope.rect.marker_color;
//        else
//             $scope.selector.color = $scope.rect.data_color;
//        $scope.selector.stroke  = $scope.rect.stroke;
//        $scope.selector.enabled = true;

        if(document.getElementsByClassName("form-box")[$scope.current_page-1].style!=undefined){
            document.getElementsByClassName("form-box")[$scope.current_page-1].style.display = "none";
            document.getElementsByClassName("form-box")[$scope.current_page-1].style.top = coordinates.y1+"px";
            document.getElementsByClassName("form-box")[$scope.current_page-1].style.left = coordinates.x1+"px";
            document.getElementsByClassName("form-box")[$scope.current_page-1].style.bottom = ""+$scope.obj.bottom+"px";
            document.getElementsByClassName("form-box")[$scope.current_page-1].style.right = ""+$scope.obj.right+"px";
        }
        if(document.getElementsByClassName("form-shadow")[$scope.current_page-1].style!=undefined){
            document.getElementsByClassName("form-shadow left")[$scope.current_page-1].style.right = ""+$scope.obj.shleftRight+"px";
            document.getElementsByClassName("form-shadow center top")[$scope.current_page-1].style.left = ""+$scope.obj.shcentertopleft+"px";
            document.getElementsByClassName("form-shadow center top")[$scope.current_page-1].style.right = ""+$scope.obj.shcentertopright+"px";
            document.getElementsByClassName("form-shadow center top")[$scope.current_page-1].style.bottom = ""+$scope.obj.shcentertopbottom+"px";
            document.getElementsByClassName("form-shadow center bottom")[$scope.current_page-1].style.left = ""+$scope.obj.shcenterbottomleft+"px";
            document.getElementsByClassName("form-shadow center bottom")[$scope.current_page-1].style.right = ""+$scope.obj.shcenterbottoformight+"px";
            document.getElementsByClassName("form-shadow center bottom")[$scope.current_page-1].style.top = ""+$scope.obj.shcenterbottomtop+"px"
            document.getElementsByClassName("form-shadow right")[$scope.current_page-1].style.left = ""+$scope.obj.shrightleft+"px";
        }


    };

   vm.getCurrentValue = function(node,item){
         if(item.value_coordinates !=undefined){
             //$scope.initialiseDrawerAndSelector();
             item.drawerIndexObj = {};
             $scope.current_page = item.page_no;
             $rootScope.selectedPage = item.page_no;
             vm.updateDrawer('value',item);
             $rootScope.selectedIndex = item.drawerIndexObj.value;
             vm.enableSelectorInEdit(item.value_coordinates);
             vm.editZone(item,item.value_coordinates);
         }
   };

   $scope.recursiveByHierarchy = function(data){
        for(var i=0;i<data.length;i++){
           if(data[i].type=='attribute'){
              vm.getAttributeByHierarchy(data[i]);
           }
           else{
                $scope.recursiveByHierarchy(data[i].attributes);
           }

        }
   };

   $scope.getresultByHierarchy = function(){
        $scope.recursiveByHierarchy($scope.extractOutput);
   };

   $scope.editSectionName = function(item){
        item.name_edit = true;
        item.temp = angular.copy(item.name);
   };

   $scope.clearEditSectionName = function(item){
        item.name_edit = false;
        item.name = angular.copy(item.temp);
   };


    // Train Tab Functionalities


   $(".train").height($(window).height());
      vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
      $scope.uploadedDocuments = [];
      $scope.uploadImageShow = true;

      $scope.getTrainDetails = function(id){
          documentService.getTrainList(vm.loginData.sess_id,id).then(function(resp){
              if(angular.equals(resp.data.status,'success')){
                 $scope.uploadedDocuments = [];
                 if(resp.data.data!= undefined){
                    if(resp.data.data.length != 0){
                       $scope.uploadImageShow = false;
                       $scope.uploadedDocuments = resp.data.data;

                    }
                 }
              }
              else{
                 $.UIkit.notify({
                    message : resp.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                 });
              }
          },function(err){
              $.UIkit.notify({
                message : "Internal server error",
                status  : 'warning',
                timeout : 3000,
                pos     : 'top-center'
              });
          });
      };

      $scope.uploadFiles = function (files) {
          if (files && files.length) {
              Upload.upload({
                    url: 'api/documentTemplates/train/upload/',
                    method: 'POST',
                    headers: {"sess_token": vm.loginData.sess_id},
                    file: files,
                    data:{'data':JSON.stringify({"template_id":vm.documentTemplate.template_id})}
              }).then(function (response) {
                         if(response.data.status=='success'){
                             $scope.getTrainDetails($scope.state_id);
                              $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'success',
                                 timeout : 2000,
                                 pos     : 'top-center'
                              });
                         }else{
                            $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'danger',
                                 timeout : 2000,
                                 pos     : 'top-center'
                            });
                         }

              }, function (response) {
                       $.UIkit.notify({
                         message : 'Error in file upload',
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                       });

                  //alert("error");
              });


          }
      };

      $scope.trainigSet = function(){
          vm.sendDocObj = {};
          vm.sendDocObj.template_id = $scope.state_id;
          vm.sendDocObj.documents =[];
          angular.forEach($scope.uploadedDocuments,function(value,key){
                if(value.doc_state=='ready'){
                    vm.sendDocObj.documents.push(value.doc_id)
                }
          })
          if(vm.sendDocObj.documents.length>0){
              documentService.sendTrain(vm.loginData.sess_id,vm.sendDocObj).then(function(resp){
                 console.log(resp);
                 if(resp.data.status == "success"){
                     $scope.getTrainDetails($scope.state_id);
                     $.UIkit.notify({
                             message : resp.data.msg,
                             status  : 'success',
                             timeout : 2000,
                             pos     : 'top-center'
                     });
                 }
                 else{
                     $.UIkit.notify({
                             message : resp.data.msg,
                             status  : 'danger',
                             timeout : 2000,
                             pos     : 'top-center'
                     });
                 }
              });
          }
          else{
                $.UIkit.notify({
                             message : 'At least one sample should be in ready state to request training',
                             status  : 'danger',
                             timeout : 2000,
                             pos     : 'top-center'
                });
          }
      };

      vm.deleteTrainData = function(index){
        $scope.uploadedDocuments.splice(index,1);
      };

      $scope.deleteFile = function(data,index){
         ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete ' +"'" +data.metadata.file_name+ "'" +' ' + '?';
                  $scope.onConfirmActivation = function (){
                     ngDialog.close();
                     vm.deleteTrainData(index);

                  };
              }]
         });

      };


      // feedback code

      $scope.editAttr = function(node){
          $scope.selectedEleId = node.temp_id;
      };

      $scope.sendFeedback = function(){
          console.log($scope.extractOutput);
          var reqObj = {"feedback": $scope.extractOutput};
          documentService.sendFeedbackUnstruct(vm.sess_id,$scope.currentDocId,reqObj).then(function(resp){
              if(resp.data.status == "success"){
                   $scope.selectedEleId = "";
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
              }
              else{
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'danger',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
              }
          },function(err){
              $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
              });
          });
      };

      vm.callFeedback = function(){
          $scope.sendFeedback();
      };

      $scope.ignoreAttr = function(parent,index,node){
          var attr = node.$parentNodeScope.$modelValue.attributes[parent].attributes[index].name;
          ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to ignore ' +"'" +attr+ "'" +' attribute' + '?';
              $scope.onConfirmActivation = function (){
                  node.$parentNodeScope.$modelValue.attributes[parent].attributes.splice(index,1);
                  if(node.$parentNodeScope.$modelValue.attributes[parent].attributes.length == 0){
                      node.$parentNodeScope.$modelValue.attributes.splice(parent,1);
                  }
                  ngDialog.close();
                  vm.callFeedback();
              };
           }]
          });
      };

      $scope.removeCurrentVal = function(node,index){
          node.current_value.splice(index,1);
      };

      $scope.addCurrentVal = function(node){
          console.log(node);
          node.current_value.push({"value":""});
      };

      $scope.acceptAttr = function(node){
          node.is_accept = true;
          console.log($scope.extractOutput);
      };

      /******************************************************************************
                Entity Linking code starts here
      ******************************************************************************/
        $scope.moreValue={};
        $scope.isEditAttributeValue={};

        $scope.hoverIn = function(index,tempId){
          this.hoverEdit = true;
        };
        $scope.hoverOut = function(index,tempId){
          this.hoverEdit = false;
        };
        $scope.showMore = function(index,tempId){
          //this.moreValue = true;
          $scope.moreValue[tempId]="true";
        };
        $scope.showLess = function(index,tempId){
          //this.moreValue = true;
          $scope.moreValue[tempId]="false";
        };

        $scope.editAttributeValues = function(index,tempId,templateType){
            if(templateType!='known'){
                $scope.isEditAttributeValue[tempId]="true";
            }
        };
        $scope.cancelEditAttributeValues = function(index,tempId,templateType){
            $scope.isEditAttributeValue[tempId]="false";
        };
        $scope.saveEditAttributeValues = function(index,tempId,templateType,node,thisVal,parentIndex){
//            console.log("node=>", node);
//            console.log("index=>", index);
            console.log("chnages in extract" +$scope.extractOutput);

            var temidArray  = tempId.split("-");
            var entId=temidArray[temidArray.length-1];
            var entId1=entId.replace(/~/g, "-");

            var enKey = getKey(tempId);

            var elValue=[];
            var insId = "";
            angular.forEach(node.current_value, function(val, key){
                var curArr={};
                curArr.element_id=val.element_id;
                curArr.is_checked=val.is_checked;
                curArr.page_no=val.page_no;
                curArr.value=val.value;
                elValue.push(curArr);
            });
            insId = thisVal.$parentNodeScope.$modelValue.attributes[parentIndex].insight_id;

            var obj={
                "sess_id":vm.sess_id,
                "data":{
                        "insight_id": insId,
                        "entity_id": entId1,
                        "type": node.type,
                        "key": enKey,
                        "action": "upsert",
                        "doc_id":$scope.itemDocId,
                        "value":elValue
                      }
            };
            $scope.submitFeedback(obj,tempId);
        };

        $scope.submitFeedback = function(obj,tempId){
            obj.data.doc_id=$scope.itemDocId;
            var reqObj = {"sess_id":vm.sess_id,"data":{"feedback": obj.data,"formatedEntity":$scope.extractOutput}};
            documentService.saveEntityLinkingFeedback(reqObj).then(function (data) {
                if(data.data.status=="success"){
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'success',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                    $scope.isEditAttributeValue[tempId]="false";
                    $scope.newNode = "";
                    vm.attributeKey = "";
                    vm.attributeValue= "";
                    vm.getGroups();
                }
                else {
                    vm.getGroups();
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                }

            },function (err) {
                vm.getGroups();
                $.UIkit.notify({
                 message : "Internal server error @saveEntityLinkingFeedback",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            })
        };

        vm.deleteFeedback = function(index,tempId,templateType,node,parentIndex){
            if(tempId != undefined){
                var temidArray  = tempId.split("-");
                var entId=temidArray[temidArray.length-1];
                var entId1=entId.replace(/~/g, "-");

                var enKey = getKey(tempId);

                var elValue=[];
                var insId = "";
                angular.forEach(node.node.current_value, function(val, key){
                    var curArr={};
                    curArr.element_id=val.element_id;
                    curArr.is_checked=val.is_checked;
                    curArr.page_no=val.page_no;
                    curArr.value=val.value;
                    elValue.push(curArr);
                });
                insId = node.$parentNodeScope.$modelValue.attributes[parentIndex].insight_id;
                var obj={
                    "sess_id":vm.sess_id,
                    "data":{
                        "insight_id": insId,
                        "entity_id": entId1,
                        "type": node.node.type,
                        "key": enKey,
                        "action": "delete",
                        "doc_id":$scope.itemDocId,
                        "value":elValue
                    }
                };
                node.$parentNodeScope.$modelValue.attributes[parentIndex].attributes.splice(index,1);
                if(node.$parentNodeScope.$modelValue.attributes[parentIndex].attributes.length == 0){
                    node.$parentNodeScope.$modelValue.attributes.splice(parentIndex,1);
                }
                $scope.submitFeedback(obj,tempId);
                console.log(node.$parentNodeScope.$modelValue);
            }
            else{
                var tempId = node.temp_id;
                var obj={
                    "sess_id":vm.sess_id,
                    "data":{
                            "insight_id": "",
                            "type": "attribute",
                            "key": node.node.name,
                            "action": "delete",
                            "doc_id":$scope.itemDocId,
                            "value": [{
			                    "value": node.node.current_value[0].value,
			                    "is_checked": true
		                    }]
                        }
                    };
                node.$parentNodeScope.$modelValue.attributes[parentIndex].attributes.splice(index,1);
                if(node.$parentNodeScope.$modelValue.attributes[parentIndex].attributes.length == 0){
                    node.$parentNodeScope.$modelValue.attributes.splice(parentIndex,1);
                }
                console.log(node.$parentNodeScope.$modelValue);
                $scope.submitFeedback(obj,tempId);
            }
        };

        $scope.deleteAttributeValues = function(index,tempId,templateType,node,parentIndex){
            var attrKey = node.node.name;
            ngDialog.open({ template: 'confirmBox1',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete '+attrKey+ ' attribute';
                  $scope.onConfirmActivation = function (){
                        ngDialog.close();
                        vm.deleteFeedback(index,tempId,templateType,node,parentIndex);
                  };
              }]
            });
        };

        $scope.activeAttributeValues = function(index,tempId,templateType,node){
            var temidArray  = tempId.split("-");
            var entId=temidArray[temidArray.length-1];
            var entId1=entId.replace(/~/g, "-");

            var enKey = getKey(tempId);

            var elValue=[];
            angular.forEach(node.current_value, function(val, key){
                var curArr={};
                curArr.element_id=val.element_id,
                curArr.is_checked=val.is_checked,
                curArr.page_no=val.page_no,
                curArr.value=val.value
                elValue.push(curArr);
            });

            var obj={
                "sess_id":vm.sess_id,
                "data":{
                        "insight_id": "",
                        "entity_id": entId1,
                        "type": node.type,
                        "key": enKey,
                        "action": "accept",
                        "doc_id":$scope.itemDocId,
                        "value":elValue
                      }
            };
            documentService.acceptEntityLinking(obj).then(function (data) {
                if(data.data.status=="success"){
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'success',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                    vm.getGroups();
                }
                else {
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                }

            },function (err) {
                $.UIkit.notify({
                 message : "Internal server error @deleteAttributeValues",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            })
        };

        function getKey(tempId){
            if(tempId!=""){
                var keyVals  = tempId.split("-");
                var elkey="";
                for(var i=1;i<keyVals.length-1;i++){
                    if(i==keyVals.length-2)
                        elkey+=keyVals[i]
                    else
                        elkey+=keyVals[i]+"."
                }
                console.log(elkey);
                return elkey;
            }
            else{
                return "";
            }

        }

        vm.addNewNode = function(node){
            $scope.newNode = node.temp_id;
            var temp = node.temp_id;
            var afterTemp = temp.replace("-",".");
            $scope.attributesList = $scope.entitiesList[afterTemp];
        };

        vm.cancelNewnode = function(){
            $scope.newNode = '';
            vm.attributeValue = "";
            vm.attributeKey = "";
        };

        vm.saveNewnode = function(node){
            var tempId = node.temp_id;
            var obj={
                "sess_id":vm.sess_id,
                "data":{
                        "insight_id": "",
                        "type": "attribute",
                        "key": vm.attributeKey,
                        "action": "upsert",
                        "doc_id":$scope.itemDocId,
                        "value": [{
			                "value": vm.attributeValue,
			                "is_checked": true
		                }]
                      }
            };
            var pushObj = {
                    "attributes": [{
                        "name": vm.attributeKey,
                        "current_value": [{
                            "value": vm.attributeValue,
                            "is_checked": true
                        }],
                        "type": "attribute"
                    }],
                    "entity_id": node.entity_id,
                    "type": "attribute"
				}
			node.attributes.push(pushObj);
			$scope.submitFeedback(obj,tempId);
        };

        vm.completeReview = function(){
            var text = $scope.recordData.metadata.file_name;
            var doc_id = $scope.currentDocId;
            ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to complete the review for '+"'"+text+"'"+' ?';
                  $scope.onConfirmActivation = function (){
                             ngDialog.close();
                             documentService.saveCompleteReviewEntLink({'data':doc_id,'sess_id':vm.sess_id}).then(function(resp){
                                  if(resp.data.status == "success"){

                                       $.UIkit.notify({
                                               message : resp.data.msg,
                                               status  : 'success',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });

                                       $state.go('app.documentsList');
                                  }
                                  else{
                                       $.UIkit.notify({
                                               message : resp.data.msg,
                                               status  : 'danger',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });
                                  }
                             },function(err){
                                  $.UIkit.notify({
                                         message : "Internal server error",
                                         status  : 'warning',
                                         timeout : 3000,
                                         pos     : 'top-center'
                                  });
                             });

                  };
              }]
            });
        };

      /******************************************************************************
                Entity Linking code ends here
      ******************************************************************************/
      /******************************************************************************
                Thresholds code starts here
      ******************************************************************************/
      vm.mappingEntities=[];

      vm.getAllMappingEntities = function(tempId,sessId){
            documentService.getMappingEntities(tempId,sessId).then(function (data) {
                if(data.data.status=="success"){
                    vm.mappingEntities=data.data.data;
                }
                else {
                    vm.mappingEntities=[];
                }
            },function (err) {
                $.UIkit.notify({
                 message : "Internal server error @getMappingEntities",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
                vm.mappingEntities=[];
            });
        };

        vm.getAllMappingEntities($stateParams.id,vm.sess_id);


        $scope.setDisplayLabel=function(key){
            if(key!=""){
                var text = key.replace(/_/g, " ");

                var res = text.split(' ')
               .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
               .join(' ')

                return res;
            }
            else{
                return "";
            }
        };
        $scope.slider = {
            value: 60,
            options: {
              floor: 0,
              ceil: 100,
              step: 1,
              minLimit: 0,
              maxLimit: 100,
              showSelectionBar: true,
              hidePointerLabels: true,
              hideLimitLabels: true,
              autoHideLimitLabels: true,
              getSelectionBarColor: function(value) {return '#8c8c8c8';},
              id: 'slider-id',
              onEnd: function(id, modelValue) {
                 $scope.onBlurVal=modelValue;
                 $scope.saveThresholds();
               },
              onStart: function(id, modelValue) {$scope.onFocusVal=modelValue;}
            }
        };

      $scope.refreshSlider = function () {
        setTimeout(function(){
            $scope.$broadcast('rzSliderForceRender');
        },500);
      };


      $scope.onBlurValue=function(val){
        $scope.onBlurVal=val;
        console.log("onBlurValue=>", $scope.onBlurVal);
        $scope.saveThresholds();
      };
      $scope.onFocusValue=function(val){
        $scope.onFocusVal=val;
        console.log("onFocusValue=>", $scope.onFocusVal);
      };

      $scope.saveThresholds=function(){
           if($scope.onFocusVal!=$scope.onBlurVal){
                var obj={"sess_id":vm.sess_id, "data":{
                "data":{"template_id":$stateParams.id,"thresholds":vm.thresholdsData}}};
                documentService.saveThresholds(obj).then(function (data) {
                    if(data.data.status=="success"){
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'success',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                    }
                    else {
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                    }
                    vm.getDocumentsList($scope.state_id);
                },function (err) {
                    $.UIkit.notify({
                     message : "Internal server error @saveThresholds",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                    vm.getDocumentsList($scope.state_id);
                });
           }
      };

    vm.processList=[{"name":"Annotation","value":"annotation"},
                    {"name":"Extraction","value":"extraction"},
                    {"name":"Post Processing","value":"post_processing"},
                    {"name":"Page Classification","value":"page_classification"}];

    vm.objOfNewThreshold={"process":"","attribute":"", "score":0};
    var editIndex=null;
    vm.create = function(){
        $scope.labelForcreate="Create Custom Threshold";
        document.getElementById("createThreshold").style.width = "40%";
         vm.objOfNewThreshold={"process":"","attribute":"", "score":0};
         editIndex=null;
    };
    vm.cancelCustomThreshold =function(){
         document.getElementById("createThreshold").style.width = "0%";
         vm.objOfNewThreshold={"process":"","attribute":"", "score":0};
         editIndex=null;
    };

    $scope.slider1 = {
            value: 60,
            options: {
              floor: 0,
              ceil: 100,
              step: 1,
              minLimit: 0,
              maxLimit: 100,
              showSelectionBar: true,
              hidePointerLabels: true,
              hideLimitLabels: true,
              autoHideLimitLabels: true,
              getSelectionBarColor: function(value) {return '#8c8c8c';},
              id: 'slider1-id',
              onEnd: function(id, modelValue) { console.log(vm.objOfNewThreshold);},
              onStart: function(id, modelValue) {  }
            }
        };
        vm.saveCustomThreshold =function(){
            if(vm.objOfNewThreshold.attribute==""){
                $.UIkit.notify({
                 message : "Please select the Threshold for",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            }else if(vm.objOfNewThreshold.process==""){
                $.UIkit.notify({
                 message : "Please select the process",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            }
            else{

                if(editIndex!=null){
                vm.thresholdsData.custom[editIndex]=vm.objOfNewThreshold;
                }
                else{
                    if(!vm.thresholdsData.hasOwnProperty('custom')){
                        vm.thresholdsData['custom']=[];
                    }
                    vm.thresholdsData.custom.push(vm.objOfNewThreshold);
                }
                var obj={"sess_id":vm.sess_id, "data":{"data":{"template_id":$stateParams.id,"thresholds":vm.thresholdsData}}};
                documentService.saveThresholds(obj).then(function (data){
                    if(data.data.status=="success"){
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'success',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                        vm.cancelCustomThreshold();
                    }
                    else {
                        $.UIkit.notify({
                         message : data.data.msg,
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                        });
                    }
                    vm.getDocumentsList($scope.state_id);
                },function (err) {
                    $.UIkit.notify({
                     message : "Internal server error @saveCustomThreshold",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                    vm.getDocumentsList($scope.state_id);
                });
            }
        };

        vm.editCustomThreshold=function(cthObj,idx){
            editIndex=idx;
            vm.objOfNewThreshold.attribute=vm.thresholdsData.custom[idx].attribute;
            vm.objOfNewThreshold.process=vm.thresholdsData.custom[idx].process;
            vm.objOfNewThreshold.score=vm.thresholdsData.custom[idx].score;
            $scope.labelForcreate="Create Custom Threshold";
            document.getElementById("createThreshold").style.width = "40%";
            $scope.refreshSlider();
        };

        vm.deleteCustomThreshold=function(cthObj,idx){
            vm.thresholdsData.custom.splice(idx, 1);
            var obj={"sess_id":vm.sess_id, "data":{"data":{"template_id":$stateParams.id,"thresholds":vm.thresholdsData}}};
            documentService.saveThresholds(obj).then(function (data) {
                if(data.data.status=="success"){
                    $.UIkit.notify({
                     message : "Custom Threshold data deleted successfully",
                     status  : 'success',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                }
                else {
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                }
                vm.getDocumentsList($scope.state_id);
            },function (err) {
                $.UIkit.notify({
                 message : "Internal server error @deleteCustomThreshold",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
                vm.getDocumentsList($scope.state_id);
            });

        };

        vm.hoverText={"page_classification":{},"extraction":{},"annotation":{},"post_processing":{}};
        //Page Classification
        vm.hoverText.page_classification['document_threshold']="All documents with a lesser confidence score will not move to extraction without manual review";
        vm.hoverText.page_classification['entity_confidence_score']="All entities with a lesser confidence score will not require manual user review";

        //Extraction
        vm.hoverText.extraction['document_threshold']="All documents with a lesser confidence score will not move to post processing without manual review";
        vm.hoverText.extraction['entity_confidence_score']="All entities with a lesser confidence score will not require manual user review";

        //Annotation
        vm.hoverText.annotation['document_threshold']="All documents with a lesser confidence score will not move to post processing without manual review";
        vm.hoverText.annotation['entity_confidence_score']="All entities with a lesser confidence score will not require manual user review";

        //Post processing
        vm.hoverText.post_processing['document_threshold']="All documents with a lesser confidence score will not get processed without manual review";
        vm.hoverText.post_processing['entity_confidence_score']=" All entities with a lesser confidence score will not require manual user review";


      /******************************************************************************
                Thresholds code ends here
      ******************************************************************************/

}];
