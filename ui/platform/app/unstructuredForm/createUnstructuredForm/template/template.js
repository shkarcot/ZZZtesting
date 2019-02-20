'use strict';
angular.module('console.createUnStructuredForm')
  .config(function($provide) {
      $provide.decorator('$state', function($delegate, $stateParams) {
          $delegate.forceReload = function() {
              return $delegate.go($delegate.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
          };
          return $delegate;
      });
  })
  .controller('templateUnStructuredCtrl', function (
                              $scope,$state,$rootScope,$location,
                              Upload,$stateParams,ngDialog,
                              documentService,entitiesService,$window,$timeout) {
    var vm = this;
    vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
    vm.sess_id= vm.loginData.sess_id;
    $scope.showKnownInfo = function(){
        $scope.showCreate = true;
        $scope.showTemplate = false;
        if(vm.documentTemplate.template_type=='unknown_unknown'){
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

    $scope.getData = function(){
        $rootScope.state_id = $stateParams.id;
        vm.documentTemplate = {};
        vm.documentTemplate.template_type = 'unknown_known';
        if($rootScope.state_id=='new'){
             $scope.showKnownData = false;
             $scope.showTemplate = true;
             $scope.menuItems = [{
                                    "name": "default",
                                    "type": "section",
                                    "section_id": "default",
                                    "elements": []
             }];
             $scope.getresult();

        }else{

             vm.getDocumentsList($rootScope.state_id);
        }

    };
    vm.getDocumentsList = function(id){
        vm.thresholdsData={};
        $scope.onBlurVal="";
        $scope.onFocusVal="";
        documentService.getDocumentDetails(vm.sess_id,id).then(function(resp){
            console.log(resp);
            if(angular.equals(resp.data.status,'success')){
                vm.documentTemplate = resp.data.data;

                if(vm.documentTemplate){
                    $scope.template_id = vm.documentTemplate.template_id;
                    $scope.menuItems = vm.documentTemplate.elements;
                    if(vm.documentTemplate.template_type=='unknown_known')
                        $scope.getresult();
                    else
                        vm.documentTemplate.domain_mapping = vm.documentTemplate.elements[0].domain_mapping;

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

    $scope.uniqueIdGenerator = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    $scope.recursive = function(data){
        for(var i=0;i<data.length;i++){
            if(data[i].type=='section'){
                data[i].temp_id = $scope.uniqueIdGenerator();
                $scope.recursive(data[i].elements);
            }
            else if(data[i].type=='table'){
                data[i].temp_id = $scope.uniqueIdGenerator();
                vm.getTable(data[i]);

            //$scope.drawer.push(data[i]);
            }
        }
    };

    $scope.getresult = function(){
        $scope.recursive($scope.menuItems);
    };

    $scope.getData();

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    $scope.addElement = function(data,type){
        console.log("info"+JSON.stringify(data.item));
        var obj = {};
        if(type == 'section'){
            obj = {"name": "Section","type":"section","elements": [],"temp_id":$scope.uniqueIdGenerator()};
            if(data==''){
                $scope.menuItems.unshift(obj);
            }
            else{
               data.item.elements.unshift(obj);
            }
        }
        else if(type == 'table'){
            obj = {"name": "Table","type":type,"temp_id":$scope.uniqueIdGenerator(),"entity":"","headings":[{"domain_mapping":"","entity":"","attribute":"","column":[]},{"domain_mapping":"","entity":"","attribute":"","column":[]}]};
            if(data==''){
                $scope.menuItems.unshift(obj);
            }
            else{
                data.item.elements.unshift(obj);
            }
        }

        setTimeout(function(){
            $("."+obj.temp_id).addClass('in');
            $("."+obj.temp_id).removeAttr( 'style' );
        },100);
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
                   vm.getDocumentsList($rootScope.state_id);
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
                  vm.getDocumentsList($rootScope.state_id);
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
                   $scope.recursiveInSave(data[i].elements);
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

                   $rootScope.state_id = resp.data.template_id;
                   $rootScope.unknown_template_name  = obj.template_name;

                        $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                        });
                   $state.go("app.unstructuredForm");
//                   var flag = vm.getDocumentsList($rootScope.state_id);

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
        if(vm.documentTemplate.template_type=='unknown_known'){
            $scope.menuItemsCopy = angular.copy($scope.menuItems);
            $scope.flag =  $scope.recursiveInSave($scope.menuItemsCopy);
            if($scope.flag){
                vm.documentTemplate.elements = $scope.menuItemsCopy;

            }
            delete vm.documentTemplate['domain_mapping'];
        }
        else{
            vm.documentTemplate.elements = [{
                                        "name": "default",
                                        "type": "section",
                                        "section_id": "default",
                                        "elements": []
                                    }];
            vm.documentTemplate.elements[0].domain_mapping = vm.documentTemplate['domain_mapping'];
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

  });
