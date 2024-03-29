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
  .controller('testUnStructuredCtrl', function (
                              $scope,$state,$rootScope,$location,
                              Upload,$stateParams,ngDialog,
                              documentService,entitiesService,dataManagementService,$window,$timeout,$compile) {
      var vm = this;
      vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= vm.loginData.sess_id;
      $scope.height = $window.innerHeight;
      $(".image-style").height($(window).height());

      $scope.cardinalityList=[{"name":"n", "value":"n"},{"name":"1", "value":"1"}];

      vm.loadEntitiesList = function(){
        entitiesService.getEntities({'sess_id':vm.sess_id}).then(function(data){
            if(data.data!=null && data.data!=undefined){
                $scope.domainObjects =  data.data.domain_object;
                //$scope.extractOutput = $scope.domainObjects;
            }
        });
      };
//      vm.loadEntitiesList();
      $rootScope.getTestList = function(){
        $scope.testList = [{"file_name":"CMS","doc_id":""},{"file_name":"CSF","doc_id":""},{"file_name":"CMS","doc_id":""},{"file_name":"Resume","doc_id":""}];
        documentService.getUnknownTestTemplates(vm.sess_id,$rootScope.state_id).then(function(resp){
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

      $scope.sendDic = function(files){
          var file = files;
          if(file.length==0){

          }
          else{
             file.upload = Upload.upload({
                  url: 'api/documentTemplates/test/',
                  method: 'POST',
                  headers: {"sess_token": $scope.loginData.sess_id},
                  data:{'data':JSON.stringify({"template_name": $rootScope.unknown_template_name,"template_id":$rootScope.state_id})},
                  file: file
             });
             file.upload.then(function (response) {

                  if(response.data.status=='success'){
                             //$scope.getTrainDetails($rootScope.state_id);
                              $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'success',
                                 timeout : 2000,
                                 pos     : 'top-center'
                              });
                              $scope.afterUpload = true;
                              $rootScope.getTestList();
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

      $scope.getData = function(id){
           documentService.getTestHierarchyData(vm.sess_id,id).then(function(resp){
                  if(resp.data.status == "success"){
                       if(resp.data.enriched_data!=undefined){
                           vm.initialiseDrawer();
                           $scope.elementsList = [];
                           if(resp.data.elements!=undefined)
                             $scope.elementsList = resp.data.elements;

                           $scope.extractOutput = resp.data.enriched_data;
                           vm.getresultByHierarchy();
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

      $scope.getHierarchyData = function(item,index){
            $scope.itemDocId=item.doc_id;
            $scope.imagePaths = angular.copy(item.pages);
            $scope.current_page = 1;
            $scope.activeClass = [];
            $scope.activeClass[index] = "activeButton";
            $scope.no_of_pages = item.no_of_pages;
            angular.forEach($scope.imagePaths, function(value,key){
                        $scope.imagePaths[key].file_path = "/static"+$scope.volume+$scope.imagePaths[key].file_path;
            });
            //$scope.imagePaths = [{ "file_path": "./app/images/working.png", "page_no": 1 }, { "file_path": "./app/images/working.png", "page_no": 2 },{ "file_path": "./app/images/working.png", "page_no": 3 },{ "file_path": "./app/images/working.png", "page_no": 4 },{ "file_path": "./app/images/working.png", "page_no": 5 }]
            $("#ImageLocation").empty();
            var htmlContent = "<div ng-repeat='path in imagePaths track by $index' id='page_{$ path.page_no $}'name='{$ path.page_no $}' class='post'>{$ path.page_no $}<div class='panel panel-default' mr-image mr-src='path.file_path' mr-max width='auto' mr-selector='selector[$index+1]' mr-drawer='drawer[$index+1]'></div></div>"
            var el = $compile( htmlContent )($scope);
            var element = document.getElementById("ImageLocation");
            angular.element(document.getElementById("ImageLocation")).append(el);
            vm.initialiseDrawer();
            vm.initialiseSelector();
            $scope.zoomDisplay = 'zoomSize';
            $scope.currentDocId = item.doc_id;
            $scope.showUnknown = true;
            $scope.current_page = 1;
            $scope.current_selection_page_no = 1;
            $rootScope.selectedIndex =[];
            $rootScope.selectedPage = [];
            $scope.isEditAttributeValue={};
            $scope.extractOutput = [];
            $scope.getData($scope.itemDocId);
      };


      ///right Side Data //////
         $scope.rect = {
                data_color: '#337ab7',
                marker_color: '#00ad2d',
                section_color:'#FF0000',
                stroke: 5
         };

         vm.updateDrawer = function(type,item){
           if(item.value_coordinates_list!=undefined){
                for(var i =0;i<item.value_coordinates_list.length;i++){
                    var obj = angular.copy(item);
                    obj.x1 = obj.value_coordinates_list[i].x1;
                    obj.x2 = obj.value_coordinates_list[i].x2
                    obj.y1 = obj.value_coordinates_list[i].y1;
                    obj.y2 = obj.value_coordinates_list[i].y2;
                    obj.is_display = true;
                    obj.stroke = $scope.rect.stroke;
                    obj.color = '#f9a235';
                    obj.bgColor = '#f9a235';
                    obj.borderStyle='solid';
                    obj.page_no = obj.value_coordinates_list[i].page_no;
                    if(type=='value')
                        obj.color = "#f9a235";
                    console.log("dddddddddd"+JSON.stringify(obj));
                    obj.index = $scope.drawer[obj.value_coordinates_list[i].page_no].length;
                    item.drawerIndexObj['value'+i] = obj.index;
                    $scope.drawer[obj.value_coordinates_list[i].page_no].push(obj);
                }
           }
         };

         vm.getAttributeByHierarchy = function(data){
                for(var i=0;i<data.attributes.length;i++){
                    var val = data.attributes[i];
                    if(val.current_value!=undefined){
                        if(val.current_value.length>0){
                            for(var j=0;j<val.current_value.length;j++){
                                if(val.current_value[j].value_coordinates_list!=undefined){
                                    val.current_value[j].drawerIndexObj = {};
                                    val.current_value[j].temp_id = val.temp_id;
                                    vm.updateDrawer('value',val.current_value[j]);
                                }
                            }
                        }
                    }
                }
         };



         vm.initialiseDrawer = function(){
            $scope.drawer = [];

            for(var i=0;i<$scope.no_of_pages;i++){
                $scope.drawer[i+1] = [];

            }
         };
         vm.initialiseSelector = function(){

            $scope.selector=[];
            for(var i=0;i<$scope.no_of_pages;i++){
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

         vm.enableSelectorInEdit = function(item,coordinates,node){
            $scope.rowHighlight = [];
            for(var i=0;i<$scope.no_of_pages;i++){
               $scope.selector[i+1].clear();
               $scope.selector[i+1].enabled=false;
            }
            $scope.zoomDisplay = 'zoomSize1';
            var size = Object.keys(item.drawerIndexObj).length;
            for(var j=0;j<size;j++){
                $rootScope.selectedIndex.push(item.drawerIndexObj['value'+j]);
            };
            for(var k =0;k<coordinates.length;++k){
                $rootScope.selectedPage.push(coordinates[k].page_no);
                vm.doSetTimeout(k,coordinates);
            }
            $rootScope.imageBlur='';
         };

         vm.doSetTimeout = function(k,coordinates){
            setTimeout(function(){
                    var topPos = document.getElementById('page_'+coordinates[k].page_no).offsetTop;
                    var scrollingElement = angular.copy(topPos+coordinates[k].y1-200);
                    var scrollingElementLeft = angular.copy(coordinates[k].x1);
                    document.getElementById('scrollImage').scrollTop = scrollingElement;
                    document.getElementById('scrollImage').scrollLeft = scrollingElementLeft;
            },200);
         };

         vm.enableSelectorInImageClick = function(page_no,coordinates,data){
            $scope.rowHighlight = [];
            for(var i=0;i<$scope.no_of_pages;i++){
               $scope.selector[i+1].clear();
               $scope.selector[i+1].enabled=false;
            }
            $scope.zoomDisplay = 'zoomSize1';
            for(var k =0;k<coordinates.length;++k){
                $rootScope.selectedIndex.push(data.index);
                $rootScope.selectedPage.push(coordinates[k].page_no);
                vm.doSetTimeout(k,coordinates);

            }
            $rootScope.imageBlur='';
         };

         vm.getCurrentValue = function(item){

             if(item.current_value[0].value_coordinates_list !=undefined){
                 //$scope.initialiseDrawerAndSelector();
                 $scope.rowHighlightAttr = [];
                 $scope.rowHighlightAttr[item.temp_id] = 'highlightClass'
                 $scope.current_page = item.current_value[0].page_no;
                 $rootScope.selectedIndex = [];
                 $rootScope.selectedPage = [];
                 vm.enableSelectorInEdit(item.current_value[0],item.current_value[0].value_coordinates_list,item);
                 //vm.editZone(item,item.value_coordinates);
             }
         };

         $.fn.isInViewport = function() {
              var elementTop = $(this).offset().top;
              var elementBottom = elementTop + $(this).outerHeight();

              var viewportTop = $(window).scrollTop();
              var viewportBottom = viewportTop + $(window).height()+100;
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
            vm.renderHtml = $scope.pagesInfo[index].doc_html;
         };

         $scope.openId = function (id) {
            var str = id.split('-');
            var id ='';
            $('.collapse.in').removeClass('in');
                     // $(".group"+''+data.groupName).addClass('in');
                     // $(".group"+''+data.groupName).removeAttr( 'style' );
                     // $(".showRow"+ ''+data.indexObj.childIndex).addClass('in');
                     // $(".showRow"+''+data.indexObj.childIndex).removeAttr( 'style' );
            for(var i=0;i<str.length;i++){
                if(i==0)
                   id = id+''+str[i];
                else
                  id = id+'-'+str[i];

                $("."+id).addClass('in');
                $("."+id).removeAttr( 'style' );
            }
         };


         vm.enableSelector = function(){
            $scope.rowHighlight = [];
            $scope.zoomDisplay = 'zoomSize';
            $scope.current_page = 1;
            $scope.current_selection_page_no = 1;
            $rootScope.selectedIndex =[];
            $rootScope.selectedPage = [];
            for(var i=0;i<$scope.no_of_pages;i++){
               $scope.selector[i+1].clear();
               $scope.selector[i+1].enabled=false;
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
               $scope.rowHighlight = [];
               $scope.current_page = angular.copy(1);
               $scope.current_selection_page_no = 1;
               $rootScope.selectedIndex =[];
               $rootScope.selectedPage = [];
            for(var i=0;i<$scope.no_of_pages;i++){
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

         vm.changePageNumUnknown = function (type) {
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

         vm.keyEnterUnknown = function (event) {
                if(event.which === 13) {
                   if($scope.current_page<=$scope.no_of_pages) {
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

         $scope.rowHighlightTable={};
         $scope.innerData={};

         $scope.getAttributeName = function(text){
            if(text!='' && text!=undefined){
               var str = text;
               var split= str.split('.')
               var length = split[0].length
               var res = str.substring(length+1, str.length);
              return res;
            }
            return '';
         };

         vm.getAttributesList = function(){
              entitiesService.getDomainObjects({'sess_id':vm.sess_id}).then(function(resp){
                  $scope.entitiesListData = resp.data;
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


         $rootScope.$on("selector",function(evt,data){


               $scope.current_selection_page_no = data.id;
               for(var i=1;i<=$scope.no_of_pages;i++){
                 if(data.id!=i){
                   $scope.selector[i].clear();

                 }
               }
         });


          $rootScope.$on("edited",function(evt,data){
//               if(data.type=='field' || data.type=='omr' || data.type=="paragraph"){
//                   $('.panel-collapse.in')
//                   .removeClass('in');
//                   $(".group"+ ''+data.groupName).addClass('in');
//                 $(".group"+''+data.groupName).removeAttr( 'style' );
//                   setTimeout(function(){
//                        var topPos = document.getElementById('inner'+''+data.groupName+''+data.indexObj.parentIndex).offsetTop;
//                        console.log(topPos);
//                        var scrollingElement = angular.copy(topPos-75);
//                        document.getElementById('scrollDiv').scrollTop = scrollingElement;
//                    },100);
//    //                $("#scrollDiv").scrollTop(scrollingElement);
//
//
//                 $scope.rowClick(data.indexObj.parentIndex,data.drawerIndex,data.groupName);
//
//               }
//               else{
//                 $('.panel-collapse.in').removeClass('in');
//                 $(".group"+ ''+data.groupName).addClass('in');
//                 $(".group"+''+data.groupName).removeAttr( 'style' );
//                 $(".showRow"+ ''+data.indexObj.childIndex).addClass('in');
//                 $(".showRow"+''+data.indexObj.childIndex).removeAttr( 'style' );
//                 setTimeout(function(){
//                        var topPos = document.getElementById('innerData'+''+data.groupName+data.indexObj.parentIndex+''+data.indexObj.childIndex+''+data.indexObj.superChildIndex).offsetTop;
//                        console.log(topPos);
//                        var scrollingElement = angular.copy(topPos-75);
//                        document.getElementById('scrollDiv').scrollTop = scrollingElement;
//                  },100);
//
//
//                 $scope.rowTableClick(data,data.drawerIndex,data.groupName);
//
//               }


          if(vm.selectedElementFlag){

             vm.selectedElementId = data.element_id;
          }
          else{
              $scope.openId(data.temp_id);
              $scope.current_page = data.page_no;
              $scope.rowHighlightAttr = [];
              $scope.rowHighlightAttr[data.temp_id] = 'highlightClass'
              vm.enableSelectorInImageClick(data.page_no,data.value_coordinates_list,data)
              setTimeout(function(){
                        var topPos = document.getElementsByClassName(data.temp_id)[0].offsetTop;
                        var scrollingElement = angular.copy(topPos-100);
                        document.getElementById('scrollDiv2').scrollTop = scrollingElement;
              },100);
          }

          });

          $scope.editAction = [];

          $scope.editActionData = function($index){
            $scope.editAction[$index]= true;
          };

          $scope.retrainData = function(){
            entitiesService.retrain({'sess_id':vm.sess_id}).then(function(data){
                         console.log("data"+data)
                         if(data.data.status == 'success'){
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



            },function(){
                $.UIkit.notify({
                   message : "Internal Server Error",
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });

            });

          }

          $scope.getDocumentsListData = function(type){

               documentsListService.getProcessList({'sess_id':vm.sess_id,data:{'filter_obj':$scope.filter_obj}}).then(function(data){
                   if(data.data.status=="success"){
                      $scope.processListData=data.data.data;
                      $scope.processListDataList = $scope.processListData.data;
                      $scope.filter_obj.totalRecords = data.data.data.total_count;
                      $scope.recentRecords = [];
                      angular.forEach($scope.processListDataList,function(value,key){
                         var digital = false
                        if(value.hasOwnProperty('is_digital'))
                           digital = true;
                        $scope.recentRecords.push({'doc_id':value.doc_id,'mime_type':value.mime_type,'is_digital':digital});
                      });
                      localStorage.setItem('recentRecords',JSON.stringify($scope.recentRecords))
                      localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
                      //$scope.updateFilterObj(type);
                      vm.navigatePage(type);

                   }
                   else{
                     $.UIkit.notify({
                       message : data.data.msg,
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





          vm.newAttribute = function(action){
               vm.newAttributeObj = angular.copy({"attribute":"","value":"","action":action});
               vm.newAttributeShow = true;
          };

          vm.saveNewAttribute = function(){
               if(vm.newAttribute.attribute != "" && vm.newAttribute.attribute != undefined){
                   if(vm.newAttribute.value != "" && vm.newAttribute.value != undefined){
                       vm.emailEntities.fields[0].nlp.attributes.push(vm.newAttribute);
                       entitiesService.sendEmailNlp({'data':sendObj,'sess_id':vm.sess_id}).then(function(data){
                          if(data.data.status=="success"){
                             vm.newAttributeShow = false;
                             vm.newAttrErr = "";
                             $.UIkit.notify({
                                   message : data.data.msg,
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                             });
                          }
                       },function(err){
                           vm.newAttrErr = "";
                           $.UIkit.notify({
                               message : "Internal server error",
                               status  : 'warning',
                               timeout : 3000,
                               pos     : 'top-center'
                           });
                       });
                   }
                   else{
                       vm.newAttrErr = "Please enter the value";
                   }
               }
               else{
                   vm.newAttrErr = "Please enter the attribute";
               }
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
                $scope.isEditAttributeValue[tempId]=true;
            }
        };
        $scope.cancelEditAttributeValues = function(index,tempId,templateType){
            $scope.isEditAttributeValue[tempId]=false;
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
                curArr.score=val.score;
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
            node.is_corrected = true;
            $scope.submitFeedback(obj,tempId);
        };

        $scope.submitFeedback = function(obj,tempId){
            var reqObj = {"sess_id":vm.sess_id,"data":{"feedback": obj.data,"formatedEntity":$scope.extractOutput}};
            entitiesService.saveEntityLinkingFeedback(reqObj).then(function (data) {
                if(data.data.status=="success"){
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'success',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                    $scope.isEditAttributeValue[tempId]=false;
                    $scope.newNode = "";
                    vm.attributeKey = "";
                    vm.attributeValue= "";
                    vm.selectedElementFlag = false;
                    vm.selectedElementId = '';
                    $scope.getData($scope.itemDocId);
                }
                else {
                    $scope.getData($scope.itemDocId);
                    $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                    });
                }

            },function (err) {
                $scope.getData($scope.itemDocId);
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
                            "doc_id":$stateParams.id,
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
            ngDialog.open({ template: 'confirmBox',
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
            node.is_accept = true;
            $scope.submitFeedback(obj,tempId);
//            entitiesService.acceptEntityLinking(obj).then(function (data) {
//                if(data.data.status=="success"){
//                    node.is_accept = true;
//                    $.UIkit.notify({
//                     message : data.data.msg,
//                     status  : 'success',
//                     timeout : 3000,
//                     pos     : 'top-center'
//                    });
//                    vm.getGroups();
//                }
//                else {
//                    $.UIkit.notify({
//                     message : data.data.msg,
//                     status  : 'warning',
//                     timeout : 3000,
//                     pos     : 'top-center'
//                    });
//                }
//
//            },function (err) {
//                $.UIkit.notify({
//                 message : "Internal server error @deleteAttributeValues",
//                 status  : 'warning',
//                 timeout : 3000,
//                 pos     : 'top-center'
//                });
//            })
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

        $scope.fieldCriteria = function(node){
            if(node.is_accept){
                return 'accepted'
            }
            else if(node.is_corrected){
              return 'corrected'
            }
            else{
               return 'reviewed'
            }
        };

        vm.addNewNode = function(node,type,thisVal){
           vm.attributeValue = "";
           vm.attributeKey = "";
           vm.selectedElementId = '';
           vm.selectedElementFlag = false;
           $scope.drawerCopy = angular.copy($scope.drawer);
           if(type == 'group'){
               $scope.newNode = node.entity_id;
                var temp = thisVal.$parentNodeScope.$modelValue.temp_id;
                var afterTemp = temp.replace("-",".");
                $scope.attributesList = $scope.entitiesListData[afterTemp];

           }
           else{
                $scope.newNode = node.temp_id;
                var temp = node.temp_id;
                var afterTemp = temp.replace("-",".");
                $scope.attributesList = $scope.entitiesListData[afterTemp];
           }

        };

        vm.selectedElement = function(){
            vm.selectedElementId = '';
            vm.selectedElementFlag = true;
            if($scope.elementsList.length>0){
                $scope.drawer = angular.copy([]);
                for(var i=0;i<$scope.no_of_pages;i++){
                    $scope.drawer[i+1] = angular.copy([]);
                }
                $scope.zoomDisplay = 'zoomSize';
                $scope.current_page = 1;
                $scope.current_selection_page_no = 1;
                $rootScope.selectedIndex =[];
                $rootScope.selectedPage = [];

                //vm.enableSelector();
                for(var i=0;i<$scope.elementsList.length;i++){
                    $scope.elementsList[i].drawerIndexObj = {};
                    vm.updateDrawer('value',$scope.elementsList[i]);
                }
            }
        };

        vm.cancelNewnode = function(){
            $scope.drawer = angular.copy([]);
            for(var i=0;i<$scope.no_of_pages;i++){
                $scope.drawer[i+1] = angular.copy([]);
            }
            $scope.zoomDisplay = 'zoomSize';
            $scope.current_page = 1;
            $scope.current_selection_page_no = 1;
            $rootScope.selectedIndex =[];
            $rootScope.selectedPage = [];
            $scope.drawer = angular.copy($scope.drawerCopy);
            vm.selectedElementId = '';
            vm.selectedElementFlag = false;
            $scope.newNode = '';
            vm.attributeValue = "";
            vm.attributeKey = "";
        };

        vm.saveNewnode = function(node,type,thisVal){
           if(vm.selectedElementId==''){
             $.UIkit.notify({
                                               message : 'Please select an element ',
                                               status  : 'danger',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });
             return
           }
            var tempId = node.temp_id;
            var name = '';
            var type_group = 'entity_group'
            if(type == 'group'){
               name = thisVal.$parentNodeScope.$modelValue.name;
               type_group = 'attribute'
            }
            else{
               name = node.name
            }
            var obj={
                "sess_id":vm.sess_id,
                "data":{
                        "insight_id": node.insight_id,
                        "type": "attribute",
                        "key": name+'.'+vm.attributeKey,
                        "entity_id": node.entity_id,
                        "element_id":vm.selectedElementId,
                        "action": "upsert",
                        "doc_id":$scope.itemDocId,
                        "value": [{
			                "value": vm.attributeValue,
			                "is_checked": true
		                }]
                      }
            };

            if(type != 'group'){
               obj.data.add_type=type_group
            }

            var pushObj = {
                    "attributes": [{
                        "name": vm.attributeKey,
                        "is_corrected":true,
                        "current_value": [{
                            "value": vm.attributeValue,
                            "is_checked": true
                        }],
                        "type": "attribute"
                    }],
                    "entity_id": node.entity_id,
                    "type": "attribute"
				}
		    if(type=="group"){
		        node.attributes.push(pushObj.attributes[0]);
		    }
		    else{
		        node.attributes.push(pushObj);
		    }
			$scope.submitFeedback(obj,tempId);
        };

        vm.completeReview = function(){
            var text = $scope.recordData.file_name;
            var doc_id = $scope.currentDocId;
            ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to complete the review for '+"'"+text+"'"+' ?';
                  $scope.onConfirmActivation = function (){
                             ngDialog.close();
                             entitiesService.saveCompleteReviewEntLink({'data':doc_id,'sess_id':vm.sess_id}).then(function(resp){
                                  if(resp.data.status == "success"){

                                       $.UIkit.notify({
                                               message : resp.data.msg,
                                               status  : 'success',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });

                                       if($scope.loginData.role == "sv"){
                                            $state.go("app.supervisorDocumentsList",{"id":$rootScope.queueId});
                                       }
                                       else{
                                            $state.go("app.agentDocumentsList",{"id":$rootScope.queueId});
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

                  };
              }]
            });
        };

        $scope.goToCaseDashboard = function(){
            if($scope.loginData.role == "sv"){
                $state.go("app.supervisorDocumentsList",{"id":$rootScope.queueId});
            }
            else{
                $state.go("app.agentDocumentsList",{"id":$rootScope.queueId});
            }
        };

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.handleDropdownEvent = function() {
            event.stopPropagation();
            //e.preventDefault();
        };
        $scope.closeAddNewEntityWindow = function(){
            //$('#addEntityDropDown').dropdown('toggle');
            $('#addEntityDropDown').removeClass('open');
        };

        $scope.createNewEntityPopup=function(){
            document.getElementById("addNewEntityWindow").style.width = "94.6%";
        };

        vm.cancelAddNewEntityWindow =function(){
             document.getElementById("addNewEntityWindow").style.width = "0%";
        };



/**********************************************Entity code starts here***********************************************/
    $scope.isDisabledAction = false;
    $scope.domainObjects = [];
    $scope.dOSpinner=false;
    $scope.popupHeight = $window.innerHeight -100;
    $rootScope.currentState = 'domainObjects';
    $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    if($scope.loginData.user==undefined){
                $scope.loginData.user = {}
                $scope.loginData.user.solution_name = "";
                $scope.loginData.user.solution_id = "";
    }
    $scope.solution_id=$scope.loginData.user.solution_id;
    $scope.solution_name=$scope.loginData.user.solution_name;
    $rootScope.$broadcast('ActiveSolution',$scope.solution_name);
    vm.sess_id= $scope.loginData.sess_id;
    vm.popOverStatus = "success";
    //TODO: Add Enum in the list later
    $scope.typeList = {"String":"string","Numeric":"numeric","Currency":"currency","Location":"location","Datetime":"datetime","Entity":"related_entity","Other":"other"};
    $scope.nerTypeList = ["PERSON", "NORP", "FACILITY", "ORG", "GPE", "LOC", "PRODUCT", "EVENT", "WORK_OF_ART", "LANGUAGE","DATE", "TIME", "PERCENT", "MONEY", "QUANTITY", "ORDINAL", "CARDINAL", "EMAIL", "ADDRESS","STREET_ADDRESS", "ZIP_CODE", "PRICE", "PHONE"];
    $scope.schemaEntitiesObj={"type":"import","data": {"type":"","description":"","entity_cfg": []}};

    vm.reloadEntitiesList = function(type,id,cacheFlag,init){
         $scope.dOSpinner=true;
         vm.entityName = "";
         entitiesService.getEntities({'sess_id':vm.sess_id, 'isCache': cacheFlag}).then(function(data){
            $scope.dOSpinner=false;
            $scope.isDisabled = false;
            $scope.domainObjects =  data.data.domain_object;
            $scope.entitiesList =  data.data.entities;
             vm.dup_dom_name = ""
             vm.placeholder = false;
             vm.domainObjectsForRelationship=angular.copy(data.data);
             if(!cacheFlag){
                 $.UIkit.notify({
                         message : vm.popOverMsg,
                         status  : vm.popOverStatus,
                         timeout : 2000,
                         pos     : 'top-center'
                 });
                 vm.popOverStatus = "success";
             }
         });
    };
    vm.reloadEntitiesList("","",true,"initial call");

    $scope.saveEntities = function(message){

      $scope.message = vm.validateDomainObject();
      if ($scope.message != '')
        return;

      if(vm.domainObject.entity_name != '' && vm.domainObject.entity_name){
        $scope.message = "";

        if (vm.domainObject.entity_synonym.length <= 0)
            vm.domainObject.entity_synonym = [];
        else {
            if(typeof vm.domainObject.entity_synonym != "object"){
                var synonyms = vm.domainObject.entity_synonym.split(",");
                vm.domainObject.entity_synonym = synonyms;
            }
        }
        if(vm.domainObject.entity_synonym == ""){
            vm.domainObject.entity_synonym = [];
        }

        if(vm.domainObject.attributes[0].hasOwnProperty('entity_relation')){
            if(vm.domainObject.attributes[0].entity_relation.hasOwnProperty('cardinality'))
                vm.domainObject.attributes[0].entity_relation['name']=vm.domainObject.attributes[0].key_name;
        }

        vm.removeSynonymsAndIsRule(vm.domainObject.attributes);
        delete vm.domainObject["isRule"];
        var entAray={'description': '', 'entity_cfg':[]};
        entAray.entity_cfg.push(vm.domainObject);
        if(vm.dup_ent_name != "")
            entAray.entity_removed = vm.domainObject.entity_name+'.'+vm.dup_ent_name;

        $scope.isDisabled = true;
        vm.dup_ent_name = "";
        $scope.domainAction = 'create';
        vm.onSaveDomainObject(entAray);
      }
    };


    vm.onSaveDomainObject=function(entAray){
        entitiesService.saveEntity({'obj':entAray,'sess_id':vm.sess_id}).then(function(data){
            if(data.data.status=="success"){
             $scope.domainAction = 'create';
             vm.domainObject = null;
             vm.attributeSelected = null;
             vm.reloadEntitiesList("","",false);
            }else   {
              vm.popOverMsg = data.data.msg;
              vm.popOverStatus = 'danger';
              vm.reloadEntitiesList("","",false);
            }
            $scope.popupActions();

        },function(err){
             $scope.isDisabled = false;
             $.UIkit.notify({
                 message : "Internal server error",
                 status  : 'danger',
                 timeout : 3000,
                 pos     : 'top-center'
             });
        });
    };

    vm.importData = {};
    vm.importData.data = [];
    vm.importData.subData = [];
    $scope.csv = {
          content: null,
          header: true,
          separator: ',',
          result: vm.importData
    };

    $scope.reloadJsonDirective = function(){
      vm.users = {};
      vm.users.data = [];
      vm.users.subData = [];
      $scope.csv = {
              content: null,
              header: true,
              separator: ',',
              result: vm.users
      };
      $("#importJsonLink").empty();
      var htmlContent = '<button ng-show="!showChangeBtn"class="btn left button-primary" alt="browse" title="browse" type="button" style="position:relative;display:inline;border-radius:4px 0 0  4px">Browse<ng-csv-import class="import" content="csv.content" header="csv.header" separator="csv.separator" result="csv.result" confirm-action = "parseToJson()"></ng-csv-import></button>';
      var el = $compile( htmlContent )($scope);
      var element = document.getElementById("importJsonLink");
      angular.element(document.getElementById("importJsonLink")).append(el);
    };

    $scope.fileNameBrowsed = "Please select the file";
    $scope.$on('scanner-started', function(event, args) {
      $scope.browsedFile = args;
      $scope.fileNameBrowsed = args.name;
      $scope.errorFileBrowse = "";
      $scope.sendEntitiesDefinition($scope.browsedFile);
    });

    $scope.sendEntitiesDefinition = function(browse){
       $scope.browsedFile = browse;
    };

    function IsJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
    }

    $scope.parseToJson = function(){
       if(IsJsonString($scope.csv.result.subData)){
          var entitesArray  = JSON.parse($scope.csv.result.subData);
          if(entitesArray.entities != undefined && entitesArray.entities.constructor === Array){
              var flag1 = true;
              for(var i=0;i<entitesArray.entities.length;i++){
                 if(entitesArray.entities[i].entity_name == undefined || entitesArray.entities[i].entity_name == '' || entitesArray.entities[i].attributes == undefined ){
                    var flag1 = false;
                    break;
                 }
              }
              if(flag1){
                  $scope.schemaEntitiesObj.data.entity_cfg=entitesArray.entities;
                  $scope.reloadJsonDirective();
              }
              else{
                  $.UIkit.notify({
                     message : "Invalid Schema format",
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                  });
                  $scope.reloadJsonDirective();
              }
          }
          else{
            $.UIkit.notify({
               message : "Invalid Schema file",
               status  : 'danger',
               timeout : 2000,
               pos     : 'top-center'
            });
            $scope.reloadJsonDirective();
          }
       }
       else{
          $.UIkit.notify({
             message : "Please import valid json",
             status  : 'danger',
             timeout : 2000,
             pos     : 'top-center'
          });
          $scope.fileNameBrowsed="";
          $scope.reloadJsonDirective();
       }
    };


    vm.parentNode ={};
    $scope.parentNodeOfdomainObjects =function(node){
        vm.parentNode =node;
    };
    vm.validateDomainObject = function(){
        var dObj = vm.domainObject;
        var msg = '';
        $('#domainObjectsNodes li').find("div.activeClass").next("ol").removeClass('hidden');
        $('#domainObjectsNodes li').find("div.activeClass").parent().attr("collapsed","false");
        var stringOfObject=angular.copy(vm.parentNode);
        stringOfObject=JSON.stringify(stringOfObject);

        if(vm.isEmptyCheck(dObj.entity_name)){
            msg = 'Domain Object/Entity name cannot be empty';
            $scope.selectDomainObjectNodes();
            return msg;
        }
        else if(vm.checkForSpecialCharacters(dObj.entity_name)){
            msg = 'Domain Object name must contain only alphabets,digits and underscores';
            return msg;
        }
        else if(stringOfObject.includes('"entity_name":""')){
            msg = 'Domain Object/Entity name cannot be empty';
            $scope.selectDomainObjectNodes();
            return msg;
        }
        else if(stringOfObject.includes('"key_name":""')){
           msg = 'Attribute name cannot be empty';
           $scope.selectDomainObjectNodes();
           return msg;
        }


        if(dObj.entity_synonym!='' && vm.checkForSpecialCharacters(dObj.entity_synonym,'synonyms')){
            msg = 'Domain Object synonyms must contain only alphabets,digits and underscores';
            return msg;
        }
        var flag = false;
        angular.forEach(dObj.attributes, function(attr){
            if(attr.key_name != undefined){
                if(vm.isEmptyCheck(attr.key_name)){
                    msg = 'Attribute names cannot be empty';
                    flag = true;
                }
                else if(vm.checkForSpecialCharacters(attr.key_name)){
                    msg = 'Attribute name must contain only alphabets,digits and underscores';
                    flag = true;
                }
                if (attr.synonym)
                    attr.synonym = attr.synonym.toString();
                else
                    attr.synonym = '';
                if(attr.synonym!='' && vm.checkForSpecialCharacters(attr.synonym,'synonyms')){
                    msg = 'Attribute synonyms must contain only alphabets,digits and underscores';
                    flag = true;
                }
                if(attr.type=='related_entity'){
                   if(attr.key_name==undefined || attr.key_name==''){
                     msg = 'Entity cannot be empty';
                     flag = true;
                   }
                }
            }
        });

        var valueArr23 = dObj.attributes.filter(function(item){ return item.key_name });
        var valueArr = valueArr23.map(function(item){ return item.key_name });
        var isDuplicate = valueArr.some(function(item, idx){
            return valueArr.indexOf(item) != idx
        });

        if(isDuplicate){
            msg = 'Duplicate key name';
            flag = true;
        }

        if (flag){
            return msg;
        }
        return '';
    };

    $scope.selectDomainObjectNodes =function(){
        $('#domainObjectsNodes li').find("label:contains('< New Attribute >')").closest('div').css('border', '1px solid red');
        $('#domainObjectsNodes li').find("label:contains('< New Entity >')").closest('div').css('border', '1px solid red');
        $('#domainObjectsNodes li').find("label:contains('< New Domain Object >')").closest('div').css('border', '1px solid red');
    };

    $scope.checkAttributeIsEmpty = function(attributeObj, e){
        var id = attributeObj.$$hashKey;
        id= id.replace(':', '');
        if(attributeObj.key_name!=""){
          $("#"+id).find("div").first().css('border', '1px solid #dae2ea');
        }
        else{
            $("#"+id).find("div").first().css('border', '1px solid red');
        }
    };
    $scope.checkEntityIsEmpty = function(domainObject, $event){
        var id = domainObject.$$hashKey;
        id= id.replace(':', '');
        if(domainObject.entity_name!=""){
          $("#"+id).find("div").first().css('border', '1px solid #dae2ea');
        }
        else{
            $("#"+id).find("div").first().css('border', '1px solid red');
        }
    };

    vm.isEmptyCheck = function(value){
        var isEmpty=false;
        if(!value || value.trim()=='')
          isEmpty=true;
        return isEmpty;
    };

    vm.checkForSpecialCharacters = function(value,input_type){
        var letters = /^[0-9a-zA-Z_]+$/;
        if(input_type=="synonyms")
            letters = /^[0-9a-zA-Z_, ]+$/;

        if(typeof value != "object"){
            if(!value.match(letters))
                return true;
            else
                return false;
        }
    };

    $scope.showFileUploadform=true;
    $scope.selectedFileType=function(fileType){
        if(fileType==".json"){
            $scope.showFileUploadform=true;
        }
        else{
         $scope.showFileUploadform=false;
        }
    };
    $scope.fileType = ".json";
    $scope.saveEntitiesSchema = function(){
         if($scope.fileType==".json"){
             $scope.schemaEntitiesObj.data.type = $scope.fileType;
             $scope.schemaEntitiesObj.data.description = $scope.importDescription;
             if($scope.schemaEntitiesObj.data.entity_cfg != undefined){
                 if($scope.schemaEntitiesObj.data.entity_cfg.length != 0){
                     $scope.isEntitySubmitAction = true;
                      var entAray={'description': '', 'entity_cfg':[]};
                      entAray.description=$scope.importDescription;
                      entAray.saveType = "import";
                      entAray.entity_cfg=$scope.schemaEntitiesObj.data.entity_cfg;
                      $scope.isDisabled = true;
                      entitiesService.saveEntity({'obj':entAray,'sess_id':vm.sess_id}).then(function(data){
                         $scope.importDescription="";
                         if(data.data.status=="failure"){
                             $scope.isDisabled = false;
                             $.UIkit.notify({
                                 message : data.data.msg,
                                 status  : 'danger',
                                 timeout : 3000,
                                 pos     : 'top-center'
                             });
                             $scope.schemaEntitiesObj={"type":"import","data": {"type":"","description":"","entity_cfg": []}};
                             $scope.fileNameBrowsed = "Please select the file";
                         }
                         else{
                             $scope.isDisabled = false;
                             vm.jobId = data.data.data.job_id;
                             vm.getJobStatus(vm.jobId);
                             $scope.timerForJob = setInterval(function(){ vm.getJobStatus(vm.jobId); }, 30000);
                             $scope.schemaEntitiesObj={"type":"import","data": {"type":"","description":"","entity_cfg": []}};
                             $scope.fileNameBrowsed = "Please select the file";
                         }
                         $scope.isEntitySubmitAction = false;
                         $timeout(function(){ $scope.cancelUpload();}, 2000);
                     },function(err){
                         $scope.isDisabled = false;
                         $.UIkit.notify({
                             message : "Internal server error",
                             status  : 'danger',
                             timeout : 3000,
                             pos     : 'top-center'
                         });
                     });
                 }
                 else{
                    $scope.errorFileBrowse = "Please browse the file";
                 }
             }
             else{
                 $scope.errorFileBrowse = "Please browse the file";
             }
         }
         else if($scope.fileType==".xml"){

         }
    };

    vm.loadEntities = function(){
        var cacheFlag = false;
        entitiesService.getEntities({'sess_id':vm.sess_id, 'isCache': cacheFlag}).then(function(data){
            $scope.domainObjects =  data.data.domain_object;
            $scope.entitiesList =  data.data.entities;
             vm.dup_dom_name = "";
             vm.domainObjectsForRelationship=angular.copy(data.data);
         });
    };

    vm.getJobStatus = function(jobid){
        entitiesService.getJobStatus({'data':jobid,'sess_id':vm.sess_id}).then(function(data){
            if(data.data.status=="success"){
                vm.showJobStatusLink = true;
                vm.showStatusFailure = false;
                vm.showStatusInProgress = false;
                vm.showStatusSuccess = true;
                vm.popOverMsg = data.data.msg;
                vm.loadEntities("","",false);
                clearInterval($scope.timerForJob);
            }
            else if(data.data.status=="in-progress"){
                vm.currentTimeStamp = new Date();
                vm.popOverMsg = data.data.msg;
                vm.loadEntities("","",false);
                vm.showStatusSuccess = false;
                vm.showStatusFailure = false;
                vm.showStatusInProgress = true;
                vm.showJobStatusLink = true;
            }
            else if(data.data.status=="failure"){
                vm.currentTimeStamp = new Date();
                vm.failedEntities = data.data.data.failed_entities;
                vm.showJobStatusLink = true;
                vm.showStatusInProgress = false;
                vm.showStatusSuccess = false;
                vm.showStatusFailure = true;
                clearInterval($scope.timerForJob);
            }
        },function(err){
            vm.showJobStatusLink = false;
            $.UIkit.notify({
                 message : 'Internal Server Error',
                 status  : 'danger',
                 timeout : 2000,
                 pos     : 'top-center'
            });
        });
    }

    $scope.$on("$destroy",function(){
        if (angular.isDefined($scope.timerForJob)) {
            clearInterval($scope.timerForJob);
        }
    });

    $scope.cancelProgressStatus = function(){
        vm.showJobStatusLink = false;
        vm.showStatusFailure = false;
        vm.showStatusInProgress = false;
        vm.showStatusSuccess = false;
    };

    $scope.browseFileError1=false;
    $scope.sendXml = function(){
        if($scope.fileType!=undefined){
          var file = $scope.browseXmlFile;
          if($scope.browseXmlFile == undefined || $scope.browseXmlFile == null|| $scope.browseXmlFile == ""){
             $scope.browseFileError1 = false;
              $.UIkit.notify({
                 message : "Please select the xml file.",
                 status  : 'warning',
                 timeout : 2000,
                 pos     : 'top-center'
             });
          }
          else {
            var re = /(?:\.([^.]+))?$/;
            var selectedFileType=file.name;
            var ext = "."+re.exec(file.name)[1];
            if(ext==".xml"){
                $scope.showLoaderIcon = true;
                $scope.browseFileError1=true;
                $scope.isDisable = true;
                var dataObj = {"saveType": "import"};
                 file.upload = Upload.upload({
                      url: 'api/solnConfig/',
                      method: 'POST',
                      headers: {"sess_token": $scope.loginData.sess_id},
                      data:dataObj,
                      file: file
                 });
                 file.upload.then(function (response) {
                      $scope.isDisable = false;
                      $scope.showLoaderIcon = false;
                      $scope.browseFileError1 = false;
                      $scope.browseXmlName = '';
                      $scope.xmlFile ='';
                      $scope.browseXmlFile="";
                     if(response.data.status=="success"){
                         vm.jobId = response.data.data.job_id;
                         vm.getJobStatus(vm.jobId);
                         $scope.timerForJob = setInterval(function(){ vm.getJobStatus(vm.jobId); }, 30000);
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
                     $timeout(function(){ $scope.cancelUpload();}, 2000);

                 }, function (response) {
                      $scope.isDisable = false;
                      $scope.showLoaderIcon = false;
                      $scope.browseFileError1 = false;
                      $scope.browseXmlName = '';
                      $scope.xmlFile ='';
                      $scope.browseXmlFile="";
                       $.UIkit.notify({
                         message : 'Error in file upload',
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                       });
                 });
            }
            else{
              $.UIkit.notify({
                 message : "Please upload .xml extension files only",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
               });
            }
          }
        }
        else{
          $.UIkit.notify({
             message : "Please select the file type.",
             status  : 'warning',
             timeout : 2000,
             pos     : 'top-center'
          });
        }
    };

    $scope.uploadXml = function(file){
        if($scope.fileType!=undefined){
            if(file!=null){
              $scope.browseXmlName = file.name;
              $scope.browseXmlFile = file;
              $scope.browseFileError1 = true;
              //$scope.showChangeBtn=true;
            }
        }
        else{
          $.UIkit.notify({
             message : "Please select the xml type.",
             status  : 'warning',
             timeout : 2000,
             pos     : 'top-center'
          });
        }
    };

    // test code

    $scope.executeData = '';

    function IsJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
    }

    $scope.testInput = function(input){
         if(IsJsonString(input)){
            var convertToJson  = JSON.parse(input);
            var testObj = {"test_rule_execution": []};
            testObj.test_rule_execution = convertToJson;
            entitiesService.testRuleExecution({'obj':testObj,'sess_id':vm.sess_id}).then(function(response){
               if(response.data.status=="success"){
                   $scope.executeData = response.data.data;
                   $scope.testSuccessMsg = response.data.msg;
                   vm.constructExecute($scope.executeData);
               }
               else{
                   if(response.data.message == undefined){
                       $.UIkit.notify({
                         message : 'test_rule_execution not defined properly',
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                       });
                   }
                   else{
                       $scope.testSuccessMsg = "";
                       $.UIkit.notify({
                         message : response.data.message,
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                       });
                   }
               }
            },function (response) {
                   $scope.executeData = "";
                   $scope.testSuccessMsg = "";
                   $.UIkit.notify({
                     message : 'Internal server error',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                   });
            });
         }
         else{
            $scope.executeData = "";
            $scope.testSuccessMsg = "";
            $scope.testErrorMessage = "";
            $.UIkit.notify({
                 message : "Invalid Json",
                 status  : 'danger',
                 timeout : 2000,
                 pos     : 'top-center'
            });
         }
    };

    vm.constructExecute = function(obj){
        var dummyObj = [];
        $scope.executeRulesOutput = [];
        angular.forEach(obj,function(value,key){
            $scope.executeRulesOutput.push({"domain_object":"","attributes":[],"enrichIntent":{},"enrichEntities":[]});
            var obj1 = [];
            var index = 0;
            angular.forEach(value,function(value1,key1){
                if(key1 != "rules_apply"){
                    if(key1 != "enrichments"){
                        obj1.push({"domain_object":'',"attribute":"","value":"","rules":[]});
                        var split = key1.split(".");
                        obj1[index].domain_object = split[0];
                        obj1[index].attribute = split[1];
                        obj1[index].value = value1;
                        index++;
                    }
                    else{
                        if(Object.keys(value1).length==0){
                           $scope.bkColorDomain = "withOutEnrichment";
                        }
                        else{
                           if(value1["Extract Intent"] != undefined){
                               if(Object.keys(value1["Extract Intent"]).length!=0){
                                  $scope.executeRulesOutput[key].enrichIntent = value1["Extract Intent"];
                                  $scope.bkColorDomain = "withEnrichment";
                               }
                           }
                           if(value1["Extract Entities"] != undefined){
                               if(Object.keys(value1["Extract Entities"]).length!=0){
                                  $scope.executeRulesOutput[key].enrichEntities = value1["Extract Entities"];
                                  $scope.bkColorDomain = "withEnrichment";
                               }
                           }
                        }
                    }
                }
            });
            angular.forEach(obj1,function(value2,key2){
                var rulesArray = [];
                for(var i=0;i<value.rules_apply.length;i++){
                    if(value2.attribute==value.rules_apply[i].key_name){
                        rulesArray.push(value.rules_apply[i]);
                    }
                }
                obj1[key2].rules = rulesArray;
            });
            $scope.executeRulesOutput[key].domain_object = obj1[0].domain_object;
            $scope.executeRulesOutput[key].attributes = obj1;
            $scope.executeRulesOutput[key].EStatus = $scope.bkColorDomain;
        });
    };

    vm.checkObjectLength = function(obj){
       if(Object.keys(obj).length>0)
          return true;
       else
          return false;
    };

    vm.getEnrichments = function(cache){
        $scope.loadingEnrichments = true;
        entitiesService.getEnrichments({"sess_id":vm.sess_id,"isCache": cache}).then(function(response){
            $scope.loadingEnrichments = false;
            vm.enrichmentsList = response.data;
        },function(err){
            $scope.loadingEnrichments = false;
        });
    };

    vm.selectedEnrichments = [];
    vm.selectedAttributes = [];

    vm.validateEnrichmentFunct = function(){
       if(vm.selectedAttributes.length==0)
          return "Atleast one attribute should be enabled";
       else if(vm.selectedEnrichments.length==0)
          return "Atleast one enrichment should be enabled";
       else
          return "";
    };

    vm.toggleEnrichment = function(enrichment){
       var idx = vm.selectedEnrichments.indexOf(enrichment);

       if(idx > -1)
          vm.selectedEnrichments.splice(idx,1);
       else
          vm.selectedEnrichments.push(enrichment);

       vm.mapEncToAttr('','enrichment');
    };

    vm.toggleAttribute = function(attribute){
       var idx = vm.selectedAttributes.indexOf(attribute);

       if(idx > -1)
          vm.selectedAttributes.splice(idx,1);
       else
          vm.selectedAttributes.push(attribute);

       vm.mapEncToAttr(attribute,'attribute',idx);
    };

    vm.mapEncToAttr = function(attr,keyValue,idx){
       if(keyValue=='attribute'){
           var index = vm.domainObject.attributes.map(function(e){ return e.key_name;}).indexOf(attr);
           vm.domainObject.attributes[index].enrichments = [];
           if(idx > -1)
              vm.domainObject.attributes[index].enrichments = [];
           else
              vm.domainObject.attributes[index].enrichments = vm.selectedEnrichments;
       }
       else if(keyValue=='enrichment'){
           angular.forEach(vm.selectedAttributes,function(value,key){
               var sindx = vm.domainObject.attributes.map(function(e){ return e.key_name;}).indexOf(value);
               vm.domainObject.attributes[sindx].enrichments = [];
               vm.domainObject.attributes[sindx].enrichments = vm.selectedEnrichments;
           });
       }
    };

    vm.enableAllAttributes = function(){
       vm.selectedAttributes = angular.copy(vm.attributesList);
       angular.forEach(vm.selectedAttributes,function(value,key){
           var sindx = vm.domainObject.attributes.map(function(e){ return e.key_name;}).indexOf(value);
           vm.domainObject.attributes[sindx].enrichments = [];
           vm.domainObject.attributes[sindx].enrichments = vm.selectedEnrichments;
       });
    };

    vm.enableAllEnrichments = function(){
       vm.selectedEnrichments = angular.copy(vm.enrichmentsList);
       angular.forEach(vm.selectedAttributes,function(value,key){
           var sindx = vm.domainObject.attributes.map(function(e){ return e.key_name;}).indexOf(value);
           vm.domainObject.attributes[sindx].enrichments = [];
           vm.domainObject.attributes[sindx].enrichments = vm.selectedEnrichments;
       });
    };

    vm.saveEnrichment = function(){
       vm.validateEnrichment = vm.validateEnrichmentFunct();
       if(vm.validateEnrichment == ""){
          vm.validateEnrichment = '';
          $scope.saveEntities();
       }
    };

    vm.mapAttributesAndEnrich = function(){
       vm.selectedAttributes = [];
       vm.selectedEnrichments = [];
       var obj = vm.domainObject.attributes.map(function(e){return e;});
       for(var i=0;i<vm.domainObject.attributes.length;i++){
          if(vm.domainObject.attributes[i].enrichments != null ){
             if(vm.domainObject.attributes[i].enrichments.length!=0){
                 vm.selectedEnrichments = angular.copy(vm.domainObject.attributes[i].enrichments);
                 vm.selectedAttributes.push(vm.domainObject.attributes[i].key_name);
             }
          }
       }
    };

    $scope.uploadDomainObj = function(attribute){
        $scope.labelForUpload="Upload Domain Objects";
        document.getElementById("overlayDivForUpload").style.width = "58%";
        document.getElementById("overlayDivForDownload").style.width = "0%";
    };
    $scope.cancelUpload = function(){
        document.getElementById("overlayDivForUpload").style.width = "0%";
    };

    $scope.downloadDomainObj = function(attribute){
        $scope.labelForDownload="Download Domain Objects";
        vm.messageForDownload="";
        document.getElementById("overlayDivForDownload").style.width = "58%";
        document.getElementById("overlayDivForUpload").style.width = "0%";
    };
    $scope.cancelDownload = function(){
        document.getElementById("overlayDivForDownload").style.width = "0%";
        vm.messageForDownload="";
    };
    vm.fileTypeForDownload='json';
    vm.messageForDownload="";
    $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
    vm.downlodDomainObject =function(){
      vm.messageForDownload="";
      var downloadUrl = $scope.url+'/api/solnConfig/download/'+vm.fileTypeForDownload;
      window.location.assign(downloadUrl);
    };

   // entity hierarchy code

      $scope.collapseKey = true;

      vm.addDomainObj = function(){
          vm.domainObject = vm.getNewDomainObject();
      };

//      vm.getEnrichments(true);
      $scope.isDisabled = true;
      $scope.cls = [];
      vm.viewAndEditDomainObject = function(domainObject,node){
            vm.entityName = '';
            var tempDomain = domainObject.$modelValue;
            $scope.cls = [];
            vm.placeholder = true;
            $scope.cls[domainObject.$id] = "activeClass";
            $('.nav-custom-tabs a[href=".properties"]').tab('show');
            vm.placeholder = true;
            vm.dup_dom_name = "";
            if(tempDomain.type == "related_entity" || tempDomain.entity_type == "entity" || tempDomain.entity_type == "domain_object"){
                vm.attributeShow = false;
                vm.newEntity = true;
                vm.popOverMsg = "Entity has been updated successfully";
                if(tempDomain.entity_name != ""){
                    if(tempDomain.entity_type == "domain_object"){
                        $scope.domainAction = "update";
                        vm.dup_dom_name = tempDomain.entity_name;
                        vm.popOverMsg = "Domain object has been updated successfully";
                    }
                    if(tempDomain.entity_type == "entity"){
                        vm.dup_ent_name = tempDomain.entity_name;
                    }
                    vm.newEntity = false;
                }
                $scope.message="";
                for (var i =0; i < tempDomain.attributes.length; i++){
                    if(tempDomain.attributes[i].entity_type != 'entity' || tempDomain.attributes[i].entity_type != 'domain_object'){

                    }
                    else{
                        $scope.entityRelation = {
                              "key_name": "",
                              "synonym": [],
                              "type": "entity",
                              "entity_type": "entity",
                              "rule_id": [],
                              "entity_relation": {
                                  "name": "",
                                  "cardinality": "1"
                              }
                        }
                        $scope.entityRelation.key_name = tempDomain.attributes[i].entity_name;
                        $scope.entityRelation.synonym = tempDomain.attributes[i].entity_synonym;
                        $scope.entityRelation.entity_relation.name = tempDomain.attributes[i].entity_name;
                        tempDomain.attributes[i] = angular.copy({});
                        tempDomain.attributes[i] = angular.copy($scope.entityRelation);
                    }
                }
                if (tempDomain.entity_synonym)
                    tempDomain.entity_synonym = tempDomain.entity_synonym.toString();
                else
                    tempDomain.entity_synonym = '';

                vm.domainObject = tempDomain;
                if(domainObject.$parentNodeScope == null)
                    vm.parentDomain = "none";
                else
                    vm.parentDomain = domainObject.$parentNodeScope.$modelValue;
                vm.mapAttributesAndEnrich();
                vm.attributesList = vm.domainObject.attributes.map(function(e) { return e.key_name; });
                setTimeout(function(){ $("#focusInput").focus(); }, 1000);
            }
            else{
                vm.attributeShow = true;
                vm.dup_dom_name = "";
                vm.dup_ent_name = "";
                vm.domainObject = domainObject.$parentNodeScope.$modelValue;
                vm.parentDomain = domainObject.$parentNodeScope.$modelValue;
                vm.attributeSelected = domainObject.$modelValue;

                if(vm.attributeSelected.type=='entity')
                    vm.attributeSelected.type='related_entity';

                vm.clearAllRules(vm.attributeSelected);
                vm.popOverMsg = "Attribute has been updated successfully";
                vm.attrSelectedIndex = vm.domainObject.attributes.map(function(e){return e.key_name}).indexOf(domainObject.$modelValue.key_name);
                setTimeout(function(){ $("#attrFocus").focus(); }, 1000);

            }
      };

      vm.autoSelectOnNewAttr = function(domainObject,node){
            var tempDomain = domainObject;
            vm.attributeShow = true;
            if(tempDomain.entity_synonym)
                tempDomain.entity_synonym = tempDomain.entity_synonym.toString();
            else
                tempDomain.entity_synonym = '';
            vm.domainObject = tempDomain;
            vm.dup_dom_name = "";
            vm.dup_ent_name = "";
            vm.attributeSelected = node;
            vm.clearAllRules(vm.attributeSelected);
            vm.attrSelectedIndex = vm.domainObject.attributes.map(function(e){return e.key_name}).indexOf(node.key_name);
      };

      vm.autoSelectOnNewDO = function(parent,domainObject){
            var tempDomain = domainObject;
            vm.attributeShow = false;
            vm.dup_dom_name = "";
            vm.dup_ent_name = "";
            vm.domainObject = tempDomain;
            vm.parentDomain = parent;
      }

      vm.getNewDomainObject = function(){
          var domainObject = {};
          domainObject['entity_name'] = '';
          domainObject['entity_synonym'] = [];
          domainObject['entity_type'] = 'entity';
          domainObject['attributes'] = [];
          domainObject['ner_type'] = "";
          return domainObject;
      };

      vm.addDomainObject = function(){
        vm.parentNode = {};
        document.getElementById("overlayDivForUpload").style.width = "0%";
        document.getElementById("overlayDivForDownload").style.width = "0%";
        var obj = {};
        vm.placeholder = true;
        vm.attributeShow = false;
        vm.newEntity = true;
        obj['entity_name'] = '';
        obj['entity_synonym'] = [];
        obj['entity_type'] = 'domain_object';
        obj['attributes'] = [];
        obj['ner_type'] = "";
        vm.popOverMsg = "Domain object has been created successfully";
        $scope.domainObjects.unshift(obj);
        vm.autoSelectOnNewDO("none",obj);
        setTimeout(function(){ $("#focusInput").focus(); }, 1000);
      };

      vm.changeEntity = function(value){
        delete vm.attributeSelected['is_new'];
        vm.attributeSelected.key_name = angular.copy(value);
        if(value=='create'){
            vm.attributeSelected.is_new = true;
            vm.attributeSelected.key_name = '';
        }
      };
      vm.changeDataType = function(value){
        delete vm.attributeSelected['is_new'];
        if(value!='entity')
          vm.entityName = '';

        if(value=='related_entity'){
            if(vm.attributeSelected['entity_relation']==undefined){
                vm.attributeSelected['entity_relation']={};
            }
            vm.attributeSelected['entity_relation'].cardinality='1';
        }
        else{
            delete vm.attributeSelected['entity_relation'];
        }
      };

      vm.callSaveEntity = function(){
          $scope.saveEntities();
      };

      vm.callDeleteEntity = function(entName){
          $scope.isDisabled = true;
          entitiesService.deleteEntity({'obj':entName,'sess_id':vm.sess_id}).then(function(data){
              if(data.data.status=='success'){
                 $scope.domainAction = 'create';
                 vm.reloadEntitiesList("","",false);
              }
              else{
                 $scope.isDisabled = false;
                 $.UIkit.notify({
                     message : data.data.msg,
                     status  : 'danger',
                     timeout : 3000,
                     pos     : 'top-center'
                 });
              }
          },function(err){
                 $scope.isDisabled = false;
                 $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'warning',
                     timeout : 3000,
                     pos     : 'top-center'
                 });
          });
      };

      $scope.removeAttr = function (scope,type,$event) {
          $event.stopPropagation();
          var nodeData = scope.$modelValue;
          ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  if(type=="entity"){
                      $scope.activePopupText = 'Are you sure you want to delete ' +"' " +nodeData.entity_name+ " '" +' ' + 'entity ?';
                  }
                  else if(type=="domain_object"){
                      $scope.activePopupText = 'Are you sure you want to delete ' +"' " +nodeData.entity_name+ " '" +' ' + 'domain object ?';
                  }
                  else{
                      $scope.activePopupText = 'Are you sure you want to delete ' +"' " +nodeData.key_name+ " '" +' ' + 'attribute ?';
                  }
                  $scope.onConfirmActivation = function (){
                      ngDialog.close();
                      if(type == "entity"){
                          if(scope.$parentNodeScope != null){
                              vm.dup_ent_name = nodeData.entity_name;
                              vm.domainObject = scope.$parentNodeScope.$modelValue;
                              for(var i=0;i<vm.domainObject.attributes.length;i++){
                                 if(nodeData.entity_name == vm.domainObject.attributes[i].entity_name){
                                    var indexVal = i;
                                    break;
                                 }
                              }
                              vm.domainObject.attributes.splice(indexVal,1);
                              vm.popOverMsg = "Entity "+nodeData.entity_name+" deleted successfully";
                              vm.callSaveEntity();
                          }
                      }
                      else if(type == "domain_object"){
                          vm.popOverMsg = "Domain object "+nodeData.entity_name+" deleted successfully";
                          vm.callDeleteEntity(nodeData.entity_name);
                      }
                      else{
                          vm.domainObject = scope.$parentNodeScope.$modelValue;
                          for(var i=0;i<vm.domainObject.attributes.length;i++){
                             if(nodeData.key_name == vm.domainObject.attributes[i].key_name){
                                var indexVal = i;
                                break;
                             }
                          }
                          if (vm.domainObject.entity_synonym)
                              vm.domainObject.entity_synonym = vm.domainObject.entity_synonym.toString();
                          else
                              vm.domainObject.entity_synonym = '';
                          vm.popOverMsg = "Attribute "+nodeData.key_name+" deleted successfully";
                          vm.domainObject.attributes.splice(indexVal,1);
                          vm.callSaveEntity();
                      }
                  };
              }]
          });
      };

      $scope.toggle = function (scope) {
        scope.toggle();
      };

      $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
      };
      vm.getParentIdFromEventObj=function(event){
        var currentTarget =event.currentTarget;
        var result = currentTarget;
        var idArrays=[];
        while(result.parentNode){
            if(result.id!=null){
                if(idArrays[0]!="domainObjectsNodes")
                    idArrays.unshift(result.id)
            }
            result=result.parentNode;
        }
            return idArrays[1];
      };


      $scope.newSubItem = function (scope,type,$event) {
        $scope.typeList = {"String":"string","Numeric":"numeric","Currency":"currency","Location":"location","Datetime":"datetime","Entity":"related_entity","Other":"other"};
        vm.entityName = '';
        $event.stopPropagation();
        var id = vm.getParentIdFromEventObj($event);
        console.log("result",id);
        clickOnParentNode(id);
        scope.expand();
        vm.placeholder = true;
        vm.dup_dom_name = "";
        vm.dup_ent_name = "";
        var nodeData = scope.$modelValue;
        vm.placeholder = true;
        if(type=="entity"){
            nodeData.attributes.unshift({
                "entity_name": "",
                "entity_synonym": [],
                "entity_type": "entity",
                "type": "entity",
                "primary_key": [],
                "attributes": []
            });
            vm.attributeShow = false;
            vm.newEntity = true;
            vm.popOverMsg = "Entity has been created successfully";
            vm.autoSelectOnNewDO(nodeData,nodeData.attributes[0]);
        }
        else{
            if(nodeData.entity_type == 'domain_object'){
               $scope.typeList = {"Entity":"related_entity"};
               nodeData.attributes.unshift({
                "key_name": "",
                "type": "related_entity",
                "ner_type": "",
                "rule_id": [],
                "synonym":[]
               });
            }
            else{
               nodeData.attributes.unshift({
                "key_name": "",
                "type": "string",
                "ner_type": "",
                "rule_id": [],
                "synonym":[]
               });
            }
            vm.attributeShow = true;
            vm.popOverMsg = "Attribute has been created successfully";
            vm.autoSelectOnNewAttr(nodeData,nodeData.attributes[0]);
        }
        setTimeout(function(){ $("#attrFocus").focus(); }, 1000);

      };
      function clickOnParentNode(id) {
          $timeout(function() {
             angular.element('#'+id).triggerHandler('click');
          }, 500);
      };

      vm.newAttribute = function(data,type){
          var nodeData = data;
          vm.placeholder = true;
          nodeData.attributes.unshift({
                "key_name": "",
                "type": "string",
                "ner_type": "",
                "rule_id": [],
                "synonym":[]
          });
          vm.attributeShow = true;
          vm.autoSelectOnNewAttr(nodeData,nodeData.attributes[0]);
      };

      $scope.selectedItem = function(scope){
        $scope.info = scope.$modelValue;

      };

      $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
      };

      $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
      };

      vm.removeSynonymsAndIsRule = function(list){
           for (var k=0; k < list.length; k++){
                if(list[k].entity_type != "entity"){
                    if (list[k].synonym.length <= 0)
                        list[k].synonym = [];
                    else {
                        if(typeof list[k].synonym != "object"){
                            var synonyms = list[k].synonym.split(",");
                            list[k].synonym = synonyms;
                        }
                    }

                    var attr = list[k];
                    delete list[k]["entity_synonym"];
                    delete attr.isRule;
                }
                else{
                    if (list[k].entity_synonym.length <= 0)
                        list[k].entity_synonym = [];
                    else {
                        if(typeof list[k].entity_synonym != "object"){
                            var synonyms = list[k].entity_synonym.split(",");
                            list[k].entity_synonym = synonyms;
                        }
                    }
                    if(list[k].entity_synonym == ""){
                        list[k].entity_synonym = [];
                    }
                    delete list[k]["synonym"];
                    delete list[k]["isRule"];
                    vm.removeSynonymsAndIsRule(list[k].attributes);
                }
            }
      };

      $scope.saveHierarchy = function(){
          $scope.message = vm.validateDomainObject();
          if ($scope.message != '')
            return;

          if(vm.domainObject.entity_name != '' && vm.domainObject.entity_name){
            $scope.message = "";

            if (vm.domainObject.entity_synonym.length <= 0)
                vm.domainObject.entity_synonym = [];
            else {
                if(typeof vm.domainObject.entity_synonym != "object"){
                    var synonyms = vm.domainObject.entity_synonym.split(",");
                    vm.domainObject.entity_synonym = synonyms;
                }
            }
            if(vm.domainObject.entity_synonym == ""){
                vm.domainObject.entity_synonym = [];
            }

            vm.removeSynonymsAndIsRule(vm.domainObject.attributes);
            delete vm.domainObject["isRule"];
            if(vm.domainObject.entity_relation != undefined)
                vm.domainObject.entity_relation.name = vm.domainObject.entity_name;

            var entAray={'description': '', 'entity_cfg':[]};
            entAray.entity_cfg.push(vm.domainObject);

            $scope.domainAction = 'create';
            $scope.inHierarchy();
          }
      };

      vm.onDelDomain = function(){
          if(vm.domainObject.entity_type =="domain_object" && vm.domainObject.entity_name != "" ){
                if(vm.dup_dom_name != ""){
                    if(vm.dup_dom_name != vm.domainObject.entity_name){
                        return vm.dup_dom_name;
                    }
                    else{
                        return "";
                    }
                }
                else{
                    return "";
                }
          }
          else{
                return "";
          }
      };

      vm.onDelEntity = function(){
          if(vm.domainObject.entity_type =="entity" && vm.domainObject.entity_name != "" ){
                if(vm.dup_ent_name != ""){
                    if(vm.dup_ent_name != vm.domainObject.entity_name){
                        return vm.dup_ent_name;
                    }
                    else{
                        return "";
                    }
                }
                else{
                    return "";
                }
          }
          else{
                return "";
          }
      };

      vm.onSaveAndDelete = function(entAray){
            var duplicateName = vm.onDelDomain();
            if(duplicateName != "")
                entAray.old_domain_name = duplicateName;
            entitiesService.saveEntity({'obj':entAray,'sess_id':vm.sess_id}).then(function(data){
                if(data.data.status=="success"){
                   vm.popOverMsg = "Domain object saved successfully";
                   $scope.domainAction = 'create';
                   vm.dup_dom_name = "";
                   vm.domainObject = null;
                   vm.attributeSelected = null;
                   vm.reloadEntitiesList("","",false);
                }else   {
                  $scope.isDisabled = false;
                  vm.popOverMsg = data.data.msg;
                  vm.dup_dom_name = "";
                  vm.reloadEntitiesList("","",false);
                }
            },function(err){
                 $scope.isDisabled = false;
                 vm.dup_dom_name = "";
                 vm.reloadEntitiesList("","",false);
                 $.UIkit.notify({
                     message : "Internal server error",
                     status  : 'danger',
                     timeout : 3000,
                     pos     : 'top-center'
                 });
            });
      };

      $scope.inHierarchy = function(){
         if(vm.parentDomain=="none"){
            var valueArrDO123 = $scope.domainObjects.filter(function(item){ return item.entity_name });
            var valueArrDO = valueArrDO123.map(function(item){ return item.entity_name });
            var isDuplicateDO = valueArrDO.some(function(item, idx){
                return valueArrDO.indexOf(item) != idx
            });
            if(isDuplicateDO){
                $scope.message = 'Duplicate domain object name';
            }
            else{
                $scope.isDisabled = true;
                var entAray={'description': '', 'entity_cfg':[]};
                entAray.entity_cfg.push(vm.domainObject);
                vm.onSaveAndDelete(entAray);
            }
         }
         else{
            var valueArr23 = vm.parentDomain.attributes.filter(function(item){ return item.entity_name });
            var valueArr = valueArr23.map(function(item){ return item.entity_name });
            var isDuplicate = valueArr.some(function(item, idx){
                return valueArr.indexOf(item) != idx
            });
            if(isDuplicate){
                $scope.message = 'Duplicate entity name';
            }
            else{
                for(var i=0;i<vm.parentDomain.attributes.length;i++){
                    if(vm.parentDomain.attributes[i].entity_name == vm.domainObject.entity_name){
                       var indexVal = i;
                       vm.parentDomain.attributes[i] = angular.copy(vm.domainObject);
                    }
                }
                var entAray={'description': '', 'entity_cfg':[]};
                var duplicateEntityName = vm.onDelEntity();
                if(duplicateEntityName != "")
                    entAray.entity_removed = vm.parentDomain.entity_name+'.'+vm.dup_ent_name;
                vm.domainObject = angular.copy(vm.parentDomain);
                if (vm.domainObject.entity_synonym.length <= 0)
                    vm.domainObject.entity_synonym = [];
                else {
                    if(typeof vm.domainObject.entity_synonym != "object"){
                        var synonyms = vm.domainObject.entity_synonym.split(",");
                        vm.domainObject.entity_synonym = synonyms;
                    }
                }
                if(vm.domainObject.entity_synonym == ""){
                    vm.domainObject.entity_synonym = [];
                }
                vm.removeSynonymsAndIsRule(vm.domainObject.attributes);
                delete vm.domainObject["isRule"];
                $scope.isDisabled = true;

                entAray.entity_cfg.push(vm.domainObject);
                vm.onSaveDomainObject(entAray);
            }
         }
      };

   //rules code

    //vm.typeList = ["string","numeric","currency","location","datetime","related entity","other"];
    vm.ruleListSelection = "vlrule";
    $scope.ruleSelection = "vrule";
    $scope.enableRuleEdit = [];
    vm.conditionErr = "";
    vm.validateErr = "";
    $(".image-style3").css('max-height', $(window).height()-200);
    $(".image-style1").css('max-height', $(window).height()-80);

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
        vm.attributeSelected.rule_id = angular.copy($scope.rulesSelectArray);
        document.getElementById("existingruleDiv").style.width = "0%";
    };

    vm.clearAllRules = function(list){
        $scope.rulesSelectArray = [];
        vm.selectedRulesWithObj = [];
        $scope.selectedRules = {};
        if(list.rule_id != undefined){
            $scope.rulesSelectArray = list.rule_id;
        }
        angular.forEach($scope.rulesSelectArray,function(value,key){
            var singleRule = vm.allRules.filter(function(e){if(value==e.rule_id){return e}});
            if(singleRule.length>0)
                vm.selectedRulesWithObj.push(singleRule[0]);
        });
    };

    vm.getRulesConfig = function(){
        documentService.getRuleConfig(vm.sess_id).then(function(resp){
             if(resp.data.status == "success"){
               if(resp.data.config!=undefined){
                vm.rulesConfig = resp.data.config;
                vm.operatorsList = resp.data.config.operators;
                vm.functionsList = resp.data.config.functions;
                vm.actionsList = resp.data.config.actions;
               }
               else{
                vm.rulesConfig = [];
                vm.operatorsList = [];
                vm.functionsList = [];
                vm.actionsList = [];
               }
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

//    vm.getRulesConfig();

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

//    vm.getRules();

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
                    vm.attributeSelected.rule_id.push(rule[0].rule_id);
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
        document.getElementById("ruleOverlayDiv").style.width = "58%";
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

    $scope.addRuleForVariable = function(){
        vm.newRule();
        vm.conditionErr = "";
        document.getElementById("ruleOverlayDiv").style.width = "58%";
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
        document.getElementById("existingruleDiv").style.width = "58%";
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

    vm.removeRuleFromAttr = function(index){
        vm.selectedRulesWithObj.splice(index,1);
        $scope.rulesSelectArray = vm.selectedRulesWithObj.map(function(e){return e.rule_id});
        vm.attributeSelected.rule_id = angular.copy($scope.rulesSelectArray);
    }


    // ace example

    $scope.aceLoaded = function(_editor) {
        // Options
        _editor.setReadOnly(true);
    };

    $scope.aceChanged = function (_editor) {

    }
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
                if(vm.customConditionList!=undefined){
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
            }
            else{
                if(vm.customConditionList!=undefined){
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

//    vm.getCustomConditionsAndActions("condition");
//    vm.getCustomConditionsAndActions("action");
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
        var reqObj = {"name" : "","type" : "condition","code": "stringified ","lang": ""};
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
            console.log(reqObj.code);
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
            $scope.showSpinnertestCondition = true;
            if(!isNaN(vm.sourceConditionValue)){
                vm.sourceConditionValue = parseFloat(vm.sourceConditionValue);
            }
            if(!isNaN(vm.targetConditionValue)){
                vm.targetConditionValue = parseFloat(vm.targetConditionValue);
            }
            reqObj.source = vm.sourceConditionValue;
            reqObj.target = vm.targetConditionValue;
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
        console.log(obj);
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
            if(!isNaN(vm.sourceConditionValueInEdit)){
                vm.sourceConditionValueInEdit = parseFloat(vm.sourceConditionValueInEdit);
            }
            if(!isNaN(vm.targetConditionValueInEdit)){
                vm.targetConditionValueInEdit = parseFloat(vm.targetConditionValueInEdit);
            }
            reqObj.source = vm.sourceConditionValueInEdit;
            reqObj.target = vm.targetConditionValueInEdit;
            reqObj.isCondition = true;
        }
        else{
            var editor = ace.edit('aceEditorAction'+index);
            var code = editor.getValue();
            if(!isNaN(vm.sourceActionValueInEdit)){
                vm.sourceActionValueInEdit = parseFloat(vm.sourceActionValueInEdit);
            }
            if(!isNaN(vm.targetActionValueInEdit)){
                vm.targetActionValueInEdit = parseFloat(vm.targetActionValueInEdit);
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


    function suggest_state(term) {
        var q = term.toLowerCase().trim();
        var results = [];

        // Find first 10 nerTypeList that start with `term`.
        for (var i = 0; i < $scope.nerTypeList.length; i++) {
          var state = $scope.nerTypeList[i];
          if (state.toLowerCase().indexOf(q) === 0)
            results.push({ label: state, value: state });
        }

        return results;
    }

    $scope.autocomplete_options = {
        suggest: suggest_state
    };

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

    $scope.popupActions = function(){
        document.getElementById("addNewEntityWindow").style.width = "0%";
        //$("#addEntityDropDown").trigger( "click" );
         // $(".dropdown").dropdown('toggle');
         //$('.dropdown').addClass('open')
          //e.stopPropagation();
          // Toggle dropdown if not already visible:
          if ($('.dropdown').find('.dropdown-menu').is(":hidden")){
            $('.dropdown-toggle').dropdown('toggle');
          }

    };






  });
