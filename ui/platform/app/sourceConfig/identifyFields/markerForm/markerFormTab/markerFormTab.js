'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.markerForm')
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
  .controller('markerFormTabCtrl', function ($scope,$sce,$compile,Upload,$rootScope,ngDialog,$state,$stateParams,$window,documentService,entitiesService,$timeout,dataManagementService) {

    var vm = this;
    $scope.selector = {};
    $scope.selector.enabled=false;
    $scope.zoomDisplay = 'zoomSize';
    $scope.entitiesObj={};
    $scope.selectedRules = {};
    $scope.rect = {
        data_color: '#337ab7',
        marker_color: '#00ad2d',
        section_color:'#FF0000',
        stroke: 5
    };
    vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
    vm.sess_id= vm.loginData.sess_id;
    vm.conditionErr = "";
    vm.validateErr = "";
    vm.data = [];
    vm.orderVal = 0;
    $rootScope.currentState = 'documentTemplate';
    $scope.current_page = 1;
    $scope.current_selection_page_no = 1;
    $rootScope.selectedIndex =-1;
    $rootScope.selectedPage = -1;
    $(".image-style").height($(window).height());
    $(".image-style1").height($(window).height());
    $(".image-style2").height($(window).height()-25);
    $(".image-style3").height($(window).height()-200);
    $(".create-rule-height").height($(window).height()-80);

    function toggleIcon(e) {
        $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('fa fa-chevron-down fa fa-chevron-up');
    }
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);

    $scope.goToDocumentTemplate = function(){
        var engine = localStorage.getItem("engineName");
        $state.go("app.documentTemplate");
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

    vm.getAttributesList = function(){
       //$scope.entitiesList = {'claim':['abc','bcde','eft'],'claim.patient':['abc','hgf'],'claim.patient.person':['ssf','ssf'],'claim.patient.person.abcv.sffdfscs.errg.dggffdd':['ssdfedfdf','sfdfdfdscsc'],'cms':['sfsf','sfsf']};

      entitiesService.getDomainObjects({'sess_id':vm.sess_id}).then(function(resp){


          $scope.entitiesList = resp.data;
          $scope.entitiesObj =  $scope.entitiesList;
          $rootScope.$broadcast('entitiesList',{"data": $scope.entitiesList});
//      angular.forEach($scope.entitiesList,function(value,key){
//          $scope.entitiesObj[value.entity_name] = value;
//      })


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

    $scope.getAttribute = function(name){
      $scope.listOfAttributes=[];
      $scope.listOfAttributes = $scope.entitiesObj[name];
    };
    vm.listOfTableAttributes=[]
    vm.getTableAttribute = function(name,index){
     vm.listOfTableAttributes[index]=$scope.entitiesObj[name].attributes;
    }

    vm.getAttributesList();

    vm.renderHTMLData = function(){
       return $sce.trustAsHtml(vm.renderHtml);
    };

    $rootScope.$on("edited",function(evt,data){
            $scope.openId(data.temp_id);
//          window.scrollTo(0,0);
//          $('.panel-collapse.in')
//            .removeClass('in');
//
//          if(data.type=='field'){
//              $(".fields").addClass('in');
//              $(".fields").removeAttr( 'style' );
//              $(".fieldsData"+data.index).addClass('in');
//              $(".fieldsData"+data.index).removeAttr( 'style' );
//               setTimeout(function(){
//                    var topPos = document.getElementById('fieldsData'+ data.index).offsetTop;
//                    console.log(topPos);
//                    var scrollingElement = angular.copy(topPos-100);
//                    document.getElementById('scrollDiv').scrollTop = scrollingElement;
//                },100);
//          }
//          else{
//              $(".omr").addClass('in');
//              $(".omr").removeAttr( 'style' );
//              $(".OMRData"+data.index).addClass('in');
//              $(".OMRData"+data.index).removeAttr( 'style' );
              setTimeout(function(){
                    var topPos = document.getElementsByClassName(data.temp_id)[0].offsetTop;
                    var scrollingElement = angular.copy(topPos-100);
                    document.getElementById('scrollDiv').scrollTop = scrollingElement;
              },100);
//          }

    })



    //Table//

    $scope.tableName="";
    $scope.rowGap="";
    $scope.showSaveBtn=false;
    $scope.showSpinner=false;
    vm.addTable =[];
    vm.tableEditDomain = [];
    vm.tableAttrEditDomain = [];
    $scope.addTableRow=function(){
        if(vm.addTable.length>0){
            $.UIkit.notify({
               message : "Please save the existing table.",
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
           });
        }
        else{
            // if(vm.documentDetails.doc_type=='excel'){
            //   if(vm.documentDetails.doc_headings.length>0){
            //     vm.addTable.push({"headings":[]});
            //     angular.forEach(vm.documentDetails.doc_headings,function(value,key){
            //        var obj ={"domain_mapping":"","entity":"","attribute":"","column":[]};
            //            obj.name = value.name;
            //            obj.col_no = value.col_no;
            //            obj.column.push(value.name);
            //        vm.addTable[0].headings.push(obj);
            //     })
            //
            //   }else{
            //     vm.addTable.push({"headings":[{"domain_mapping":"","entity":"","attribute":"","column":[]},{"domain_mapping":"","entity":"","attribute":"","column":[]}]});
            //   }
            // }
            // else{
                vm.addTable.push({"headings":[{"domain_mapping":"","entity":"","attribute":"","column":[]},{"domain_mapping":"","entity":"","attribute":"","column":[]}]});
            //}
            $scope.showAddTable = true;
            vm.showTableMapping = false;
            vm.showDone = true;
            vm.listOfTableAttributes=[];
        };
    };

    $scope.addColumn = function(idx){
        vm.data[idx].headings.push({"domain_mapping":"","entity":"","attribute":"","column":[]});
    };

    $scope.addSubColumnInEdit = function(idx,index){
        if(vm.data[idx].headings[index].subColumn == undefined){
            vm.data[idx].headings[index].subColumn = angular.copy([]);
        }
        vm.data[idx].headings[index].subColumn.push([]);
    };

    $scope.removeTableSubColumnInedit = function (data,cellIndex,parentIndex) {
        data.subColumn.splice(cellIndex,1);
        if(data.subColumn.length == 0){
            delete data["subColumn"];
        }
        $scope.columnAddedInEdit(parentIndex);
    };

    $scope.deleteTable = function (obj,index,name) {
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +name+ "'" +' ' + 'table ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.deleteFieldData('Table',obj);
              };
          }]
        });
    };

    $scope.columnAddedInEdit = function(inx){
        setTimeout(function(){
          vm.data[inx].forDomainMapping = [];
          var tableHead = angular.copy(vm.data[inx].headings);
          for(var i=0;i<tableHead.length;i++){
             if(tableHead[i].subColumn != undefined){
                if(tableHead[i].subColumn.length>0){
                    for(var j=0;j<tableHead[i].subColumn.length;j++){
                        var col = angular.copy(vm.data[inx].headings[i]);
                        col.subColumn = [];
                        col.subColumn[0] = tableHead[i].subColumn[j];
                        vm.data[inx].forDomainMapping.push(col);
                    }
                }
                else{
                    vm.data[inx].forDomainMapping.push(tableHead[i]);
                }
             }
             else{
                vm.data[inx].forDomainMapping.push(tableHead[i]);
             }
          }
          $scope.$apply();
        }, 500);
    };

    vm.addedColumns = function(){
      vm.showTableMapping = true;
      vm.showDone = false;
      vm.addTable[0].forDomainMapping = [];
      var tableHead = angular.copy(vm.addTable[0].headings);
      for(var i=0;i<tableHead.length;i++){
         if(tableHead[i].subColumn != undefined){
            if(tableHead[i].subColumn.length>0){
                for(var j=0;j<tableHead[i].subColumn.length;j++){
                    var col = angular.copy(vm.addTable[0].headings[i]);
                    col.subColumn = [];
                    col.subColumn[0] = tableHead[i].subColumn[j];
                    vm.addTable[0].forDomainMapping.push(col);
                }
            }
            else{
                vm.addTable[0].forDomainMapping.push(tableHead[i]);
            }
         }
         else{
            vm.addTable[0].forDomainMapping.push(tableHead[i]);
         }
      }
    };



    vm.saveNewTable = function(){


        vm.data.unshift(vm.addTable[0]);
        vm.saveTableData(vm.addTable[0],0)

    };

    vm.cancelTable = function(){
        vm.addTable =[];
        $scope.showAddTable = false;
        vm.showTableMapping = true;
        vm.showDone = false;
        vm.listOfTableAttributes=[];
    };

    vm.tableEdit = function(obj,index){
      vm.tableEditDomain = [];
      vm.tableEditDomain[index] = true;
    };



    vm.removeTableEdit = function(obj,index, val){
        vm.tableEditDomain[index] = false;
        $scope.getAttribute(val)
    };

    vm.tableAttrEdit = function(obj,pindex,index,val){
      $scope.getAttribute(val)
      vm.tableAttrEditDomain[pindex]=[];
      vm.tableAttrEditDomain[pindex][index] = true;
    };

    vm.removeTableAttrEdit = function(obj,pindex,index){
        vm.tableAttrEditDomain[pindex][index] = false;
    };

    //Field//
    vm.editFiledLabelData = [];
    vm.editFiledValueData = [];
    vm.addField = function(obj){
        vm.dataObj.has_label = false;
        vm.dataObj.has_label_false = false;
        vm.dataObj.variable_label = false;
        vm.dataObj.variable_label_false = false;
        vm.dataObj.isDomain = "yes";
        $scope.addValueLabel = false;
        $scope.addFieldLabel = false;
        $scope.showDomainObj = false;
        vm.editFiledLabelData = [];
        $scope.rulesSelectArray = [];
        $scope.selectedRules = {};
        vm.selectedRulesWithObj = [];
    };

    vm.cancelField = function(item){

//        for (var i = $scope.drawer.length - 1; i >= 0; i--) {
//            if ($scope.drawer[i].hasOwnProperty('NewKey')) {
//              if($scope.drawer[i].type=='field')
//                $scope.drawer.splice(i, 1);
//            }
//        }
//        vm.dataObj={};
//        $scope.showConfig = false;
//        $scope.croppingError = false;
//        $scope.selector.clear();
//        $scope.zoomDisplay = 'zoomSize';
//        $scope.selector.enabled=false;
//        vm.enableRule = false;
//        $scope.rulesSelectArray = [];
//        $scope.selectedRules = {};
        $('.'+item.temp_id).collapse('hide');
        item.is_delete = true;
        vm.disableSelector();
        vm.getDocumentsList($stateParams.id);
    };


    $scope.addRuleForVariable = function(){
        vm.newRule();
        vm.ruleResult = "";
        vm.ruleFailedmessage = false;
        vm.ruleSuccessmessage = false;
        vm.sourceValue = "";
        document.getElementById("ruleOverlayDiv").style.width = " 58%";
    };
    $scope.existingRulesdiv = function(){
        vm.getRules();
        $scope.rulesSelectArray = vm.selectedRulesWithObj.map(function(e){return e.rule_id});
        $scope.selectedRules = {};
        angular.forEach(vm.allRules,function(value,key){
            $scope.selectedRules[value.rule_id] = false;
            var index = $scope.rulesSelectArray.indexOf(value.rule_id);
            if(index != -1)
                $scope.selectedRules[value.rule_id] = true;
        });
        document.getElementById("existingruleDiv").style.width = " 58%";
    };
    $scope.existingRulesdivforEdit = function(listObj){
        $scope.rulesSelectArray = vm.selectedRulesWithObj.map(function(e){return e.rule_id});
        vm.getRules();
        angular.forEach(vm.allRules,function(value,key){
            $scope.selectedRules[value.rule_id] = false;
            var index = $scope.rulesSelectArray.indexOf(value.rule_id);
            if(index != -1)
                $scope.selectedRules[value.rule_id] = true;
        });
        document.getElementById("existingruleDiv").style.width = " 58%";
    };
    $scope.cancel = function(){
        document.getElementById("ruleOverlayDiv").style.width = "0%";
        vm.ruleFailedmessage = false;
        vm.ruleSuccessmessage = false;
        vm.ruleResult = "";
        $scope.outputOfTestCondition = "";
        $scope.outputOfTestAction = "";
        vm.sourceConditionValue = "";
        vm.targetConditionValue = "";
        vm.sourceActionValue = "";
        vm.targetActionValue = "";
        $scope.initialCodeInEditor();
        $scope.customConditionName = "";
        $scope.customActionName = "";
        vm.sourceValue = "";
    };
    $scope.cancelExisting = function(){
        document.getElementById("existingruleDiv").style.width = "0%";
        vm.sourceConditionValueInEdit = "";
        vm.targetConditionValueInEdit = "";
        vm.sourceActionValueInEdit = "";
        vm.targetActionValueInEdit = "";
        $scope.outputOfTestConditionInEdit = "";
        $scope.outputOfTestActionInEdit = "";
    };

    vm.changeLabel = function(item,value){
        vm.enableSelector();
        if(value=='yes'){
            item.has_label = 'yes';
            item.has_label_false = false;
        }
        else{
            item.has_label = false;
            item.has_label_false = 'no';
            for (var i = $scope.drawer[$scope.current_selection_page_no].length - 1; i >= 0; i--) {
                if($scope.drawer[$scope.current_selection_page_no][i].type=='field'){
                    if ($scope.drawer[$scope.current_selection_page_no][i].hasOwnProperty('label_coordinates')) {
                      if($scope.drawer[$scope.current_selection_page_no][i].tem_id==item.tem_id && $scope.drawer[$scope.current_selection_page_no][i].index == item.drawerIndexObj.label ){
                         $scope.drawer[$scope.current_selection_page_no][i].is_display = false;
                         break;
                      }
                    }
                }
            }
            item.addFieldLabel = false;
        }
        if($scope.drawer[$scope.current_page].length>0){
            setTimeout(function(){
                var topPos = document.getElementById('page_'+$scope.current_page).offsetTop;
                var scrollingElement = angular.copy(topPos+$scope.drawer[$scope.current_page][$scope.drawer[$scope.current_page].length-1].coordinates.y1-200);
                var scrollingElementLeft = angular.copy($scope.drawer[$scope.current_page][$scope.drawer[$scope.current_page].length-1].coordinates.x1);
                document.getElementById('scrollImage').scrollTop = scrollingElement;
                document.getElementById('scrollImage').scrollLeft = scrollingElementLeft;
            },200);
        }
    };

    vm.changeVariable = function(value){
         if(value=='yes'){
               vm.dataObj.variable_label = 'yes';
               vm.dataObj.variable_label_false = false;
         }
         else{
              vm.dataObj.variable_label = false;
              vm.dataObj.variable_label_false = 'no';
         }
    };

    vm.addLabel = function(item,value){
        $scope.croppingError = false;
        if(value){
            if($scope.checkObjectLength($scope.selector[$scope.current_selection_page_no])){
               if($scope.selector[$scope.current_selection_page_no].x1!=undefined){
                   var obj = $scope.selector[$scope.current_selection_page_no];
                   item.page_no =  $scope.current_selection_page_no;
                   item.parameters = {};
                   item.parameters.label_coordinates=[];
                   item.parameters.label_coordinates[0] = {};
                   item.parameters.label_coordinates[0].x1=obj.x1;
                   item.parameters.label_coordinates[0].x2=obj.x2;
                   item.parameters.label_coordinates[0].y1=obj.y1;
                   item.parameters.label_coordinates[0].y2=obj.y2;
                   item.parameters.label_coordinates[0].page_number = $scope.current_selection_page_no;
                   vm.updateDrawer('label',item);
                   item.addFieldLabel = true;
                   for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                       $scope.selector[i+1].clear();
                       $scope.selector[i+1].enabled=true;

                   }
               }
               else{
                     $scope.croppingError = true;
                     $scope.cropMsg = 'Please select the label region';
                      alert('select the co-ordinates');

               }

            }else{
                 $scope.croppingError = true;
                 $scope.cropMsg = 'Please select the label region';
                  alert('select the co-ordinates');

            }
        }

    };

    vm.addValue = function(item,value){

        $scope.croppingError = false;
        if(value){
            $scope.croppingError = false;
           if($scope.selector[$scope.current_selection_page_no].x1!=undefined){
               var obj = $scope.selector[$scope.current_selection_page_no];
               item.page_no =  $scope.current_selection_page_no;
               item.coordinates=[];
               item.coordinates[0] = {};
               item.coordinates[0].x1=obj.x1;
               item.coordinates[0].x2=obj.x2;
               item.coordinates[0].y1=obj.y1;
               item.coordinates[0].y2=obj.y2;
               item.coordinates[0].page_number = item.page_no;
               vm.updateDrawer('value',item);
               vm.disableSelector();
               item.addValueLabel = true;
               item.showDomainObj = true;



            }else{
                 $scope.croppingError = true;
                 $scope.cropMsg = 'Please select the value region';

            }
        }

    };


    vm.saveFieldData = function(type,obj){
    $scope.showFieldSave = true;
    documentService.saveConfigurations(vm.sess_id,obj).then(function(resp){
            $scope.showFieldSave = false;
              if(resp.data.status == "success"){
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                   if(type=='field'){
                       vm.dataObj={};
                       $scope.showConfig = false;
                   }
                   else if(type=='paragraph'){
                     vm.dataParagraphObj={};
                     $scope.showParagraph = false;
                   }
                   else{
                       vm.dataOMRObj={};
                       $scope.showOMRConfig = false;
                   }
                   $scope.zoomDisplay = 'zoomSize';
                   $scope.selector.enabled=false;
                   //getDocumentsList($stateParams.id,$scope.current_page);
                  vm.changeDocumentInfo($scope.current_page);

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



    vm.cancelEditField = function(list,index){
        vm.clearValue(index);
        $scope.listOfFields[index]=angular.copy($scope.orginalListOfFields[index]);
    };
    vm.cancelEditOMRField = function(list,index){
        vm.clearOMRValue(index);
        $scope.listOfOMRFields[index]=angular.copy($scope.orginalListOfOMRFields[index]);
    };

    vm.saveField = function(item){
           if(item.name != ""){
               $scope.croppingError = false;
               var obj  = angular.copy(item);
               if(obj.has_label){
                 if(!obj.parameters.hasOwnProperty('label_coordinates')){
                     $scope.croppingError = true;
                     $scope.cropMsg = 'Please select the label region';
                     return;
                 }

               }
               else{
                 obj.parameters = {};
                 obj.parameters.has_label = false;
                 if(obj.hasOwnProperty('label_coordinates')){
                   delete obj['label_coordinates'];
                 }
               }
               delete obj['drawerIndexObj'];
               delete obj['has_label_false'];
               delete obj['temp_id'];
               delete obj['addFieldLabel'];
               delete obj['addValueLabel'];
               delete obj['showDomainObj'];
               delete obj['label_edit'];
               delete obj['value_edit'];
               if(item.id != undefined){
                   if(obj.isDomain == "yes"){
                      if(obj.hasOwnProperty('domain_mapping')){
                         delete $scope.domain_mapping_obj[obj.domain_mapping]
                      }
                      obj.domain_mapping = obj.entity+"."+obj.attribute;
                      delete obj['entity'];
                      delete obj['attribute'];
                      delete obj['document_variable'];
                      delete obj['doc_var'];
                      delete obj['dup_doc_var'];
                      delete obj['rule_id'];
                      delete obj['variable_type'];
                      if(obj.hasOwnProperty('isChanged')){
                          if(obj.isChanged){
                              obj.doc_var = {};
                          }
                          delete obj['isChanged'];
                      }
                   }
                   if(obj.isDomain == "no"){
                       obj.doc_var = {};
                       obj.document_variable = obj.document_variable;
                       obj.doc_var.name = obj.document_variable;
                       obj.doc_var.type = obj.variable_type;
                       obj.doc_var.rule_id = [];
                       if(vm.enableRule) {
                           obj.doc_var.rule_id = vm.selectedRulesWithObj.map(function (e) {
                                   return e.rule_id
                           });
                       }
                      if(obj.hasOwnProperty('isChanged')){
                          delete obj['isChanged'];
                      }
                      delete obj['entity'];
                      delete obj['attribute'];
                      delete obj['domain_mapping'];
                      delete obj['variable_type'];
                      delete obj['rule_id'];
                      delete obj['dup_doc_var'];
                   }
               }
               var validate = false;
               if(item.id == undefined){
                   if(obj.isDomain == "yes"){
                      obj.domain_mapping = obj.entity+"."+obj.attribute;

                      if(obj.entity==undefined || obj.entity=='' || obj.entity==null || obj.attribute==undefined || obj.attribute=='' || obj.attribute==null){
                         validate = false;
                         vm.validateDocument = "please map the field to an attribute";
                         return;
                      }
                      if($scope.domain_mapping_obj.hasOwnProperty(obj.domain_mapping)){
                         validate = false;
                         vm.validateDocument = "Same domain mapping already selected";
                         return;
                      }else{
                        $scope.domain_mapping_obj[obj.domain_mapping] = '';
                      }
                      delete obj['entity'];
                      delete obj['attribute'];
                      delete obj['document_variable'];
                      delete obj['doc_var'];
                      delete obj['variable_type'];
                      delete obj['rule_id'];

                   }
                   if(obj.isDomain == "no"){
                      obj.document_variable = obj.document_variable;
                      obj.doc_var ={
                          "name":obj.document_variable,
                          "type":obj.variable_type,
                          "rule_id":vm.selectedRulesWithObj.map(function(e){return e.rule_id})
                      }
                      delete obj['entity'];
                      delete obj['attribute'];
                      delete obj['variable_type'];
                      delete obj['rule_id'];
                   }

               }else{
                    if($scope.domain_mapping_obj.hasOwnProperty(obj.domain_mapping)){
                         validate = false;
                         vm.validateDocument = "Same domain mapping already selected";
                         return;
                    }else{
                        $scope.domain_mapping_obj[obj.domain_mapping] = '';
                    }
               }

               if(obj.has_label == 'yes'){
                 obj.parameters.has_label = true;
               }
               if(obj.variable_label){
                 obj.is_variable_field = true;
               }
               else{
                obj.is_variable_field = false;

                delete obj['top_keys'];
                delete obj['bottom_keys'];
               }
               delete obj['variable_label'];
               delete obj['variable_label_false'];

               if(obj.isDomain == "yes"){
                   if(obj.domain_mapping != 'undefined.undefined' && obj.domain_mapping != "" && obj.domain_mapping != "."){
                       validate = true;
                       delete obj["isDomain"];
                   }
                   else{
                       vm.validateDocument = "please map the field to an attribute";
                   }
               }
               else{
                   if(obj.document_variable != undefined && obj.document_variable != ""){
                       validate = true;
                       delete obj["isDomain"];
                   }
                   else{
                       vm.validateDocument = "please enter the document variable name";
                   }
               }
               if(validate){
                   vm.validateDocument = "";
                   $scope.showeditableDomain=[];
                   vm.saveElement('field',obj,item);
               }
           }
           else{
               $.UIkit.notify({
                     message : "Field name is mandatory",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
               });
           }
    };

    vm.deleteFieldData = function(type,list){
        //$scope.listOfFields.splice(index,1);
        var obj = {};
            obj.template_id = $scope.template_id;
            obj.page_no = $scope.current_page;
            obj.id = list.id;
            obj.section_id = list.section_id;

        documentService.deleteField(vm.sess_id,obj).then(function (resp) {
            if(resp.data.status == 'success'){
               $.UIkit.notify({
                                 message : type+' deleted Successfully',
                                 status  : 'success',
                                 timeout : 3000,
                                 pos     : 'top-center'
                             });
               vm.changeDocumentInfo($scope.current_page)
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
                                 message : 'Internal Server Error',
                                 status  : 'warning',
                                 timeout : 3000,
                                 pos     : 'top-center'
                             });
        })

    };


    vm.deleteField = function(list,index){
      ngDialog.open({ template: 'confirmBox',
      controller: ['$scope','$state' ,function($scope,$state) {
          $scope.activePopupText = 'Are you sure you want to delete Field ?';
          $scope.onConfirmActivation = function (){
              ngDialog.close();
              vm.deleteFieldData('Field',list);
          };
      }]
      });
    };

    vm.changeLabelForEdit = function(listObj,value,index){
        vm.clearLabel(index);
        if(value=='yes'){
            $scope.croppingError = false;
            $scope.zoomDisplay = 'zoomSize1';
            $scope.selector.enabled=true;
            listObj.has_label = 'yes';
            listObj.has_label_false = false;
            listObj.default_label = true;
        }
        else{
            $scope.croppingError = false;
            $scope.zoomDisplay = 'zoomSize1';
            $scope.selector.enabled=true;
            listObj.has_label = false;
            listObj.has_label_false = 'no';
            //$scope.drawer.splice(listObj.drawerIndexObj.labelIndex,1);
            $scope.drawer[listObj.drawerIndexObj.labelIndex].show = true;

            listObj.default_label = false;
        }
        if($scope.listOfFields.length>0){
            setTimeout(function(){
              document.getElementsByClassName('image-style')[0].scrollTop = listObj.coordinates.y1 - 200;
              document.getElementsByClassName('image-style')[0].scrollLeft = listObj.coordinates.x1;
            }, 100);
        }
    };
    vm.doneAddLabelField = function(item){
            item.label_edit = false;
            $scope.croppingError = false;
            $scope.croppingError = false;
            if($scope.selector[item.page_no].x1!=undefined){
                   $rootScope.selectedPage = -1;
                   $rootScope.selectedIndex = -1;
                   item.parameters.label_coordinates[0].x1 = $scope.selector[item.page_no].x1;
                   item.parameters.label_coordinates[0].y1 = $scope.selector[item.page_no].y1;
                   item.parameters.label_coordinates[0].x2 = $scope.selector[item.page_no].x2;
                   item.parameters.label_coordinates[0].y2 = $scope.selector[item.page_no].y2;
                   $scope.drawer[item.page_no][item.drawerIndexObj.label].x1 = $scope.selector[item.page_no].x1;
                   $scope.drawer[item.page_no][item.drawerIndexObj.label].y1 = $scope.selector[item.page_no].y1;
                   $scope.drawer[item.page_no][item.drawerIndexObj.label].x2 = $scope.selector[item.page_no].x2;
                   $scope.drawer[item.page_no][item.drawerIndexObj.label].y2 = $scope.selector[item.page_no].y2;
                   if(item.id==undefined){
                         for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                           $scope.selector[i+1].clear();
                           $scope.selector[i+1].enabled=true;
                           $rootScope.imageBlur='';

                         }
                   }
                   else{
                      vm.disableSelector()
                   }


            }else{
                 $scope.croppingError = true;
                 $scope.cropMsg = 'Please select the label region';

            }



    };

    vm.editFieldLabel = function(item){
         item.label_edit = true;
         $scope.current_page = item.page_no;
         $rootScope.selectedPage = item.page_no;
         $rootScope.selectedIndex = item.drawerIndexObj.label;
         vm.enableSelectorInEdit(item.parameters.label_coordinates[0]);
         vm.editZone(item,item.parameters.label_coordinates[0]);
    };

    vm.clearLabel = function(item){
          item.label_edit = false;
          $rootScope.selectedPage = -1;
          $rootScope.selectedIndex = -1;
          if(item.id==undefined){
                         for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                           $scope.selector[i+1].clear();
                           $scope.selector[i+1].enabled=true;
                           $rootScope.imageBlur='';

                         }
          }
          else{
              vm.disableSelector()
          }
//       $scope.zoomDisplay = 'zoomSize';
//       $scope.selector.enabled=false;
//       $scope.selector.clear();
//       $rootScope.imageBlur='';
//       $rootScope.highlight=[];
//       vm.editFiledLabelData[index] = false;
//       vm.editFiledValueData[index] = false;
//       $rootScope.selectedIndex = -1;
    };

;

    vm.editValueField = function(item){
         item.value_edit = true
         $scope.current_page = item.page_no;
         $rootScope.selectedPage = item.page_no;
         $rootScope.selectedIndex = item.drawerIndexObj.value;
         vm.enableSelectorInEdit(item.coordinates[0]);
         vm.editZone(item,item.coordinates[0]);
//       $scope.zoomDisplay = 'zoomSize1';
//       $scope.selector.enabled=true;
//       vm.editFiledValueData[index] = true;
//       vm.editFiledLabelData[index] = false;
//       vm.editZone(list.drawerIndexObj.valueIndex);
    };

    vm.clearValue = function(item){
         $rootScope.selectedPage = -1;
         $rootScope.selectedIndex = -1;
         item.value_edit = false;
         vm.disableSelector();
//       $scope.zoomDisplay = 'zoomSize';
//       $scope.selector.enabled=false;
//       $rootScope.imageBlur='';
//       $rootScope.highlight=[];
//       vm.editFiledValueData[index] = false;
//       vm.editFiledLabelData[index] = false;
//       $rootScope.selectedIndex = -1;
    };

    vm.doneEditValueField = function(item){

            $scope.croppingError = false;
            $scope.croppingError = false;
            if($scope.selector[item.page_no].x1!=undefined){
                   $rootScope.selectedPage = -1;
                   $rootScope.selectedIndex = -1;
                   item.value_edit = false;
                   item.coordinates[0].x1 = $scope.selector[item.page_no].x1;
                   item.coordinates[0].y1 = $scope.selector[item.page_no].y1;
                   item.coordinates[0].x2 = $scope.selector[item.page_no].x2;
                   item.coordinates[0].y2 = $scope.selector[item.page_no].y2;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].x1 = $scope.selector[item.page_no].x1;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].y1 = $scope.selector[item.page_no].y1;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].x2 = $scope.selector[item.page_no].x2;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].y2 = $scope.selector[item.page_no].y2;
                   vm.disableSelector();

            }else{
                 $scope.croppingError = true;
                 $scope.cropMsg = 'Please select the label region';

            }



    };

    $scope.showeditableDomain=[];
    vm.editDomainObjField = function(index,domain){
        $scope.showeditableDomain[index] = true;
        $scope.getAttribute(domain);
    }
    vm.clearDomainObjField = function(index){
        $scope.showeditableDomain[index] = false;
    }
    //OMR Field//
    vm.editOMRLabelData = [];
    vm.editOMRValueData = [];
    vm.getAddGroup= function(){
        return {'options':[],'is_multiOption':false}
    };
    vm.addOMRField = function(){
        //vm.fieldsArr=[]
        $scope.selector.clear();
        $scope.zoomDisplay = 'zoomSize';
        $scope.selector.enabled=false;
        $rootScope.imageBlur='';
        $rootScope.highlight=[];
        $rootScope.selectedIndex = -1;
        vm.editOMRLabelData = [];
        vm.editOMRValueData = [];
        $scope.showOMRDomain =[];
        vm.dataOMRObj={};
        vm.dataOMRObj.has_label = false;
        vm.dataOMRObj.has_label_false = false;
        vm.dataOMRObj.group_label=false;
        vm.dataOMRObj.group_label_false=false;
        vm.dataOMRObj.groups=[];
        $scope.addOMRValueLabel = false;
        $scope.addOMRFieldLabel = false;
        $scope.showOMRDomainObj = false;
        $scope.croppingOMRError = false;
        $scope.showOMRConfig = true;
    };

    vm.cancelOMRField = function(){
        for (var i = $scope.drawer.length - 1; i >= 0; i--) {
            if ($scope.drawer[i].hasOwnProperty('NewKey')) {
              if($scope.drawer[i].type=='omr')
                $scope.drawer.splice(i, 1);
            }
        }
        vm.dataOMRObj={};
        $scope.showOMRConfig = false;
        $scope.selector.clear();
        $scope.zoomDisplay = 'zoomSize';
        $scope.selector.enabled=false;
        $scope.croppingOMRError = false;
    };

    vm.changeOMRLabel = function(item,value){
        vm.enableSelector();
        if(value=='yes'){
            item.has_label = 'yes';
            item.has_label_false = false;
        }
        else{
            item.has_label = false;
            item.has_label_false = 'no';
            for (var i = $scope.drawer[$scope.current_selection_page_no].length - 1; i >= 0; i--) {
                if($scope.drawer[$scope.current_selection_page_no][i].type=='omr'){
                    if ($scope.drawer[$scope.current_selection_page_no][i].hasOwnProperty('label_coordinates')) {
                      if($scope.drawer[$scope.current_selection_page_no][i].tem_id==item.tem_id && $scope.drawer[$scope.current_selection_page_no][i].index == item.drawerIndexObj.label ){
                         $scope.drawer[$scope.current_selection_page_no][i].is_display = false;
                         break;
                      }
                    }
                }
            }
            item.addOMRFieldLabel = false;
        }
        if($scope.drawer[$scope.current_page].length>0){
            setTimeout(function(){
                var topPos = document.getElementById('page_'+$scope.current_page).offsetTop;
                var scrollingElement = angular.copy(topPos+$scope.drawer[$scope.current_page][$scope.drawer[$scope.current_page].length-1].coordinates.y1-200);
                var scrollingElementLeft = angular.copy($scope.drawer[$scope.current_page][$scope.drawer[$scope.current_page].length-1].coordinates.x1);
                document.getElementById('scrollImage').scrollTop = scrollingElement;
                document.getElementById('scrollImage').scrollLeft = scrollingElementLeft;
            },200);
        }
    };

    vm.changeOMRGroup = function(item){
        item.group_label = false;
        item.group_label_false = 'no';
        item.is_multiGroup = false;
        var obj = vm.getAddGroup();
        item.groups=[];
        item.groups.push(obj);
        item.groups[0].options.push({})
    };

    vm.changeGroupLabel = function(group,value){
        if(value=='yes'){
          $scope.croppingError = false;
          $scope.zoomDisplay = 'zoomSize1';
          $scope.selector.enabled=true;
          group.label = 'yes';
          group.label_false = false;
          group.has_label=true;
          group.addGroupField = false;
        }
        else{
          group.has_label=false;
          group.label = false;
          group.label_false = 'no';
          group.addGroupField = true;

        }

    };

    vm.addOMRLabel = function(item){

            $scope.croppingOMRError = false;
            $scope.cropOMRMsg = '';
            if($scope.checkObjectLength($scope.selector[$scope.current_selection_page_no])){
                if($scope.selector[$scope.current_selection_page_no].x1!=undefined){
                   var obj = $scope.selector[$scope.current_selection_page_no];
                   item.page_no =  $scope.current_selection_page_no;
                   item.parameters = {};
                   item.parameters.label_coordinates=[];
                   item.parameters.label_coordinates[0] = {};
                   item.parameters.label_coordinates[0].x1=obj.x1;
                   item.parameters.label_coordinates[0].x2=obj.x2;
                   item.parameters.label_coordinates[0].y1=obj.y1;
                   item.parameters.label_coordinates[0].y2=obj.y2;
                   item.parameters.label_coordinates[0].page_number = item.page_no;
                   vm.updateDrawer('label',item);
                   item.addOMRFieldLabel = true;
                   for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                       $scope.selector[i+1].clear();
                       $scope.selector[i+1].enabled=true;

                   }
                }
                else{
                     $scope.croppingOMRError = true;
                     $scope.cropOMRMsg = 'Please select the label region';


                }

            }else{
                 $scope.croppingOMRError = true;
                 $scope.cropOMRMsg = 'Please select the label region';


            }

    };

    vm.addMultiGroup = function(){
      vm.dataOMRObj.groups.push(vm.getAddGroup());
    };

    vm.addOMRValue = function(item){
           $scope.croppingOMRError = false;
           $scope.cropOMRMsg = '';
           if($scope.selector[$scope.current_selection_page_no].x1!=undefined){
               var obj = $scope.selector[$scope.current_selection_page_no];
               item.page_no =  $scope.current_selection_page_no;
               item.coordinates=[];
               item.coordinates[0] = {};
               item.coordinates[0].x1=obj.x1;
               item.coordinates[0].x2=obj.x2;
               item.coordinates[0].y1=obj.y1;
               item.coordinates[0].y2=obj.y2;
               item.coordinates[0].page_number = item.page_no;
               vm.updateDrawer('value',item);
               item.addOMRValueLabel = true;
               item.showOMRDomainObj = true;
               for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                       $scope.selector[i+1].clear();
                       $scope.selector[i+1].enabled=true;

               }
               if(item.id==undefined){
                    vm.changeOMRGroup(item)
               }



           }else{
                $scope.croppingOMRError = true;
                 $scope.cropOMRMsg = 'Please select the value region';

           }
    };

    vm.addGroupLabel = function(group,index){
        var obj = {};
        $scope.croppingOMRError = false;
            if($scope.selector.x1!=undefined){
            obj.x1 = $scope.selector.x1;
            obj.y1 = $scope.selector.y1;
            obj.x2 = $scope.selector.x2;
            obj.y2 = $scope.selector.y2;
            obj.stroke = $scope.rect.stroke;
            obj.color = $scope.rect.data_color;
            obj.NewKey = 'label';
            obj.type = 'omr';
            obj.subType="group";
            obj.groupTypeObj={"index":index}
            group.label_coordinates={};
            group.label_coordinates.x1=obj.x1;
            group.label_coordinates.x2=obj.x2;
            group.label_coordinates.y1=obj.y1;
            group.label_coordinates.y2=obj.y2;
            $scope.drawer.push(obj);
            $scope.selector.clear();
            group.addGroupField = true;



        }else{
            $scope.croppingOMRError = true;
            $scope.cropOMRMsg = 'Please select the OMR group label region';

        }
    };

    vm.getOption=function(){
        return {}
    }

    vm.addOption = function(group){
        group.options.push(vm.getOption());
    };

    vm.addOMROptionValue = function(option,pindex,index,item){
           $scope.croppingOMRError = false;
           $scope.cropOMRMsg = '';
           if($scope.selector[$scope.current_selection_page_no].x1!=undefined){
               var obj = $scope.selector[$scope.current_selection_page_no];
               option.page_no = item.page_no;
               option.coordinates=[];
               option.coordinates[0] = {};
               option.coordinates[0].x1=obj.x1;
               option.coordinates[0].x2=obj.x2;
               option.coordinates[0].y1=obj.y1;
               option.coordinates[0].y2=obj.y2;
               option.coordinates[0].page_number = option.page_no;
               option.optionValue = true;
               vm.updateOMRGroupDrawer('value',option);
               for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                       $scope.selector[i+1].clear();
                       $scope.selector[i+1].enabled=true;

               }




           }else{
                $scope.croppingOMRError = true;
                 $scope.cropOMRMsg = 'Please select the option value region';

           }
//        var obj = {};
//        $scope.croppingOMRError = false;
//        if($scope.selector.x1!=undefined){
//            obj.x1 = $scope.selector.x1;
//            obj.y1 = $scope.selector.y1;
//            obj.x2 = $scope.selector.x2;
//            obj.y2 = $scope.selector.y2;
//            obj.stroke = $scope.rect.stroke;
//            obj.color = $scope.rect.data_color;
//            obj.NewKey = 'label';
//            obj.type = 'omr';
//            obj.subType="option";
//            obj.optionTypeObj = {'pindex':pindex,'index':index};
//            option.coordinates={};
//            option.coordinates.x1=obj.x1;
//            option.coordinates.x2=obj.x2;
//            option.coordinates.y1=obj.y1;
//            option.coordinates.y2=obj.y2;
//            option.optionValue = true;
//            $scope.drawer.push(obj);
//            $scope.selector.clear();
//
//
//
//
//        }else{
//             $scope.croppingOMRError = true;
//             $scope.cropOMRMsg = 'Please select the OMR option value region';
//
//        }
    };


    vm.deleteOMROption = function(item,index){
        $scope.croppingOMRError = false;
        if(item.groups[0].options.length>1){
             if(item.groups[0].options[index].value!=undefined)
                $scope.drawer[item.page_no][item.groups[0].options[index].value].is_display=false;

             item.groups[0].options.splice(index,1)
        }
        else{
            $scope.croppingOMRError = true;
            $scope.cropOMRMsg = 'At least one OMR option required';
        }
    };



    vm.saveOMRField = function(item){
        if(item.name != ""){
            $scope.croppingOMRError = false;
            $scope.cropOMRMsg  = '';
            var obj  = angular.copy(item);
            delete obj['drawerIndexObj'];
            delete obj['addOMRValueLabel'];
            delete obj['addOMRFieldLabel'];
            delete obj['showOMRDomainObj'];
            delete obj['temp_id'];

    //        if(type=='edit'){
    //             var obj = angular.copy(list);
    //             if(obj.hasOwnProperty('demo_label')){
    //               delete obj['demo_label'];
    //             }
    //
    //        }


            if(obj.has_label == 'yes'){
                 if(!obj.parameters.hasOwnProperty('label_coordinates')){
                     $scope.croppingOMRError = true;
                     $scope.cropOMRMsg = 'Please select the label region';
                     return;
                 }

            }
            if(obj.has_label == 'no' || !obj.has_label){
                obj.parameters = {};
                obj.has_label = false;
                obj.parameters.has_label = false;
            }

            var validate = false;
            delete obj['has_label_false'];
            if(obj.hasOwnProperty('entity')){
                  validate = true;
                  if(obj.hasOwnProperty('domain_mapping')){
                         delete $scope.domain_mapping_obj[obj.domain_mapping]
                  }
                  obj.domain_mapping = obj.entity+"."+obj.attribute;
                  if(obj.entity==undefined || obj.entity=='' || obj.entity==null || obj.attribute==undefined || obj.attribute=='' || obj.attribute==null){
                     validate = false;
                     vm.validateDocument = "please map the field to an attribute";
                     return;
                  }
                  if($scope.domain_mapping_obj.hasOwnProperty(obj.domain_mapping)){
                         validate = false;
                         vm.validateDocument = "Same domain mapping already selected";
                         return;
                  }else{
                    $scope.domain_mapping_obj[obj.domain_mapping] = '';
                  }
                  delete obj['entity'];
                  delete obj['attribute'];
            }
            else{

                   var validate = false;
                   vm.validateDocument = "please map the field to an attribute";
                   return;

            }

            if(obj.has_label == 'yes'){
                obj.has_label = true;
                 obj.parameters.has_label = true;
            }

            obj.is_variable_field = false;
            delete obj['group_label'];
            delete obj['group_label_false'];
            angular.forEach(obj.groups,function(value){
                 angular.forEach(value.options,function(option){
                   if(option.hasOwnProperty('edit'))
                      delete option['edit'];
                      delete option['page_no'];
                      delete option['value'];
                      delete option['optionValue'];

                 })

            });



            if(validate){
              vm.validateDocument = '';
              vm.saveElement('omr',obj,item);
            }
        }
        else{
            $.UIkit.notify({
                     message : "OMR field name is mandatory",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
            });
        }
    };



    vm.deleteOMRField = function(list,index){
        ngDialog.open({ template: 'confirmBox',
        controller: ['$scope','$state' ,function($scope,$state) {
        $scope.activePopupText = 'Are you sure you want to delete OMR Field ?';
        $scope.onConfirmActivation = function (){
          ngDialog.close();
          vm.deleteFieldData('OMR',list);
        };
        }]
        });
    };

    vm.changeOMRForEdit = function(listObj,value,index){
        vm.clearOMRLabel(index);
        if(value=='yes'){
            $scope.croppingError = false;
            $scope.zoomDisplay = 'zoomSize1';
            $scope.selector.enabled=true;
            listObj.has_label = 'yes';
            listObj.has_label_false = false;
            listObj.default_label = true;
        }
        else{
            $scope.croppingError = false;
            $scope.zoomDisplay = 'zoomSize1';
            $scope.selector.enabled=true;
            listObj.has_label = false;
            listObj.has_label_false = 'no';
            //$scope.drawer.splice(listObj.drawerIndexObj.labelIndex,1)
            $scope.drawer[listObj.drawerIndexObj.labelIndex].show=true;
            listObj.default_label = false;
        }
        if($scope.listOfFields.length>0){
            setTimeout(function(){
              document.getElementsByClassName('image-style')[0].scrollTop = listObj.coordinates.y1 - 200;
              document.getElementsByClassName('image-style')[0].scrollLeft = listObj.coordinates.x1;
            }, 100);
        }
    };

    vm.doneAddLabelOMR = function(value,listObj,index){
        $scope.croppingOMRError = false;
        if(value){
            var obj = {};
            $scope.croppingOMRError = false;
            if($scope.selector.x1!=undefined){
                   obj.x1 = $scope.selector.x1;
                   obj.y1 = $scope.selector.y1;
                   obj.x2 = $scope.selector.x2;
                   obj.y2 = $scope.selector.y2;
                   obj.stroke = $scope.rect.stroke;
                   obj.color = $scope.rect.data_color;
                   obj.NewKey = 'label';
                   obj.type = 'omr';
                   obj.label="label"
                   listObj.label_coordinates={};
                   listObj.label_coordinates.x1=obj.x1;
                   listObj.label_coordinates.x2=obj.x2;
                   listObj.label_coordinates.y1=obj.y1;
                   listObj.label_coordinates.y2=obj.y2;
                   $scope.drawer.push(obj);
                   listObj.drawerIndexObj.labelIndex = $scope.drawer.length-1;
                   listObj.default_label = false;
                   $scope.selector.clear();


            }else{
                 $scope.croppingOMRError = true;
                 $scope.cropOMRMsg = 'Please select the label region';

            }
        }

    };

    vm.editOMRLabel = function(item){
         item.label_edit = true;
         $scope.current_page = item.page_no;
         $rootScope.selectedPage = item.page_no;
         $rootScope.selectedIndex = item.drawerIndexObj.label;
         vm.enableSelectorInEdit(item.parameters.label_coordinates[0]);
         vm.editZone(item,item.parameters.label_coordinates[0]);
    };

    vm.clearOMRLabel = function(item){
          item.label_edit = false;
          $rootScope.selectedPage = -1;
          $rootScope.selectedIndex = -1;
          if(item.id==undefined){
                         for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                           $scope.selector[i+1].clear();
                           $scope.selector[i+1].enabled=true;
                           $rootScope.imageBlur='';

                         }
          }
          else{
              vm.disableSelector()
          }
    };


    vm.doneEditLabelOMR = function(item){
        item.label_edit = false;
        $scope.croppingError = false;
        $scope.croppingError = false;
        if($scope.selector[item.page_no].x1!=undefined){
               $rootScope.selectedPage = -1;
               $rootScope.selectedIndex = -1;
               item.parameters.label_coordinates[0].x1 = $scope.selector[item.page_no].x1;
               item.parameters.label_coordinates[0].y1 = $scope.selector[item.page_no].y1;
               item.parameters.label_coordinates[0].x2 = $scope.selector[item.page_no].x2;
               item.parameters.label_coordinates[0].y2 = $scope.selector[item.page_no].y2;
               $scope.drawer[item.page_no][item.drawerIndexObj.label].x1 = $scope.selector[item.page_no].x1;
               $scope.drawer[item.page_no][item.drawerIndexObj.label].y1 = $scope.selector[item.page_no].y1;
               $scope.drawer[item.page_no][item.drawerIndexObj.label].x2 = $scope.selector[item.page_no].x2;
               $scope.drawer[item.page_no][item.drawerIndexObj.label].y2 = $scope.selector[item.page_no].y2;
               if(item.id==undefined){
                     for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                       $scope.selector[i+1].clear();
                       $scope.selector[i+1].enabled=true;

                     }
                     $rootScope.imageBlur='';
               }
               else{
                  vm.disableSelector()
               }


        }else{
             $scope.croppingError = true;
             $scope.cropMsg = 'Please select the label region';

        }

    };

    vm.editValueOMR = function(item){
         item.value_edit = true
         $scope.current_page = item.page_no;
         $rootScope.selectedPage = item.page_no;
         $rootScope.selectedIndex = item.drawerIndexObj.value;
         vm.enableSelectorInEdit(item.coordinates[0]);
         vm.editZone(item,item.coordinates[0]);
    };

    vm.clearOMRValue = function(item){
       $rootScope.selectedPage = -1;
       $rootScope.selectedIndex = -1;
       item.value_edit = false;
       vm.disableSelector();
    };

    vm.doneEditValueOMR = function(item){

        $scope.croppingError = false;
        if($scope.selector[item.page_no].x1!=undefined){
               $rootScope.selectedPage = -1;
               $rootScope.selectedIndex = -1;
               item.value_edit = false;
               item.coordinates[0].x1 = $scope.selector[item.page_no].x1;
               item.coordinates[0].y1 = $scope.selector[item.page_no].y1;
               item.coordinates[0].x2 = $scope.selector[item.page_no].x2;
               item.coordinates[0].y2 = $scope.selector[item.page_no].y2;
               $scope.drawer[item.page_no][item.drawerIndexObj.value].x1 = $scope.selector[item.page_no].x1;
               $scope.drawer[item.page_no][item.drawerIndexObj.value].y1 = $scope.selector[item.page_no].y1;
               $scope.drawer[item.page_no][item.drawerIndexObj.value].x2 = $scope.selector[item.page_no].x2;
               $scope.drawer[item.page_no][item.drawerIndexObj.value].y2 = $scope.selector[item.page_no].y2;
               vm.disableSelector();

        }else{
             $scope.croppingError = true;
             $scope.cropMsg = 'Please select the label region';

        }

    };

    vm.editOptionValueOMR = function(option){
       option.edit = true;
       $scope.current_page = option.page_no;
       $rootScope.selectedPage = option.page_no;
       $rootScope.selectedIndex = option.value;
       vm.enableSelectorInEdit(option.coordinates[0]);
       vm.editZone(option,option.coordinates[0]);

    };

    vm.clearOMROptionValue = function(item,option){
       option.edit = false;
       $rootScope.selectedPage = -1;
       $rootScope.selectedIndex = -1;
       if(item.id==undefined){
                         for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                           $scope.selector[i+1].clear();
                           $scope.selector[i+1].enabled=true;
                           $rootScope.imageBlur='';

                         }
       }
       else{
          vm.disableSelector();
       }

    };

    vm.doneEditOptionValueOMR = function(item,option){

        option.edit = false;
        $scope.croppingError = false;
        if($scope.selector[item.page_no].x1!=undefined){
               $rootScope.selectedPage = -1;
               $rootScope.selectedIndex = -1;
               option.value_edit = false;
               option.coordinates[0].x1 = $scope.selector[item.page_no].x1;
               option.coordinates[0].y1 = $scope.selector[item.page_no].y1;
               option.coordinates[0].x2 = $scope.selector[item.page_no].x2;
               option.coordinates[0].y2 = $scope.selector[item.page_no].y2;
               $scope.drawer[item.page_no][option.value].x1 = $scope.selector[item.page_no].x1;
               $scope.drawer[item.page_no][option.value].y1 = $scope.selector[item.page_no].y1;
               $scope.drawer[item.page_no][option.value].x2 = $scope.selector[item.page_no].x2;
               $scope.drawer[item.page_no][option.value].y2 = $scope.selector[item.page_no].y2;
               if(item.id==undefined){
                     for(var i=0;i<vm.documentDetails.no_of_pages;i++){
                       $scope.selector[i+1].clear();
                       $scope.selector[i+1].enabled=true;

                     }
                     $rootScope.imageBlur='';
               }
               else{
                  vm.disableSelector()
               }

        }else{
             $scope.croppingError = true;
             $scope.cropMsg = 'Please select the label region';

        }


    };

    vm.deleteOMROptionInEdit = function(list,index){
        $scope.croppingOMRError = false;
        if(list.groups[0].options.length>1){
             list.groups[0].options.splice(index,1);
             $scope.drawer[list.drawerIndexObj.OMRValueIndex[index]].show=true;
             list.drawerIndexObj.OMRValueIndex.splice(index,1);
             console.log("");
             //list.drawerIndexObj.OMRValueIndex.splice(index,1);

        }
        else{
            $scope.croppingOMRError = true;
            $scope.cropOMRMsg = 'At least one OMR option required';
        }
    };

    vm.addOMROptionValueInEdit = function(list,option,pindex,index){
        var obj = {};
        $scope.croppingOMRError = false;
        if($scope.selector.x1!=undefined){
            obj.x1 = $scope.selector.x1;
            obj.y1 = $scope.selector.y1;
            obj.x2 = $scope.selector.x2;
            obj.y2 = $scope.selector.y2;
            obj.stroke = $scope.rect.stroke;
            obj.color = $scope.rect.marker_color;
            obj.NewKey = 'label';
            obj.type = 'omr';
            obj.subType="option";
            obj.optionTypeObj = {'pindex':pindex,'index':index};
            option.coordinates={};
            option.coordinates.x1=obj.x1;
            option.coordinates.x2=obj.x2;
            option.coordinates.y1=obj.y1;
            option.coordinates.y2=obj.y2;
            option.optionValue = true;
            option.new = false;
            option.edit = false;
            $scope.drawer.push(obj);

            list.drawerIndexObj.OMRValueIndex.push($scope.drawer.length-1);
            $scope.selector.clear();




        }else{
             $scope.croppingOMRError = true;
             $scope.cropOMRMsg = 'Please select the OMR option value region';

        }
    };


    $scope.showOMRDomain =[];
    vm.editDomainObjOMR = function(index,domain){
        $scope.showOMRDomain[index] = true;
        $scope.getAttribute(domain);
    }

    vm.clearDomainObjOMR = function(index){
        $scope.showOMRDomain[index] = false;
    }
    vm.addOptionInEdit = function(group){
        $scope.zoomDisplay = 'zoomSize1';
        $rootScope.imageBlur='';
        $rootScope.selectedIndex = -1;
        $scope.selector.clear();
        $scope.selector.enabled=true;
        angular.forEach(group.options,function(value,key){
         value.edit = false;
        });
        vm.editOMRValueData = [];
        vm.editOMRLabelData = [];
        setTimeout(function(){
              document.getElementsByClassName('image-style')[0].scrollTop = group.options[0].coordinates.y1 - 200;
              document.getElementsByClassName('image-style')[0].scrollLeft = group.options[0].coordinates.x1;
        }, 100);
        group.options.push({'new':true,'edit':false});
    };
    //paragraph code

   vm.addParagraph = function(){
        $scope.showParagraph = true;

        vm.dataParagraphObj={};

   };
   vm.cancelParagraph = function(){
        vm.dataParagraphObj={};
        $scope.showParagraph = false;
        $scope.croppingParagraphError = false;
   };

   vm.saveParagraph = function(type,list,index){
           $scope.croppingParagraphError = false;
           var obj  = angular.copy(vm.dataParagraphObj);
           if(type=='edit'){
             var obj = angular.copy(list);
           }

           if(obj.hasOwnProperty('entity')){
              obj.domain_mapping = obj.entity;
              delete obj['entity'];
           }

            obj.is_variable_field = false;


           if(type=='edit'){
             //vm.documentDetails.paragraph[index] = obj;
           }
           else{
             //vm.documentDetails.paragraph.unshift(obj);
           }
           obj.template_id= $scope.template_id;
           obj.section_id= $scope.section_id;
           obj.page_no = $scope.current_page;
           obj.type = 'paragraph';
           vm.saveFieldData('paragraph',obj);
   };


   vm.deleteParagraph = function(list,index){
      ngDialog.open({ template: 'confirmBox',
      controller: ['$scope','$state' ,function($scope,$state) {
          $scope.activePopupText = 'Are you sure you want to delete Paragraph ?';
          $scope.onConfirmActivation = function (){
              ngDialog.close();
              vm.deleteFieldData('Paragraph',list);
          };
      }]
      });
    };
   vm.changeDraft = function(value){
       var label ="Disable";
       if(value)
         var label = "Enable";
       vm.template_id = angular.copy($scope.template_id);

       ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to '+label+' Draft Mode ?';
              $scope.onConfirmActivation = function (){
                 ngDialog.close();
                 documentService.sendDocument(vm.sess_id,{'template_id':vm.template_id,'is_draft':value}).then(function(resp){
                          if(angular.equals(resp.data.status,'success')){
                             $.UIkit.notify({
                                 message : label+" Draft Mode Successfully",
                                 status  : 'success',
                                 timeout : 3000,
                                 pos     : 'top-center'
                             });
                          }else{
                             $.UIkit.notify({
                                 message : resp.data.msg,
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
          }],
          preCloseCallback:function(type){
            if(type!=undefined){
              vm.documentDetails.is_draft = angular.copy(!vm.documentDetails.is_draft);
              $scope.$apply();
            }



          }
        });

    }


    var pressed = false;
    var start = undefined;
    var startX, startWidth;

    $(".table-custom tr td").mousedown(function(e) {
    start = $(this);
    pressed = true;
    startX = e.pageX;
    startWidth = $(this).width();
    $(start).addClass("resizing");
    });

    $(document).mousemove(function(e) {
    if(pressed) {
        $(start).width(startWidth+(e.pageX-startX));
    }
    });

    $(document).mouseup(function() {
    if(pressed) {
        $(start).removeClass("resizing");
        pressed = false;
    }
    });

    // document variable code

    vm.changeMapping = function(listObj,val){
        if(listObj.id != undefined){
            if(val == "yes"){
                if(!(listObj.entity != undefined && listObj.entity != "")){
                    listObj.entity = "";
                    listObj.attribute = "";
                }
                listObj.isChanged = true;
            }
            if(val == "no"){
                if(!(listObj.document_variable != undefined && listObj.document_variable != ""))
                    listObj.document_variable = "";

                listObj.isChanged = false;
            }
        }
    };

    // document rules code

    vm.typeList = ["string","numeric","currency","location","datetime","related entity","other"];
    vm.ruleListSelection = "vlrule";
    $scope.ruleSelection = "vrule";
    $scope.enableRuleEdit = [];

    vm.fromExistingRules = function(rulesSelect){
        $scope.rulesSelectArray = [];
        vm.selectedRulesWithObj = [];
        angular.forEach(rulesSelect,function(key,value){
            if(key)
                $scope.rulesSelectArray.push(value)
        });
        angular.forEach($scope.rulesSelectArray,function(value,key){
            var singleRule = vm.allRules.filter(function(e){if(value==e.rule_id){return e}});
            if(singleRule.length>0)
                vm.selectedRulesWithObj.push(singleRule[0]);
        });
        document.getElementById("existingruleDiv").style.width = "0%";
    };

    vm.clearAllRules = function(list){
        $scope.rulesSelectArray = [];
        $scope.selectedRules = {};
        vm.selectedRulesWithObj = [];
        if(list.type == 'field' && list.id!=undefined && list.doc_var!=undefined){
             if($scope.checkObjectLength(list.doc_var)){
                if(list.doc_var.rule_id.length > 0)
                    vm.enableRule = true;
                else
                   vm.enableRule = false;
                $scope.rulesSelectArray = [];
                vm.validateDocument = "";
                if(list.document_variable != undefined){
                    $scope.rulesSelectArray = list.doc_var.rule_id;
                }
                angular.forEach($scope.rulesSelectArray,function(value,key){
                    var singleRule = vm.allRules.filter(function(e){if(value==e.rule_id){return e}});
                    if(singleRule.length>0)
                        vm.selectedRulesWithObj.push(singleRule[0]);
                });
             }
        }
    };

    vm.getRulesConfig = function(){
        documentService.getRuleConfig(vm.sess_id).then(function(resp){
             if(resp.data.status == "success"){
                vm.rulesConfig = resp.data.config;
                vm.operatorsList = resp.data.config.operators;
                vm.functionsList = resp.data.config.functions;
                vm.actionsList = resp.data.config.actions;
             }
             else{
                $.UIkit.notify({
                     message : resp.data.msg,
                     status  : 'warning',
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

    vm.getRulesConfig();

    vm.getRules = function(){
        documentService.getRule(vm.sess_id).then(function(resp){
             if(resp.data.status == "success"){
                vm.allRules = resp.data.data;
             }
             else{
                $.UIkit.notify({
                     message : resp.data.msg,
                     status  : 'warning',
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

    vm.getRules();

    vm.getNewRule = function(){
        var rule = {};
        rule.rule_name = "";
        rule.desc = "";
        rule.module = "";
        rule.rule = {};
        rule.rule.run_type = "any";
        rule.rule.conds = [{"op":"", "rval": "","fn":""}];
        rule.rule.actions = [{"act":"","attr":{"rval":""}}];
        return rule;
    };

    vm.newRule = function(){
        vm.ruleObj = vm.getNewRule();
    };

    vm.addCondition = function(){
        var len = vm.ruleObj.rule.conds.length;
        if(vm.ruleObj.rule.conds[len-1].op != ""){
            if(vm.ruleObj.rule.conds[len-1].rval != ""){
                vm.ruleObj.rule.conds.push({"op":"", "rval": "","fn":""});
                vm.conditionErr = "";
            }
            else{
                vm.conditionErr = "Please enter the value";
            }
        }
        else{
            vm.conditionErr = "Please select the condition first";
        }
    };

    vm.selectOperator = function(type){
        vm.ruleObj.rule.run_type = type;
        vm.addCondition();
    };

    vm.delCond = function(index){
        vm.ruleObj.rule.conds.splice(index,1);
    };

    vm.checkRulesValidate = function(){
        if(vm.ruleObj.rule_name != ""){
            if(vm.ruleObj.rule.conds.length == 1){
                if(vm.ruleObj.rule.conds[0].op != "" && vm.ruleObj.rule.conds[0].rval != ""){
                    if(vm.ruleObj.rule_type == "S"){
                        if(vm.ruleObj.rule.actions[0].act != "" && vm.ruleObj.rule.actions[0].attr.rval != ""){
                            return "";
                        }
                        else{
                            return "Please select the action";
                        }
                    }
                    else{
                        return "";
                    }
                }
                else{
                    return "Please select the condition";
                }
            }
            else{
                if(vm.ruleObj.rule_type == "S"){
                    if(vm.ruleObj.rule.actions[0].act != "" && vm.ruleObj.rule.actions[0].attr.rval != ""){
                        return "";
                    }
                    else{
                        return "Please select the action";
                    }
                }
                else{
                    return "";
                }
            }
        }
        else{
            return "Please enter the rule name";
        }
    };

    vm.mapSavedRuleToAssociate = function(ruleId){
        documentService.getRule(vm.sess_id).then(function(resp){
             if(resp.data.status == "success"){
                vm.allRules = resp.data.data;
                var rule = vm.allRules.filter(function(e){if(e.rule_id==ruleId){return e}});
                var checkDup = vm.selectedRulesWithObj.filter(function(e){if(e.rule_id == rule[0].rule_id){return e}});
                if(checkDup.length == 0){
                    vm.selectedRulesWithObj.push(rule[0]);
                }
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

    vm.saveRule = function(){
        if($scope.ruleSelection == "srule"){
            vm.ruleObj.rule_type = "S";
        }
        else{
            vm.ruleObj.rule_type = "V";
        }
        vm.validateErr = vm.checkRulesValidate();
        if(vm.validateErr == ""){
            if(vm.ruleObj.rule_type == "V")
                delete vm.ruleObj.rule["actions"];
            if(vm.ruleObj.rule_type == "S"){
                if(vm.ruleObj.rule.conds.length==1){
                    if(vm.ruleObj.rule.conds[0].op == "regx"){
                        vm.ruleObj.rule.actions[0].attr.regx = vm.ruleObj.rule.conds[0].rval;
                    }
                }
                else if(vm.ruleObj.rule.conds.length==2){
                    if(vm.ruleObj.rule.conds[1].op == "" || vm.ruleObj.rule.conds[1].rval == ""){
                        vm.ruleObj.rule.actions[0].attr.regx = vm.ruleObj.rule.conds[0].rval;
                    }
                }
                for(var j=0;j<vm.ruleObj.rule.actions.length;j++){
                    if(!isNaN(vm.ruleObj.rule.actions[j].attr.rval)){
                        vm.ruleObj.rule.actions[j].attr.rval = parseFloat(vm.ruleObj.rule.actions[j].attr.rval);
                    }
                };
            }

            for(var i=0;i<vm.ruleObj.rule.conds.length;i++){
                if(!isNaN(vm.ruleObj.rule.conds[i].rval)){
                    vm.ruleObj.rule.conds[i].rval = parseFloat(vm.ruleObj.rule.conds[i].rval);
                }
            };

            $scope.showSpinnerRule = true;
            documentService.saveRule(vm.sess_id,vm.ruleObj).then(function(resp){
                if(resp.data.status == 'success'){
                    $scope.showSpinnerRule = false;
                    vm.validateErr = "";
                    vm.conditionErr = "";
                    vm.mapSavedRuleToAssociate(resp.data.rule_id);
                    $scope.cancel();
                    $.UIkit.notify({
                         message : resp.data.msg,
                         status  : 'success',
                         timeout : 3000,
                         pos     : 'top-center'
                    });
                }
                else{
                    $scope.showSpinnerRule = false;
                    $.UIkit.notify({
                         message : resp.data.msg,
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                    });
                }
            },function(err){
                 console.log(err)
                 $scope.showSpinnerRule = false;
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
            });
        }
    };

    vm.checkForOperator = function(op,ruleCond,index){
        if(vm.ruleObj.rule.conds.length==1){
            if(op == "regx"){
                vm.actionsList = [{
                    "desc": "",
                    "oper": "replace",
                    "display_name": "Replace",
                    "supports": ["S"]
                }];
            }
            else{
                vm.actionsList = vm.rulesConfig.actions;
                var selectOptionObj = vm.operatorsList.filter(function(e){if(e.oper == op){return e;}});
                if(selectOptionObj[0].is_custom){
                    vm.ruleObj.rule.conds[index].is_custom = true;
                    vm.ruleObj.rule.conds[index].file_path = selectOptionObj[0].file_path;
                }
                else{
                    delete vm.ruleObj.rule.conds[index].is_custom;
                }
            }
        }
        else{
            vm.actionsList = vm.rulesConfig.actions;
            var selectOptionObj = vm.operatorsList.filter(function(e){if(e.oper == op){return e;}});
            if(selectOptionObj[0].is_custom){
                vm.ruleObj.rule.conds[index].is_custom = true;
                vm.ruleObj.rule.conds[index].file_path = selectOptionObj[0].file_path;
            }
            else{
                delete vm.ruleObj.rule.conds[index].is_custom;
            }
        }
    };

    vm.checkForAction = function(act,ruleAction,index){
        console.log(vm.ruleObj);
        vm.actionsList = vm.rulesConfig.actions;
        var selectOptionObj = vm.actionsList.filter(function(e){if(e.oper == act){return e;}});
        if(selectOptionObj[0].is_custom){
            vm.ruleObj.rule.actions[index].attr.is_custom = true;
            vm.ruleObj.rule.actions[index].attr.file_path = selectOptionObj[0].file_path;
            vm.ruleObj.rule.actions[index].attr.lang = selectOptionObj[0].lang;
            vm.ruleObj.rule.actions[index].attr.method_name = "apply";
        }
    }

    vm.editRule = function(rule){
        vm.ruleObj = rule;
        if(vm.ruleObj.rule_type == "S"){
            $scope.ruleSelection = "srule";
        }
        else{
            $scope.ruleSelection = "vrule";
            vm.ruleObj.rule.actions =  [{"act":"","attr":{"rval":""}}];
        }
        document.getElementById("ruleOverlayDiv").style.width = " 58%";
        vm.ruleResult = "";
        vm.sourceValue = "";
        vm.ruleFailedmessage = false;
        vm.ruleSuccessmessage = false;
    };

    function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    }
    $('#ruleAccordion').on('hidden.bs.collapse', toggleChevron);
    $('#ruleAccordion').on('shown.bs.collapse', toggleChevron);

    vm.deleteRuleFunc = function(ruleId){
        documentService.deleteSTRule(vm.sess_id,{'rule_id':ruleId}).then(function(resp){
           if(resp.data.status == "success"){
               $.UIkit.notify({
                       message : resp.data.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
               });
               vm.getTransformation();
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

    vm.deleteRule = function(ruleId){
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete this rule ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.deleteRuleFunc(ruleId);
              };
          }]
        });
     };

    vm.testRule = function(){
        var sendRuleObj = angular.copy(vm.ruleObj);
        if($scope.ruleSelection == "srule"){
            sendRuleObj.rule_type = "S";
        }
        else{
            sendRuleObj.rule_type = "V";
        }
        vm.validateErr = vm.checkRulesValidate();
        if(vm.validateErr == ""){
            if(sendRuleObj.rule_type == "V")
                delete sendRuleObj.rule["actions"];
            if(sendRuleObj.rule_type == "S"){
                if(sendRuleObj.rule.conds.length==1){
                    if(sendRuleObj.rule.conds[0].op == "regx"){
                        sendRuleObj.rule.actions[0].attr.regx = sendRuleObj.rule.conds[0].rval;
                    }
                }
                else if(sendRuleObj.rule.conds.length==2){
                    if(sendRuleObj.rule.conds[1].op == "" || sendRuleObj.rule.conds[1].rval == ""){
                        sendRuleObj.rule.actions[0].attr.regx = sendRuleObj.rule.conds[0].rval;
                    }
                }
                for(var j=0;j<sendRuleObj.rule.actions.length;j++){
                    if(!isNaN(sendRuleObj.rule.actions[j].attr.rval)){
                        sendRuleObj.rule.actions[j].attr.rval = parseFloat(sendRuleObj.rule.actions[j].attr.rval);
                    }
                };
            }
            if(!isNaN(vm.sourceValue)){
                vm.sourceValue = parseFloat(vm.sourceValue);
            }
            for(var i=0;i<sendRuleObj.rule.conds.length;i++){
                if(!isNaN(sendRuleObj.rule.conds[i].rval)){
                    sendRuleObj.rule.conds[i].rval = parseFloat(sendRuleObj.rule.conds[i].rval);
                }
            };
            var source = {"source":vm.sourceValue}
            documentService.testTransformationRule(vm.sess_id,{"source": source, 'rule': sendRuleObj}).then(function(resp){
                   if(resp.data.status == "success"){
                       if(resp.data.result.is_valid){
                           vm.testTransformResult = resp.data.result.result;
                           vm.ruleResult = resp.data.result.result;
                           vm.ruleFailedmessage = false;
                           vm.ruleSuccessmessage = true;
                       }
                       else{
                           vm.ruleIsValid = resp.data.result.is_valid;
                           vm.ruleFailedmessage = true;
                           vm.ruleSuccessmessage = false;
                           vm.ruleResult = "";
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
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
            });
        }
    };


        //Tree Structure for marker form//

   $scope.menuItems = [];

   // get pages

   $rootScope.$on("selector",function(evt,data){


       $scope.current_selection_page_no = data.id;
       for(var i=1;i<=vm.documentDetails.no_of_pages;i++){
         if(data.id!=i){
           $scope.selector[i].clear();

         }
       }
   });

   $scope.initialiseDrawerAndSelector = function(){
        $scope.drawer = [];
        $scope.selector=[];
        for(var i=0;i<vm.documentDetails.no_of_pages;i++){
            $scope.drawer[i+1] = [];
            $scope.selector[i+1] = {};
            $scope.selector[i+1].enabled=false;
            $scope.selector[i+1].id=i+1;
        }
   };



   vm.changeDocumentInfo = function () {
        vm.validateDocument = "";
        if(vm.documentDetails.doc_type==undefined || vm.documentDetails.doc_type=='image'){
            $scope.imagePathsCopy = vm.documentDetails.pages;
            $scope.imagePaths = [];
            var i = 0;
            angular.forEach($scope.imagePathsCopy, function(value,key){
                $scope.imagePaths[i] = {};
                $scope.imagePaths[i].file_path = "/static"+value.metadata.raw.bucket+'/'+value.metadata.raw.key;
                $scope.imagePaths[i].page_no = value.num;
                i++;
            });
            //$scope.imagePaths = [{ "file_path": "./app/images/working.png", "page_no": 1 }]
            $("#ImageLocation").empty();
            var htmlContent = "<div ng-repeat='path in imagePaths track by $index' id='page_{$ path.page_no $}' name='{$ path.page_no $}' class='post'>{$ path.page_no $}<div class='panel panel-default' form-image form-src='path.file_path' form-max width='auto' form-selector='selector[$index+1]' form-drawer='drawer[$index+1]'></div></div>"
            var el = $compile( htmlContent )($scope);
            var element = document.getElementById("ImageLocation");
            angular.element(document.getElementById("ImageLocation")).append(el);

        }
        else{
           vm.renderHtml = vm.documentDetails.pages[$scope.current_page-1].doc_html;
        }
   }

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

    $scope.excelBtnArr = [];
    $scope.excelBtnArr[0]='excel-back';
    $scope.getSheetData = function(index){
        $scope.excelBtnArr = [];
        $scope.excelBtnArr[index]='excel-back';
        vm.renderHtml = vm.documentDetails.pages[index].doc_html;
    };



   vm.getDocumentsList = function(id){

        documentService.getDocumentDetails(vm.sess_id,id).then(function(resp){


            if(angular.equals(resp.data.status,'success')){
                vm.documentDetails = resp.data.data;
                $scope.current_page = 1;
                $scope.current_selection_page_no = 1;
                $rootScope.selectedIndex =-1;
                $rootScope.selectedPage = -1;
                $rootScope.$broadcast('scanner-started',{"data": vm.documentDetails});
                if(vm.documentDetails){
                    $scope.template_id = vm.documentDetails.template_id;
                    $scope.initialiseDrawerAndSelector();
                    $scope.menuItems = vm.documentDetails.elements;
                }
                $scope.domain_mapping_obj = {};
                vm.changeDocumentInfo();
                $scope.getresult();

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
            console.log(err)
            $.UIkit.notify({
            message : "Internal server error",
            status  : 'warning',
            timeout : 3000,
            pos     : 'top-center'
            });
        });
   };

   vm.getDocumentsList($stateParams.id);

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
           if($scope.current_page<=vm.documentDetails.no_of_pages) {
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

   $scope.addElement = function(data,type){

        var obj = {};
        vm.validateDocument = "";
        if(type == 'section'){
            obj = {"name": "","type":"section","section_id":data.item.id,"elements": [],"temp_id":$scope.uniqueIdGenerator(),'template_id':$scope.template_id};
            obj.temp_id = data.item.temp_id+'_'+obj.temp_id;
            obj.drawerIndexObj = {};
            obj.coordinates = {};
            obj.showSectionObj = false;
            data.item.elements.unshift(obj);
            vm.enableSelector();
        }
        else if(type == 'table'){
            obj = {'template_id':$scope.template_id,"name": "","section_id":data.item.id,"type":type,"temp_id":$scope.uniqueIdGenerator(),"entity":"","headings":[{"domain_mapping":"","entity":"","attribute":"","column":[]},{"domain_mapping":"","entity":"","attribute":"","column":[]}]};
            obj.temp_id = data.item.temp_id+'_'+obj.temp_id;
            data.item.elements.unshift(obj);
        }
        else if(type == 'field'){
            obj = {'template_id':$scope.template_id,"name": "","section_id":data.item.id,"type":type,"temp_id":$scope.uniqueIdGenerator()};
            obj.temp_id = data.item.temp_id+'_'+obj.temp_id;
            obj.has_label = false;
            obj.has_label_false = false;
            obj.variable_label = false;
            obj.variable_label_false = false;
            obj.isDomain = "yes";
            obj.addValueLabel = false;
            obj.addFieldLabel = false;
            obj.showDomainObj = false;
            obj.drawerIndexObj = {};
            $scope.rulesSelectArray = [];
            $scope.selectedRules = {};
            vm.selectedRulesWithObj = [];
            data.item.elements.unshift(obj);

        }
        else if(type == 'omr'){
            obj = {'template_id':$scope.template_id,"name": "","section_id":data.item.id,"type":type,"temp_id":$scope.uniqueIdGenerator()};
            obj.temp_id = data.item.temp_id+'_'+obj.temp_id;
            obj.has_label = false;
            obj.has_label_false = false;
            obj.addOMRValueLabel = false;
            obj.addOMRFieldLabel = false;
            obj.showOMRDomainObj = false;
            obj.drawerIndexObj = {};
            obj.groups=[]
            data.item.elements.unshift(obj);

        }
        else{
            obj = {'template_id':$scope.template_id,"name": "","section_id":data.item.id,"type":type,"temp_id":$scope.uniqueIdGenerator()};
            obj.temp_id = data.item.temp_id+'_'+obj.temp_id;
            data.item.elements.unshift(obj);
        }
        setTimeout(function(){
            $("."+obj.temp_id).addClass('in');
            $("."+obj.temp_id).removeAttr( 'style' );
        },100);
   };

   $scope.openId = function (id) {
        var str = id.split('_');
        var id =''
       // $('.panel-collapse.in').removeClass('in');
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

   vm.updateDrawer = function(type,item){
        var obj = angular.copy(item);
        if(obj.type=="field" || obj.type=="omr"){
            if(type == "label"){
                obj.x1 = obj.parameters[type+''+'_coordinates'][0].x1;
                obj.x2 = obj.parameters[type+''+'_coordinates'][0].x2
                obj.y1 = obj.parameters[type+''+'_coordinates'][0].y1;
                obj.y2 = obj.parameters[type+''+'_coordinates'][0].y2;
            }
            else{
                obj.x1 = obj.coordinates[0].x1;
                obj.x2 = obj.coordinates[0].x2
                obj.y1 = obj.coordinates[0].y1;
                obj.y2 = obj.coordinates[0].y2;
            }
        }
        else{
            obj.x1 = obj.coordinates[0].x1;
            obj.x2 = obj.coordinates[0].x2
            obj.y1 = obj.coordinates[0].y1;
            obj.y2 = obj.coordinates[0].y2;
        }
        obj.is_display = true;
        obj.stroke = $scope.rect.stroke;
        obj.color = $scope.rect.data_color;
        if(type=='value')
            obj.color = $scope.rect.marker_color;
        if(item.type=='section')
            obj.color = $scope.rect.section_color;
        obj.index = $scope.drawer[obj.page_no].length;
        item.drawerIndexObj[type] = obj.index;
        $scope.drawer[obj.page_no].push(obj);
   };
   vm.updateOMRGroupDrawer = function(type,item){
        var obj = angular.copy(item);
        obj.x1 = obj.coordinates[0].x1;
        obj.x2 = obj.coordinates[0].x2
        obj.y1 = obj.coordinates[0].y1;
        obj.y2 = obj.coordinates[0].y2;
        obj.is_display = true;
        obj.color = $scope.rect.data_color;
        if(type=='value')
            obj.color = $scope.rect.marker_color;
        obj.index = $scope.drawer[obj.page_no].length;
        item.value = obj.index;
        $scope.drawer[obj.page_no].push(obj);
   };

   vm.addSection = function(item){
     if($scope.selector[$scope.current_selection_page_no].x1!=undefined){
        item.is_section_selected = true;
        item.showSectionObj = true;
        var obj = $scope.selector[$scope.current_selection_page_no];
        item.page_no =  $scope.current_selection_page_no;
        item.coordinates = [];
        item.coordinates[0] = {};
        item.coordinates[0].x1 = obj.x1;
        item.coordinates[0].x2 = obj.x2;
        item.coordinates[0].y1 = obj.y1;
        item.coordinates[0].y2 = obj.y2;
        item.coordinates[0].page_number = item.page_no;
        vm.updateDrawer('value',item);
        vm.disableSelector();


     }else{
       alert('select the co-ordinates');
     }


   };

   vm.editSection = function(item){
      item.value_edit = true;
      $scope.current_page = item.page_no;
      $rootScope.selectedPage = item.page_no;
      $rootScope.selectedIndex = item.drawerIndexObj.value;
      vm.enableSelectorInEdit(item.coordinates[0]);
      vm.editZone(item,item.coordinates[0]);
   };

   vm.doneSection = function(item){
            item.value_edit = false;
            $scope.croppingError = false;
            $scope.croppingError = false;
            if($scope.selector[item.page_no].x1!=undefined){
                   $rootScope.selectedPage = -1;
                   $rootScope.selectedIndex = -1;
                   item.coordinates[0].x1 = $scope.selector[item.page_no].x1;
                   item.coordinates[0].y1 = $scope.selector[item.page_no].y1;
                   item.coordinates[0].x2 = $scope.selector[item.page_no].x2;
                   item.coordinates[0].y2 = $scope.selector[item.page_no].y2;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].x1 = $scope.selector[item.page_no].x1;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].y1 = $scope.selector[item.page_no].y1;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].x2 = $scope.selector[item.page_no].x2;
                   $scope.drawer[item.page_no][item.drawerIndexObj.value].y2 = $scope.selector[item.page_no].y2;
                   vm.disableSelector()



            }else{
                 $scope.croppingError = true;
                 $scope.cropMsg = 'Please select the label region';

            }
   };

   vm.clearSection = function(item){
      item.value_edit = false;
      $rootScope.selectedPage = -1;
      $rootScope.selectedIndex = -1;
      vm.disableSelector();
   };

   vm.saveSection = function(item){
        if(item.name != ""){
            var temp = angular.copy(item)
            delete temp['is_section_selected'];
            delete temp['temp_id'];
            delete temp['drawerIndexObj']
            vm.saveElement('section',temp,item);
        }
        else{
            $.UIkit.notify({
                     message : "Section name is mandatory",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
            });
        }
   };

   vm.selectSectionCoordinates = function (item) {
       vm.enableSelector();
       item.coordinates={};
       item.is_section_selected = true;
   };

   $scope.uniqueIdGenerator = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
   };

   function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
   };

   vm.saveFreeText = function(type,item){
       if(item.name != ""){
           vm.saveElement(type,item,item);
       }
       else{
           $.UIkit.notify({
                 message : "Paragraph name is mandatory",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
           });
       }
   };

   vm.enableSelectorInEdit = function(coordinates){
        for(var i=0;i<vm.documentDetails.no_of_pages;i++){
           $scope.selector[i+1].clear();
           $scope.selector[i+1].enabled=true;
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
        $rootScope.highlight=[];
   }

   vm.enableSelector = function(){
        $scope.zoomDisplay = 'zoomSize';
        for(var i=0;i<vm.documentDetails.no_of_pages;i++){
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
        for(var i=0;i<vm.documentDetails.no_of_pages;i++){
           $scope.selector[i+1].clear();
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

   $scope.checkObjectLength = function(data){
        if(data != undefined){
            var len = Object.keys(data).length;
            if(len > 0)
                return true
            else
                return false;
        }
        else
            return false;
   };

   vm.saveElement = function(type,obj,item){
        obj.template_id = vm.documentDetails.template_id;
        documentService.saveConfigurations(vm.sess_id,obj).then(function(resp){
              if(resp.data.status == "success"){
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                   if(type=='section'){
                      item.section_id = resp.data.section_id;
                   }
                   else{
                      item.id = resp.data.id;
                       $("."+item.temp_id).removeClass('in');
                   }
                   item.is_deleted = false;

                   if(obj.id!=undefined){
                        vm.getDocumentsList($stateParams.id);
                   }
                   item.id = resp.data.id;
                   vm.getDocumentsList($stateParams.id);
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

   vm.saveTable = function(item){
          if(item.name != ""){
              var data = angular.copy(item);
              var validate = true;
              var domaintmpobj=[];
              angular.forEach(data.forDomainMapping,function(value){
                 if(item.id!=undefined){
                    if(value.hasOwnProperty('domain_mapping')){
                         delete $scope.domain_mapping_obj[value.domain_mapping]
                    }
                 }
                 value.domain_mapping=data.entity+"."+value.attribute;
                     if(value.attribute == undefined || value.attribute === "" || value.attribute == null){
                           validate = false;
                           vm.validateDocument = "please map the field to an attribute";
                           return;
                     }
                     if(domaintmpobj.indexOf(value.attribute) > -1){
                        validate = false;
                        vm.validateDocument = "attributes fields should be unique.";
                        return;
                     }
                     domaintmpobj.push(value.attribute);

    //                 if($scope.domain_mapping_obj.hasOwnProperty(value.domain_mapping)){
    //                     validate = false;
    //                     vm.validateDocument = "Same domain mapping already selected";
    //                     return;
    //                 }else{
    //                    $scope.domain_mapping_obj[value.domain_mapping] = '';
    //                 }

                 delete value.entity;
                 delete value.attribute;
              })
              var domap = data.forDomainMapping;
              var head = data.headings;
              data.headings = [];
              data.headings = angular.copy(domap);
              for(var i=0;i<data.headings.length;i++){
                data.headings[i].column_no = i;
              };
              data.forDomainMapping = angular.copy(head);
              data.type = 'table';
              data.is_variable_field = false;
              data.template_id= $scope.template_id;
              data.parameters = {};
              data.parameters.headings = data.headings;
              delete data.entity;
              delete data['temp_id'];

              if(validate){
                 vm.validateDocument = '';
                 vm.saveElement('table',data,item);
              }
           }
           else{
               $.UIkit.notify({
                     message : "Table name is mandatory",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
               });
           }
   };

   vm.getField = function(item){
                        if(item.name==undefined)
                           item.name = 'Field';
                        item.showDomainObj = true;
                        item.drawerIndexObj = {};
                        if(item.coordinates!=undefined){
                            vm.updateDrawer('value',item);
                            item.addValueLabel = true;
                        }
                        if(item.parameters.has_label){
                           item.has_label = "yes";
                           item.has_label_false =false;
                           item.addFieldLabel = true;
                           vm.updateDrawer('label',item)

                        }
                        else{
                            item.has_label=false;
                            item.has_label_false ="no";
                            item.addFieldLabel = false;

                        }
                        if(item.is_variable_field){
                            item.variable_label = true;

                        }
                        if(item.domain_mapping!=undefined){
                            $scope.domain_mapping_obj[item.domain_mapping] = '';
                            var str = item.domain_mapping;
                            var strLength = str.length;
                            var split = str.split('.');
                            var attrLength = split[split.length-1].length;
                            var finalStr =  strLength-attrLength-1;
                            var res = str.substring(finalStr,0);
                            item.entity = res;
                            item.attribute = split[split.length-1];
                        }
                        if(item.hasOwnProperty("domain_mapping")){
                            item.isDomain = "yes";
                            item.dup_doc_var = "";
    //                        if(value.rule_id != undefined)
    //                            obj.rule_id = value.rule_id;
                        }
                        else if(item.hasOwnProperty("document_variable")){
                            item.isDomain = "no";
                            vm.selectedRulesWithObj = [];
                            item.dup_doc_var = item.document_variable;
                            item.document_variable = item.document_variable;
                            item.doc_var = item.doc_var;
                            item.variable_type = item.doc_var.type;
                            if(item.doc_var.rule_id != undefined){
                                item.rule_id = item.doc_var.rule_id;
//                                if(item.doc_var.rule_id.length > 0)
//                                    $scope.enableRuleEdit[key] = true;
                                angular.forEach(item.doc_var.rule_id,function(value,key){
                                    var singleRule = vm.allRules.filter(function(e){if(value==e.rule_id){return e}});
                                    if(singleRule.length>0)
                                        vm.selectedRulesWithObj.push(singleRule[0]);
                                });
                            }
                        }


   };

   vm.getOMR = function(item){
        if(item.name==undefined)
             item.name = 'OMR';
        item.showOMRDomainObj = true;
        item.drawerIndexObj = {};
        if(item.coordinates!=undefined){
            vm.updateDrawer('value',item);
            item.addOMRValueLabel = true;
        }
        if(item.parameters.has_label){
           item.has_label = "yes";
           item.has_label_false =false;
           item.addOMRFieldLabel = true;
           vm.updateDrawer('label',item);
        }
        else{
            item.has_label=false;
            item.has_label_false ="no";

        }
        angular.forEach(item.groups[0].options,function(option,key){
            if(option.coordinates!=undefined){
               option.page_no = item.page_no;
               option.optionValue = true;
               vm.updateOMRGroupDrawer('value',option);

            }
        })

        if(item.domain_mapping!=undefined){
            $scope.domain_mapping_obj[item.domain_mapping] = '';
            var str = item.domain_mapping;
            var strLength = str.length;
            var split = str.split('.');
            var attrLength = split[split.length-1].length;
            var finalStr =  strLength-attrLength-1;
            var res = str.substring(finalStr,0);
            item.entity = res;
            item.attribute = split[split.length-1];
        }

   };

   vm.getTable = function(data){
          if(data.name==undefined)
                 data.name = 'Table';
          angular.forEach(data.headings,function(value){
                if(value.hasOwnProperty('domain_mapping')) {
                      $scope.domain_mapping_obj[value.domain_mapping] = '';
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

   vm.getSection = function(item){
     if(item.name==undefined)
                 item.name = 'Section';
     item.drawerIndexObj = {};
     item.showSectionObj = {};
     item.is_section_selected = true;
     if(item.coordinates!=undefined){
        vm.updateDrawer('value',item);
     }
   };



   $scope.recursive = function(data){
        for(var i=0;i<data.length;i++){
           if(data[i].type=='section'){
              //$scope.drawer.push(data[i]);

              vm.getSection(data[i]);
              $scope.recursive(data[i].elements);
           }
           else if(data[i].type == 'field'){
              vm.getField(data[i]);
           }
           else if(data[i].type == 'omr'){
              vm.getOMR(data[i]);
           }
           else if(data[i].type == 'paragraph'){
                if(data[i].name==undefined)
                   data[i].name = 'Paragraph';
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

   vm.deleteElement = function(item){
         ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +item.name+ "'" +' ' + '?';
              $scope.onConfirmActivation = function (){
                  item.is_delete = true;
                  ngDialog.close();
                  vm.deleteFieldData(item);
              };
          }]
         });


   };

   $scope.editName = function(item){
        item.name_edit= angular.copy(true);
   };

    vm.deleteFieldData = function(list){
        //$scope.listOfFields.splice(index,1);
        var obj = {};
            obj.template_id = $scope.template_id;
            obj.section_id = list.section_id;
            obj.type = list.type;
            if(list.type!='section')
              obj.id = list.id;
            obj.id = list.id;

        documentService.deleteField(vm.sess_id,obj).then(function (resp) {
            if(resp.data.status == 'success'){
               $.UIkit.notify({
                                 message :resp.data.msg,
                                 status  : 'success',
                                 timeout : 3000,
                                 pos     : 'top-center'
                             });
               vm.getDocumentsList($stateParams.id);
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
                                 message : 'Internal Server Error',
                                 status  : 'warning',
                                 timeout : 3000,
                                 pos     : 'top-center'
                             });
        })

    };

//    var scroll_static = true;
//    $('#scrollImage').on("scroll resize", function () {
//    var pos = $('#caption1').offset();
//    $('.post').each(function () {
//        if (pos.top >= $(this).offset().top && pos.top <= $(this).next().offset().top) {
//            $scope.inde = $(this)[0].id;
//            return; //break the loop
//        }
//    });
//    clearTimeout( $.data( this, "scrollCheck" ) );
//         var split=$scope.inde.split('_');
//         $scope.current_page = parseInt(split[1]);
//         $scope.$apply();
//        console.log($scope.inde);
//
//    });
//    $(document).ready(function () {
//            $(window).trigger('scroll'); // init the value
//    });
//
//    vm.divHeight = $('#scrollImage').height()/2;



    // ace example

    $scope.aceLoaded = function(_editor) {
        // Options
        _editor.setReadOnly(true);
    };

    $scope.aceChanged = function (_editor) {

    };

    $scope.lngForCondition = "javascript";
    $scope.lngForAction = "javascript";

    $scope.conditionLng = function(lng){
        $scope.aceOptionsCon = {
            theme: 'tomorrow_night_eighties',
            mode: lng,
            useWrapMode : true,
            advanced: {
                  enableSnippets: true,
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true
            }
        }
        if(lng=="javascript"){
            var editorCondition = ace.edit('aceEditorcusCondition');
            editorCondition.setValue("function apply(source,target){\n    return true;\n}");
        }
        else{
            var editorCondition = ace.edit('aceEditorcusCondition');
            editorCondition.setValue("class CustomCond {\n    def apply(source,target){\n        return true;\n    }\n}");
        }
    };

    $scope.actionLng = function(lng){
        $scope.aceOptionsAct = {
            theme: 'tomorrow_night_eighties',
            mode: lng,
            useWrapMode : true,
            advanced: {
                  enableSnippets: true,
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true
            }
        }
        if(lng=="javascript"){
            var editorAction = ace.edit('aceEditorcusAction');
            editorAction.setValue("function apply(source,target){\n    return source;\n}");
        }
        else{
            var editorAction = ace.edit('aceEditorcusAction');
            editorAction.setValue("class CustomCond {\n    def apply(source,target){\n        return source;\n    }\n}");
        }
    };
    $scope.conditionLng('javascript');
    $scope.actionLng('javascript');
    $scope.aceOptionsCndEdt = [];
    $scope.aceOptionsActEdt = [];

    vm.initiateAceEditorForEdit = function(type){
        $timeout(function(){
            if(type=="condition"){
                for(var i=0;i<vm.customConditionList.length;i++){
                    var lng = "";
                    if(vm.customConditionList[i].lang == "javascript" || vm.customConditionList[i].lang == "js"){
                        lng = "javascript";
                    }
                    else{
                        lng = "groovy";
                    }
                    $scope.aceOptionsCndEdt[i] = {
                        theme: 'tomorrow_night_eighties',
                        mode: lng,
                        useWrapMode : true,
                        advanced: {
                              enableSnippets: true,
                              enableBasicAutocompletion: true,
                              enableLiveAutocompletion: true
                        }
                    }
                    var editorConditionEdit = ace.edit('aceEditorCondition'+i);
                    editorConditionEdit.setValue(vm.customConditionList[i].code);
                }
            }
            else{
                for(var i=0;i<vm.customActionList.length;i++){
                    var lng = "";
                    if(vm.customActionList[i].lang == "javascript" || vm.customActionList[i].lang == "js"){
                        lng = "javascript";
                    }
                    else{
                        lng = "groovy";
                    }
                    $scope.aceOptionsActEdt[i] = {
                        theme: 'tomorrow_night_eighties',
                        mode: lng,
                        useWrapMode : true,
                        advanced: {
                              enableSnippets: true,
                              enableBasicAutocompletion: true,
                              enableLiveAutocompletion: true
                        }
                    }
                    var editorActionEdit = ace.edit('aceEditorAction'+i);
                    editorActionEdit.setValue(vm.customActionList[i].code);
                }
            }
        },1000)
    };

    vm.getCustomConditionsAndActions = function(type){
        documentService.getCustomConditionAndAction(vm.sess_id,type).then(function(resp){
            if(resp.data.status == 'success'){
                if(type == "condition"){
                    vm.customConditionList = resp.data.custom_rules;
                }
                else{
                    vm.customActionList = resp.data.custom_rules;
                }
                vm.initiateAceEditorForEdit(type);
            }
            else{
                $.UIkit.notify({
                     message : resp.data.msg,
                     status  : 'warning',
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

    vm.getCustomConditionsAndActions("condition");
    vm.getCustomConditionsAndActions("action");
    $scope.initialCodeInEditor = function(){
        var editorCondition = ace.edit('aceEditorcusCondition');
        var editorAction = ace.edit('aceEditorcusAction');
        editorCondition.setValue("function apply(source,target){\n    return true;\n}");
        editorAction.setValue("function apply(source,target){\n    return source;\n}");
    }
    $scope.initialCodeInEditor();

    vm.submitCustomRule = function(key){
        var editor = ace.edit('aceEditor'+key);
        var code = editor.getValue();
        var reqObj = {"name" : "","type" : "condition","code": "","lang": ""};
        reqObj.code = code;
        var flag = true;
        if(key == "cusCondition"){
            if($scope.customConditionName  == undefined || $scope.customConditionName == ""){
                flag = false;
                $scope.errorMsg = "Please enter the condition name";
            }
            else{
                reqObj.name = $scope.customConditionName;
                reqObj.type = "condition";
                if($scope.lngForCondition == "javascript"){
                    reqObj.lang = "js";
                }
                else{
                    reqObj.lang = "groovy";
                }
            }
        }
        if(key == "cusAction"){
            if($scope.customActionName == undefined || $scope.customActionName == ""){
                flag = false;
                $scope.errorMsg = "Please enter the action name";
            }
            else{
                reqObj.name = $scope.customActionName;
                reqObj.type = "action";
                if($scope.lngForAction == "javascript"){
                    reqObj.lang = "js";
                }
                else{
                    reqObj.lang = "groovy";
                }
            }
        }
        if(flag){
            $scope.showSpinnerRule = true;
            $scope.errorMsg = "";
            documentService.saveCustomRule(vm.sess_id,reqObj).then(function(resp){
                if(resp.data.status == 'success'){
                    $scope.showSpinnerRule = false;
                    editor.setValue("");
                    $scope.customConditionName = "";
                    $scope.customActionName = "";
                    vm.getRulesConfig();
                    vm.getCustomConditionsAndActions(reqObj.type);
                    $.UIkit.notify({
                         message : resp.data.msg,
                         status  : 'success',
                         timeout : 3000,
                         pos     : 'top-center'
                    });
                }
                else{
                    $scope.showSpinnerRule = false;
                    $.UIkit.notify({
                         message : resp.data.msg,
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                    });
                }
            },function(err){
                 console.log(err)
                 $scope.showSpinnerRule = false;
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
            });
        }

    };

    vm.testCondition = function(param){
        var reqObj = {};
        reqObj.lang = "js";
        var editor = ace.edit('aceEditor'+param);
        var code1 = editor.getValue();
        reqObj.code = code1;
        if(param == "cusCondition"){
            if($scope.lngForCondition == "javascript"){
                reqObj.lang = "js";
            }
            else{
                reqObj.lang = "groovy";
            }
            reqObj.isCondition = true;
            if(!isNaN(vm.sourceConditionValue)){
                vm.sourceConditionValue = parseFloat(vm.sourceConditionValue);
            }
            if(!isNaN(vm.targetConditionValue)){
                vm.targetConditionValue = parseFloat(vm.targetConditionValue);
            }
            reqObj.source = vm.sourceConditionValue;
            reqObj.target = vm.targetConditionValue;
            $scope.showSpinnertestCondition = true;
        }
        else{
            if($scope.lngForAction == "javascript"){
                reqObj.lang = "js";
            }
            else{
                reqObj.lang = "groovy";
            }
            reqObj.isCondition = false;
            if(!isNaN(vm.sourceActionValue)){
                vm.sourceActionValue = parseFloat(vm.sourceActionValue);
            }
            if(!isNaN(vm.targetActionValue)){
                vm.targetActionValue = parseFloat(vm.targetActionValue);
            }
            reqObj.source = vm.sourceActionValue;
            reqObj.target = vm.targetActionValue;
            $scope.showSpinnertestAction = true;
        }
        documentService.testConditionAndAction(vm.sess_id,reqObj).then(function(resp){
               if(resp.data.status == "success"){
                   if(param == "cusCondition"){
                       $scope.outputOfTestCondition = resp.data.result;
                   }
                   else{
                       $scope.outputOfTestAction = resp.data.result;
                   }
                   $scope.showSpinnertestCondition = false;
                   $scope.showSpinnertestAction = false;
               }
               else{
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'danger',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                   $scope.showSpinnertestCondition = false;
                   $scope.showSpinnertestAction = false;
               }

        },function(err){
             $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
             });
             $scope.showSpinnertestCondition = false;
             $scope.showSpinnertestAction = false;
        });
    };

    vm.editCustom = function(obj,index){


        if(obj.type == "condition"){
            var editor = ace.edit('aceEditorCondition'+index);
            var code = editor.getValue();
        }
        else{
            var editor = ace.edit('aceEditorAction'+index);
            var code = editor.getValue();
        }
        obj.code = angular.copy(code);
        documentService.saveCustomRule(vm.sess_id,obj).then(function(resp){
            if(resp.data.status == 'success'){
                vm.getCustomConditionsAndActions(obj.type);
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
                     status  : 'warning',
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

    vm.clearAllScopes = function(){
        vm.sourceConditionValueInEdit = "";
        vm.targetConditionValueInEdit = "";
        vm.sourceActionValueInEdit = "";
        vm.targetActionValueInEdit = "";
        $scope.outputOfTestConditionInEdit = "";
        $scope.outputOfTestActionInEdit = "";
    };

    vm.testConditionAndActionInEdit = function(obj,index){
        var reqObj = {};
        reqObj.source = vm.sourceConditionValueInEdit;
        reqObj.lang = obj.lang;
        if(obj.type == "condition"){
            var editor = ace.edit('aceEditorCondition'+index);
            var code = editor.getValue();
            if(isNaN(vm.sourceConditionValueInEdit)){
                vm.sourceActionValue = parseFloat(vm.sourceConditionValueInEdit);
            }
            if(isNaN(vm.targetConditionValueInEdit)){
                vm.targetActionValue = parseFloat(vm.targetConditionValueInEdit);
            }
            reqObj.source = vm.sourceConditionValueInEdit;
            reqObj.target = vm.targetConditionValueInEdit;
            reqObj.isCondition = true;
        }
        else{
            var editor = ace.edit('aceEditorAction'+index);
            var code = editor.getValue();
            if(isNaN(vm.sourceActionValueInEdit)){
                vm.sourceActionValue = parseFloat(vm.sourceActionValueInEdit);
            }
            if(isNaN(vm.targetActionValueInEdit)){
                vm.targetActionValue = parseFloat(vm.targetActionValueInEdit);
            }
            reqObj.source = vm.sourceActionValueInEdit;
            reqObj.target = vm.targetActionValueInEdit;
            reqObj.isCondition = false;
        }
        reqObj.code = code;
        documentService.testConditionAndAction(vm.sess_id,reqObj).then(function(resp){
               if(resp.data.status == "success"){
                   if(obj.type == "condition"){
                       $scope.outputOfTestConditionInEdit = resp.data.result;
                   }
                   else{
                       $scope.outputOfTestActionInEdit = resp.data.result;
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
             $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
             });
        });
    }

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

    vm.deleteCustomRule = function(reqObj){
        documentService.deleteCustomRule(vm.sess_id,reqObj).then(function(resp){
            if(resp.data.status == 'success'){
                vm.getRulesConfig();
                vm.getCustomConditionsAndActions(reqObj.type);
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
                     status  : 'warning',
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

    vm.actionAndConditionDelete = function(type,obj){
        var reqObj = {"rule_id":obj.rule_id,"type":obj.type};
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete this '+obj.type+' ?';
              $scope.onConfirmActivation = function (){
                    ngDialog.close();
                    vm.deleteCustomRule(reqObj);
                };
            }]
        });
    };

});



