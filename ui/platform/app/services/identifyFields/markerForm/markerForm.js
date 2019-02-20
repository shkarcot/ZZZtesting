'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.services.identifyfields')
.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('app.markerFormService', {
        url: '/markerForm/:id',
        views: {
          'bodyContentContainer@app': {
            template: require('./markerForm.html'),
            controller: 'markerFormCtrl as mf',
            cache:false
          }
        }
      })
  }])

.controller('markerFormCtrl', function ($scope,$compile,Upload,$rootScope,ngDialog,$state,$stateParams,documentService,entitiesService) {
        var vm = this;
        $rootScope.currentState = 'services';
//        $scope.configObj = [];
//        $scope.imageObj={};
//        $scope.image = {
//            src: 'images/working.png',
//            maxWidth: 'auto',
//            aspectRatio: 0
//        };
         $(".image-style").height($(window).height()-70);
         $(".image-style1").height($(window).height()-150);
         $(".image-style2").height($(window).height()-180);
         vm.getDocumentsList = getDocumentsList
         $scope.drawer =[];
         $scope.rect = {
                data_color: '#337ab7',
                marker_color: '#00ad2d',
                stroke: 5
         };
         $scope.selectedAttribute = '';
         vm.orderVal = 0;
         $scope.goToDocumentTemplate = function(){
            var engine = localStorage.getItem("engineName");
            $state.go("app.services.identifyfields");
         }


         function getDocumentsList(id){
           documentService.getDocumentDetails(vm.sess_id,id).then(function(resp){
              console.log(resp);
              if(angular.equals(resp.data.status,'success')){
                vm.documentDetails = resp.data.data
                $scope.image = {
                   src: '/static'+vm.documentDetails.file_path,
                   //src: './app/images/working.png',
                    maxWidth: 'auto',
                    aspectRatio: 0
                };
                $("#ImageLocation").empty();
                var htmlContent = "<div class='panel panel-default' form-image form-src='image.src' form-max width='image.maxWidth' form-selector='selector' form-drawer='drawer'></div>";
                var el = $compile( htmlContent )($scope);
                var element = document.getElementById("ImageLocation");
                angular.element(document.getElementById("ImageLocation")).append(el);
                  vm.removeSelector();
                  $scope.configObj = {}
                  $scope.configObj.configuration = vm.documentDetails.configuration;
                  $scope.configObj.marker_config = vm.documentDetails.marker_config;

                  $scope.drawer =[];

                  $scope.tags = [];
                  $scope.markerList = [];

//                  angular.forEach($scope.configObj.marker_config,function(value,key){
//
//
//                           var obj = {}
//                           obj.parentKey = 'marker_config';
//                           obj.key = key;
//                           obj.x1 = value.coordinates.x1;
//                           obj.y1 = value.coordinates.y1;
//                           obj.x2 = value.coordinates.x2;
//                           obj.y2 = value.coordinates.y2;
//                           obj.order = value.order;
//                           obj.color = $scope.rect.marker_color;
//                           obj.stroke = $scope.rect.stroke;
//                           $scope.markerList.push(key);
//                           $scope.drawer.push(obj)
//
//
//                  })



                  angular.forEach($scope.configObj.configuration,function(value,key){

                     var obj = {}
                         obj.name = value.name;
                         obj.key = "parent";
                         obj.x1 = value.parentCoordinates.x1;
                         obj.y1 = value.parentCoordinates.y1;
                         obj.x2 = value.parentCoordinates.x2;
                         obj.y2 = value.parentCoordinates.y2;
                         obj.order = value.order;
                         obj.color = $scope.rect.marker_color;
                         obj.stroke = $scope.rect.stroke;
                         $scope.drawer.push(obj)
                     var obj = {}
                         obj.name = value.name;
                         obj.key = "child";
                         obj.x1 = value.childCoordinates.x1;
                         obj.y1 = value.childCoordinates.y1;
                         obj.x2 = value.childCoordinates.x2;
                         obj.y2 = value.childCoordinates.y2;
                         obj.order = value.order;
                         obj.color = $scope.rect.data_color;
                         obj.stroke = $scope.rect.stroke;
                         $scope.drawer.push(obj)


                  })
//                  console.log($scope.drawer);
//                  if($scope.drawer.length>0){
//                    $scope.drawer.sort(function(a, b) {
//                            return parseFloat(a.order) - parseFloat(b.order);
//                    });
//                    vm.orderVal = Math.max.apply(Math,$scope.drawer.map(function(o){return o.order;}))
//                    console.log(vm.orderVal);
//                  }
//                  console.log($scope.drawer);




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


         getDocumentsList($stateParams.id)
//        $scope.selector = {};
//        $scope.selector.enabled = true;
//
//        $scope.structuredText = true;
//
//        $scope.rect = {
//            color: '#337ab7',
//            stroke: 3
//        };
         vm.dataObj = {};


         $scope.structuredText = true;
             $scope.number=false;
             $scope.date=false;
             $scope.name=false;
             $scope.address=false;
        $scope.changeDatatype = function(val){
           if(val == 'txt'){
             vm.dataObj.data_type.validation = 'All';

           }
           else if(val == 'number'){
             vm.dataObj.data_type.validation = 'N';

           }
           else if(val == 'date'){
             vm.dataObj.data_type.validation = 'detect';

           }
           else if(val == 'name'){
             vm.dataObj.data_type.validation = 'All';

           }
           else if(val == 'address'){
             vm.dataObj.data_type.validation = 'All';

           }
           else if(val == 'boolean'){
             vm.dataObj.data_type.validation = '';

           }
           else if(val == 'list'){
             vm.dataObj.data_type.validation = 'multiple_selection';

           }
           else if(val == 'currency'){
             vm.dataObj.data_type.validation = '';

           }
        }



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


            vm.editZone = function(index){

              $rootScope.selectedIndex = index;
              $rootScope.parentName = $scope.drawer[index].name;
              $rootScope.parentKey  = $scope.drawer[index].key;
              vm.dataObj = $scope.configObj.configuration[$rootScope.parentName];


              vm.currentVal = index;
              vm.currentIndex  = index+1;
              vm.isEditConfig = true;
//              vm.dataObj=$scope.configObj[$rootScope.parentKey][$rootScope.childKey];
//              $scope.tags = $scope.configObj[$rootScope.parentKey][$rootScope.childKey].reference_markers;
//              vm.listOfObjsLength  = $scope.drawer.length;
//              if(vm.currentIndex< vm.listOfObjsLength && vm.currentIndex>1){
//                vm.nextClass = '';
//                vm.prevClass = '';
//              }
//              else{
//                if(vm.currentIndex == vm.listOfObjsLength ){
//                   vm.nextClass = 'disabledCls';
//                   vm.prevClass = '';
//                }
//                else if(vm.currentIndex == 1){
//                  vm.prevClass = 'disabledCls';
//                  vm.nextClass = '';
//                }
//              }



              $(".image-style").height($(window).height()-70);

              $rootScope.highlight=[];
              $rootScope.imageBlur='imageBlurDisplay';
              $rootScope.highlight[index] = "highlightClass";
              $scope.zoomDisplay = 'zoomSize1';
              setTimeout(function(){
                document.getElementsByClassName('image-style')[0].scrollTop = $scope.drawer[index].y1 - 200;
                document.getElementsByClassName('image-style')[0].scrollLeft = $scope.drawer[index].x1;
               }, 100);

               $scope.imageObj={};
               $scope.imageObj.width = document.getElementById("calImage").style.width.replace("px","");
               $scope.imageObj.height = document.getElementById("calImage").style.height.replace("px","");
               $scope.calculation($scope.drawer[index]);
                $scope.selector.clear();

                $scope.selector.x1 = $scope.drawer[index].x1;
                $scope.selector.y1 = $scope.drawer[index].y1;
                $scope.selector.x2 = $scope.drawer[index].x2;
                $scope.selector.y2 = $scope.drawer[index].y2;
                if($scope.drawer[index].key == 'parent')
                      $scope.selector.color = $scope.rect.marker_color;
                else
                     $scope.selector.color = $scope.rect.data_color;
                $scope.selector.stroke  = $scope.rect.stroke;
                $scope.selector.enabled = true;

                if(document.getElementsByClassName("form-box")[0].style!=undefined){
                    document.getElementsByClassName("form-box")[0].style.display = "none";
                    document.getElementsByClassName("form-box")[0].style.top = $scope.drawer[index].y1+"px";
                    document.getElementsByClassName("form-box")[0].style.left = $scope.drawer[index].x1+"px";
                    document.getElementsByClassName("form-box")[0].style.bottom = ""+$scope.obj.bottom+"px";
                    document.getElementsByClassName("form-box")[0].style.right = ""+$scope.obj.right+"px";
                }
                if(document.getElementsByClassName("form-shadow")[0].style!=undefined){
                    document.getElementsByClassName("form-shadow left")[0].style.right = ""+$scope.obj.shleftRight+"px";
                    document.getElementsByClassName("form-shadow center top")[0].style.left = ""+$scope.obj.shcentertopleft+"px";
                    document.getElementsByClassName("form-shadow center top")[0].style.right = ""+$scope.obj.shcentertopright+"px";
                    document.getElementsByClassName("form-shadow center top")[0].style.bottom = ""+$scope.obj.shcentertopbottom+"px";
                    document.getElementsByClassName("form-shadow center bottom")[0].style.left = ""+$scope.obj.shcenterbottomleft+"px";
                    document.getElementsByClassName("form-shadow center bottom")[0].style.right = ""+$scope.obj.shcenterbottoformight+"px";
                    document.getElementsByClassName("form-shadow center bottom")[0].style.top = ""+$scope.obj.shcenterbottomtop+"px"
                    document.getElementsByClassName("form-shadow right")[0].style.left = ""+$scope.obj.shrightleft+"px";
                }


            };

            vm.removeZone = function(){
              $scope.drawer.splice(vm.currentIndex-1,1);
              delete vm.documentDetails[$rootScope.parentKey][$rootScope.childKey];
              vm.saveConfigurations();
              vm.removeSelector();

            };


            $scope.entitiesObj={};

            vm.getAttributesList = function(){
                  entitiesService.getEntities({'sess_id':vm.sess_id}).then(function(resp){
                      console.log(resp.data);
                      $scope.entitiesList = resp.data.domain_object;
                  angular.forEach($scope.entitiesList,function(value,key){
                      $scope.entitiesObj[value.entity_name] = value;
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

            $scope.getAttribute = function(name){
              $scope.listOfAttributes=[];
              $scope.listOfAttributes = $scope.entitiesObj[name].attributes;
            };
            vm.getAttributesList();

            $rootScope.$on("edited",function(evt,data){
              vm.isView=true;
              //alert(data)
              vm.editZone(data);
            })



            $scope.selector = {};
            $scope.selector.enabled=false;
            $scope.zoomDisplay = 'zoomSize';
            vm.dataObj = {};

            vm.removeSelector = function(){
                $scope.selector.clear();
                $scope.selector.enabled=false;
                vm.isView = false;
                vm.isEditConfig = false;
                $scope.zoomDisplay = 'zoomSize';
                vm.dataObj = {};

                $scope.selectedAttribute = '';
//                $scope.changeDatatype(vm.dataObj.data_type.type);
                $rootScope.imageBlur='';
                $rootScope.highlight=[];
                $rootScope.selectedIndex = -1;
                $rootScope.parentKey = -1;
                $rootScope.childKey = -1;
                $scope.tags =[];
                document.getElementsByClassName('image-style')[0].scrollTop = 0;
                document.getElementsByClassName('image-style')[0].scrollLeft = 0;
                $(".image-style").height($(window).height()-70);
                $(".image-style1").height($(window).height()-150);
            };



            //vm.dataObj.field_type ='marker';







            vm.createRect = function(){
              vm.isView=true;
              $scope.zoomDisplay = 'zoomSize1';
              $scope.selector.enabled=true;
              vm.isEditConfig = false;
              if(!$scope.croppingError){
               $scope.croppingError = false;
                vm.dataObj = {};
//                vm.dataObj.field_type ='marker';
//
//                vm.dataObj.data_type ={'type':'txt'};
//                vm.dataObj.type ='txt';
//                vm.dataObj.field_range='fixed';
//                $scope.changeDatatype(vm.dataObj.data_type.type)

              }


            };

            vm.viewList = function(){


              vm.removeSelector();
            };



            vm.addMarker = function(name){
                     $scope.configObj.marker_config[name]={}
                     $scope.configObj.marker_config[name].coordinates={};
                      if($scope.selector.x1!=undefined){
                         $scope.croppingError = false;
                         $scope.configObj.marker_config[name].coordinates.x1=$scope.selector.x1;
                         $scope.configObj.marker_config[name].coordinates.y1=$scope.selector.y1;
                         $scope.configObj.marker_config[name].coordinates.x2=$scope.selector.x2;
                         $scope.configObj.marker_config[name].coordinates.y2=$scope.selector.y2;
                         $scope.configObj.marker_config[name].name = name;
                         $scope.configObj.marker_config[name].key = vm.dataObj.key;
                         $scope.configObj.marker_config[name].field_type= "marker";
                         $scope.configObj.marker_config[name].order= vm.orderVal+1;
                         $scope.markerList.push(name);
                      }
                      else{
                        $scope.croppingError = true;
                      }
            };

            vm.saveConfigurations = function(){
               documentService.saveConfigurations(vm.sess_id,vm.documentDetails).then(function(resp){
                           console.log(resp);
                             getDocumentsList($stateParams.id);

                           vm.removeSelector();


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
            $scope.addRect = function () {
                 $scope.croppingError = false;
                 if(vm.dataObj.parentCoordinates!=undefined && vm.dataObj.childCoordinates!=undefined){
                   if($rootScope.selectedIndex!=-1){
                       if($rootScope.parentKey=='parent'){
                         vm.dataObj.parentCoordinates.x1 = $scope.selector.x1;
                         vm.dataObj.parentCoordinates.y1 = $scope.selector.y1;
                         vm.dataObj.parentCoordinates.x2 = $scope.selector.x2;
                         vm.dataObj.parentCoordinates.y2 = $scope.selector.y2;

                       }
                       else if($rootScope.parentKey=='child'){
                         vm.dataObj.childCoordinates.x1 = $scope.selector.x1;
                         vm.dataObj.childCoordinates.y1 = $scope.selector.y1;
                         vm.dataObj.childCoordinates.x2 = $scope.selector.x2;
                         vm.dataObj.childCoordinates.y2 = $scope.selector.y2;
                       }
                   }
                   $scope.configObj.configuration[vm.dataObj.name]=vm.dataObj;
                   vm.documentDetails.configuration = $scope.configObj.configuration;
                   vm.saveConfigurations();
                   vm.removeSelector();
                   }
                 else{
                   $scope.croppingError = true;
                   $scope.cropMsg = 'Please select the Coordinates';
                 }

            };

            vm.pageData = function(type){
              if(type=='next')
                 vm.editZone(vm.currentVal+1);
              else
                 vm.editZone(vm.currentVal-1);
            };

//            $scope.removeRect = function (index) {
//                $scope.configObj.splice(index, 1);
//
//            };
//
//            $scope.cropRect = function () {
//                $scope.result = $scope.selector.crop();
//            };



            $scope.colors = {
                '#337ab7': 'active',
                '#3c763d': 'success',
                '#31708f': 'info',
                '#8a6d3b': 'warning',
                '#a94442': 'danger'
            };






      $scope.CustomCallback = function (item, selectedItems) {
            if (selectedItems !== undefined && selectedItems.length >= 80) {
                return false;
            } else {
                return true;
            }
        };

      $scope.getAttributesSelectedList = function(){
          if($scope.selectedItem2.length>0){
             $scope.selectedParentAttribute = $scope.selectedItem2[0].parent;
             $scope.selectedchildAtttribute = $scope.selectedItem2[0].name;
             vm.dataObj.entity_attribute = $scope.selectedParentAttribute + '.' + $scope.selectedchildAtttribute;
             //vm.documentDetails[$rootScope.parentKey][$rootScope.childKey].attribute = $scope.selectedAttribute;
          }
      }
      $scope.deleteSelectedAttribute = function(){
              delete vm.dataObj.entity_attribute;

      };

      $scope.lockShow = true;
      vm.saveParentCoords = function(){
           var obj = {};
           $scope.croppingError = false;
           if($scope.selector.x1!=undefined){
               $scope.lockShow = false;
               obj.x1 = $scope.selector.x1;
               obj.y1 = $scope.selector.y1;
               obj.x2 = $scope.selector.x2;
               obj.y2 = $scope.selector.y2;
               obj.stroke = $scope.rect.stroke;
               obj.order = vm.orderVal++;
               if(vm.dataObj.parentCoordinates==undefined){
                 obj.color = $scope.rect.marker_color;
                 vm.dataObj.parentCoordinates={};
                 vm.dataObj.parentCoordinates.x1=obj.x1;
                 vm.dataObj.parentCoordinates.x2=obj.x2;
                 vm.dataObj.parentCoordinates.y1=obj.y1;
                 vm.dataObj.parentCoordinates.y2=obj.y2;
                 $scope.drawer.push(obj);
                 $scope.selector.clear();
                 $scope.selector.enabled=true;
               }
               else{
                 if(vm.dataObj.parentCoordinates.x1<obj.x1 && vm.dataObj.parentCoordinates.y2>obj.y2 && vm.dataObj.parentCoordinates.x2>obj.x2 && vm.dataObj.parentCoordinates.y1<obj.y1){
                     obj.color = $scope.rect.data_color;
                     vm.dataObj.childCoordinates={};
                     vm.dataObj.childCoordinates.x1=obj.x1;
                     vm.dataObj.childCoordinates.x2=obj.x2;
                     vm.dataObj.childCoordinates.y1=obj.y1;
                     vm.dataObj.childCoordinates.y2=obj.y2;
                     $scope.lockShow = true;
                     $scope.drawer.push(obj);
                     $scope.selector.clear();
                     $scope.selector.enabled=true;
                 }
                 else{
                   $scope.croppingError = true;
                   $scope.cropMsg = 'Please select the Coordinates within the parent box';
                 }
               }

           }else{
             $scope.croppingError = true;
             $scope.cropMsg = 'Please select the Coordinates';
           }



      };


  });


