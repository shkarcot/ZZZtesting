module.exports = ['$scope','$rootScope','ngDialog','Upload','$state','$window','customModelDashboardService','$location','$timeout','$http', function($scope,$rootScope,ngDialog,Upload,$state,$window,customModelDashboardService,$location,$timeout,$http) {
	'use strict';

    var vm = this;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    vm.sess_id = userData.sess_id;
    $scope.pipelinelist = [];
    vm.ensembleFilter = "all";
    vm.createQuery = "select * from tweet_data";
    vm.dataTypechart = "pie";
    $scope.filter_obj ={"page_no": 1, "no_of_recs": 12, "sort_by":"update_ts", "order_by":false};
    $scope.filter_obj_dataset = {"filter_obj":{"page_no":1,"no_of_recs":12,"sort_by":"update_ts","order_by":false}};
    $scope.filter_obj_binary = {"filter_obj":{"page_no":1,"no_of_recs":12,"sort_by":"update_ts","order_by":false}};
    $scope.filter = { "filtertype":["product","category","brand"] };
    $scope.filtertype = {
  'category': [
    'Bakery',
    'Dairy',
    'Beverages',
    'Cosmetics',
    'Snack'
  ],
  'product': [
    'Organic Frosting',
    'Organic Fuel',
    'Tea',
    'Nail Polish',
    'Marshmallows',
    'Bread',
    'Cold Brew Coffee'
  ],
  'brand': [
    'Miss Jones',
    'Oraganic Valley',
    'Yogi',
    'Mineral Fusion',
    'Jet-Puffed',
    'Only Kosher Candy',
    'Paskesz',
    'Julian Bakery',
    'StoneBank Baking',
    'High Brew Cold Brew Coffee',
    'Red Barn'
  ]
};
    $scope.xstageresultData = [{"name":"demo",
        "description":"demo description",
        "pipeInfo":'{"description":"testing 1310","pipeNm":"Sentiment Predict","reason":"Initial Set Up","stageInfo":"{}","stagePrevInfo":"{}","statusCd":"DRAFT","type":"PREDICT", "updatedBy":"999999999","updatedAt":"2018-01-01 01:01:01","createdAt":"2018-01-01 01:01:01","createdBy":"999999999"}',
        "submitDt":"2018-01-01 01:01:01",
        "startDt":"2018-01-01 01:01:01",
        "endDt":"2018-01-01 01:01:01",
        "status":"Submitted",
        "errorCd":"",
        "errorDesc":"",
        "createdAt":"2018-01-01 01:01:01",
        "createdBy":"admin",
        "updatedAt":"2018-01-01 01:01:01",
        "updatedBy":"ramanareddy"
      }];

    console.log( $scope.filtertype.product[0]);
    $scope.ngflitertype = $scope.filter.filtertype[0];
    $scope.ngflitertype1 = $scope.filtertype.product[0];


    $scope.filter_type = function()
    {
      //console.log(""+$scope.ngflitertype);
      $scope.filterproductkey = {};
     angular.forEach($scope.filtertype, function(value, key) {

         // console.log("dddddffd"+);
          if(key == $scope.ngflitertype)
          {
             $scope.ngflitertype1 = value[0];
             $scope.filterproductkey = value;
          }
        });

    }
    $scope.filter_type();

    // models
    vm.querydataset = ['Hive','My Sql'];
    vm.dataGraphTypeList = ['scatter','bar','line'];
     $scope.treeData = [{"name":"Node",
                          "folderClass":"fa-folder",
                      "nodes":[{
                          "name":"Node-1",
                          "folderClass":"fa-folder",
                          "value" : "Value of Node 1",
                           "nodes":[{
                               "name":"Node-1-1",

                          "folderClass":"fa-folder",
                               "nodes":[]
                                },{
                                "name":"Node-1-2",
                          "folderClass":"fa-folder",
                                "nodes":[]
                                }]
                            },{
                          "name":"Node-2",
                          "folderClass":"fa-folder",
                          "value" : "Value of Node 2",
                            "nodes":[{
                                "name":"Node-2-1",
                          "folderClass":"fa-folder",
                                "nodes":[]
                                },{
                                "name":"Node-2-2",
                          "folderClass":"fa-folder",
                                "nodes":[]
                                }]
                            },{
                          "name":"Node-3",
                          "folderClass":"fa-folder",
                          "value" : "Value of Node 3",
                            "nodes":[{
                                "name":"Node-3-1",
                          "folderClass":"fa-folder",
                                "nodes":[{
                                    "name":"Node-3-1-1",
                          "folderClass":"fa-folder",
                                    "nodes":[]
                                },{
                                    "name":"Node-3-1-2",
                          "folderClass":"fa-folder",
                                    "nodes":[]
                                }]
                            },{
                                "name":"Node-3-2",
                          "folderClass":"fa-folder",
                                "nodes":[]
                                }]
                            }]
                     },{"name":"Hey Node",
                          "folderClass":"fa-folder",
                      "nodes":[{
                          "name":"Node-1",
                          "folderClass":"fa-folder",
                          "value" : "Value of Node 1",
                           "nodes":[{
                               "name":"Node-1-1",
                          "folderClass":"fa-folder",
                               "nodes":[]
                                },{
                                "name":"Node-1-2",

                          "folderClass":"fa-folder",
                                "nodes":[]
                                }]
                            },{
                          "name":"Node-2",
                          "folderClass":"fa-folder",
                          "value" : "Value of Node 2",
                            "nodes":[{
                                "name":"Node-2-1",
                          "folderClass":"fa-folder",
                                "nodes":[]
                                },{
                                "name":"Node-2-2",
                          "folderClass":"fa-folder",
                                "nodes":[]
                                }]
                            }]
                     }];
    vm.graphType =   vm.dataGraphTypeList[0];

    vm.getAllModels = function(){
        var obj = {'ensemble_type':vm.ensembleFilter, 'filter_obj':$scope.filter_obj}
        customModelDashboardService.getModelsFilter({'sess_id':vm.sess_id, "data": obj}).then(function(response){
            if(response.data.status=="success"){
                vm.modelsArray=response.data.data;
                $scope.filter_obj.totalRecords = response.data.total_ensembles;
                var filterArr = vm.modelsArray.filter(function(e){if(e.status=="processing"){return e}});
                if(filterArr.length>0){
                    $scope.clearTimeOutVar = setTimeout(function(){ vm.getAllModels(); }, 10000);
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
    };
    vm.getAllModels();

    vm.goToModelDetails = function(mid,name){
        $state.go('app.customModelDetails',{"name":name,"id": mid});
    };


    $scope.pageChanged = function (page) {
        $scope.filter_obj.page_no = page;
        vm.getAllModels()
    };

    // dataset

    $scope.showEditIcons = [];
    $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();

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

    vm.datasetTypes = function(){
        customModelDashboardService.getDatasetTypes({'sess_id':vm.sess_id}).then(function(response){
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
    vm.datasetTypes();

    vm.getAllDataSets = function(){
        customModelDashboardService.getDataSetsList({'sess_id': vm.sess_id,"data": $scope.filter_obj_dataset}).then(function(response){
            if(response.data.status=="success"){
                vm.listOfDataSets = response.data.data;
                $scope.filter_obj_dataset.totalRecords = response.data.total_datasets;
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

    $scope.pageChangedDataset = function (page) {
        $scope.filter_obj_dataset.page_no = page;
        vm.getAllDataSets()
    };

    vm.getAllBinaries = function(){
        customModelDashboardService.getBinaries({'sess_id':vm.sess_id,"data":$scope.filter_obj_binary}).then(function(response){
            if(response.data.status=="success"){
                vm.listOfBinaries = response.data.data;
                $scope.filter_obj_binary.totalRecords = response.data.total_binaries;
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
    vm.getAllBinaries();

    $scope.pageChangedBinary = function (page) {
        $scope.filter_obj_binary.page_no = page;
        vm.getAllDataSets()
    };

    $scope.showIcons=function(index){
        $scope.showEditIcons[index]=true;
    };
    $scope.hideIcons=function(index){
        $scope.showEditIcons[index]=false;
    };

    vm.downloadFile = function(path){
        var downloadUrl = $scope.url+'/api/models/dataset/download/'+path;
        window.location.assign(downloadUrl);
    };

    vm.archiveDataset = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data': {"dataset_id":obj.dataset_id,"archive": true}};
        ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.popUpText = "Do you really want to archive the dataset?";
                  $scope.onConfirmActivation = function (){
                      customModelDashboardService.archiveDataset(reqObj).then(function(response){
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
                    $scope.enabledatasetLoader = false;
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

    // binaries code

    vm.importBinaryObj = {"name":"","description":""};
    $scope.showEditIconsBinary = [];

    $scope.uploadBinary = function(attribute){
        $scope.ImportDataset="Import Binary";
        document.getElementById("binaryImport").style.width = "40%";
    };

    $scope.cancelBinary = function () {
        document.getElementById("binaryImport").style.width = "0%";
        vm.importBinaryObj = {"name":"","description":""};
        $scope.browseFileName1 = '';
        $scope.browseFile1="";
    };

    $scope.uploadFileBinary = function(file){
        if(file!=null){
              $scope.browseFileName1 = file.name;
              $scope.browseFile1 = file;
        }
    };

    $scope.showIconsBinary=function(index){
        $scope.showEditIconsBinary[index]=true;
    };
    $scope.hideIconsBinary=function(index){
        $scope.showEditIconsBinary[index]=false;
    };

    vm.downloadFileBinary = function(path){
        var downloadUrl = $scope.url+'/api/models/dataset/download/'+path;
        window.location.assign(downloadUrl);
    };

    vm.sendBinary = function(){
          var file = $scope.browseFile1;
          if($scope.browseFile1 == undefined || $scope.browseFile1 == null|| $scope.browseFile1 == ""){
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
            var dataObj = {"file_name": vm.importBinaryObj.name,"description":vm.importBinaryObj.description};
            $scope.enablebinaryLoader = true;
             file.upload = Upload.upload({
                  url: 'api/models/binary/upload/',
                  method: 'POST',
                  headers: {"sess_token": $scope.loginData.sess_id},
                  data:dataObj,
                  file: file
             });
             file.upload.then(function (response) {
                  $scope.browseFileName1 = '';
                  $scope.browseFile1="";
                  $scope.enablebinaryLoader = false;
                 if(response.data.status=="success"){
                     vm.importBinaryObj = {"name":"","description":"","dataType":""};
                     $timeout(function(){ $scope.cancelBinary();}, 2000);
                     vm.getAllBinaries();
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
                    $scope.enablebinaryLoader = false;
                 }
             }, function (response) {
                  $scope.browseFileName1 = '';
                  $scope.browseFile1="";
                  $scope.enablebinaryLoader = false;
                   $.UIkit.notify({
                     message : 'Error in file upload',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                   });
             });
          }
    };

    vm.archiveBinary = function(obj){
        var reqObj={'sess_id':vm.sess_id,'data': {"resource_id":obj.resource_id,"archive": true}};
        ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.popUpText = "Do you really want to archive the binary?";
                  $scope.onConfirmActivation = function (){
                      customModelDashboardService.archiveBinary(reqObj).then(function(response){
                            if(response.data.status=="success"){
                                vm.getAllBinaries();
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

    vm.closeUploadSideBar = function(){
        $scope.canceldataSet();
        $scope.cancelBinary();
    };

    $scope.$on("$destroy",function(){
        if (angular.isDefined($scope.clearTimeOutVar)) {
            clearTimeout($scope.clearTimeOutVar);
        }
    });
    vm.graphChageType = function()
    {
       $scope.graph_draw_loop();
    }

     $scope.chart_draw = function(data, id, dataGraphType, keydata)
     {
      var xs1 = {};
      var key1 = $scope.obj.key;
      var data1 = $scope.obj.data;
      xs1[key1] = data1;

     $timeout(function() {
        var idd = c3.generate({
            bindto: '#' + id,
            data: {
                xs: xs1,
                columns: data,
                type: dataGraphType,
            },
            axis: {
                x: {
                    label: data1,
                    tick: {
                        fit: false
                    }
                },
                y: {
                    label: key1
                }
            },
             point: {
    show: false
  },

  tooltip: {
    show: true
  }
        }); //console.log($scope.bind_id );
        idd.resize({
            height: 180,
            width: 180
        });
    }, 2000);


  }

$scope.pipelinegraph =  function(varpop)
{
  console.log(varpop);
   $scope.myAccess = [];
   $scope.sillyString = varpop.split();
   console.log($scope.objkey[0]);

  if(varpop)
  {

            angular.forEach($scope.objmetadata, function (value, key) {
              angular.forEach(value,function(value11,key11){
              if(varpop == key11)
              {
               console.log("key::::"+JSON.stringify(value[key11]));
               $scope.myAccess.push(value[key11]);
              }




              })



            });
     return 'popover.html';
     $scope.myAccess = [];
  }


}

$scope.graph_draw_loop = function() {
    var grapgType = vm.graphType;
    console.log(grapgType);
    $scope.jsodata1 = vm.listOfQuery.graphs.pairplot;
    $scope.bind_id = [];
    $scope.keydata = ['id', 'name', 'english', 'maths', 'science'];

    $scope.chattype = ['pie', 'line', 'bar'];
    var count = 0;
    $scope.pusharr = [];
    var arr1 = [];
    var arr2 = [];
    $scope.obj = {};

    for (var i = 0; i < $scope.jsodata1.length; i++) {

        //var xdata =+':'+;
        $scope.obj.key = $scope.jsodata1[i].xaxis[0];
        $scope.obj.data = $scope.jsodata1[i].yaxis[0];
        var arr1 = $scope.jsodata1[i].xaxis;
        var arr2 = $scope.jsodata1[i].yaxis;
        $scope.pusharr.push(arr1, arr2);
        $scope.chart_draw($scope.pusharr, 'id' + count,grapgType, $scope.keydata);
        count++;
        $scope.pusharr = [];
        arr1 = [];
        arr2 = [];
    }


 }


   vm.getQuery = function()
   {
        var queryData= { "sql":vm.createQuery,
                  "request_type":  ["data","metadata","series"],
                   "source": "hive"
                }

         $http.get('http://35.172.23.71:18001/featuredata',queryData,{
				headers : {
					'Content-Type' :'application/json'
				}
			}).success(function(data) {


               //console.log("sjhjh:::data"+data);

                  vm.listOfQuery = data;
			   if(vm.listOfQuery.dbdata != '')
                   {
                      vm.dataView();
                   }
                   if(vm.listOfQuery.graphs.pairplot != '')
                   {
                      $scope.graph_draw_loop();
                   }


			}).error(function(error) {
                 console.log("sjhjh"+error);
			});

       /* $http.post('http://ec2-34-204-48-216.compute-1.amazonaws.com:18001/featuredata',queryData, {
				headers : {
					'Content-Type' :'application/json'
				}
			}).success(function(data) {


               console.log("sjhjh:::data"+data);
			   vm.listOfQuery = data;
			   if(vm.listOfQuery.dbdata != '')
                   {
                      vm.dataView();
                   }
                   if(vm.listOfQuery.graphs.pairplot != '')
                   {
                      $scope.graph_draw_loop();
                   }


			}).error(function(error) {
                 console.log("sjhjh"+error);
			});*/



    };

  vm.dataView = function()
  {
   $scope.obj = {};
   $scope.objkey = [];
   $scope.objdata = vm.listOfQuery.dbdata;
   $scope.objmetadata = vm.listOfQuery.metadata;

    var arrykey = [];

    angular.forEach(vm.listOfQuery.dbdata, function(value, key) {
        angular.forEach(value,function(value,kkey,count){

             this.push(kkey);

        },arrykey);
        });


        for(let i = 0;i < arrykey.length; i++){
            if($scope.objkey.indexOf(arrykey[i]) == -1){
                $scope.objkey.push(arrykey[i])
            }
        }



  }
   vm.editPipline = function(id)
   {
     console.log("testin ::;:"+id);
     $state.go('app.createPipelineEdit');

   }
   $scope.toggleChildren = function(data) {
      data.childrenVisible = !data.childrenVisible;
        data.folderClass = data.childrenVisible?"fa-folder-open":"fa-folder";
    };

    $scope.transfLineDrawJson = function(data)
    {
      if(data)
      {
          $('#myModal').modal('show');
      }




    }



    $scope.list = {};
  $scope.ShowContextMenu = function()
  {
   // alert('hh');
    //list.append('clicked');
  }
  $scope.dataView = function()
  {
  }
  // result tab control
   $scope.showgraph = false;
	$scope.fromdate = new Date("2018-09-01");
	$scope.todate = new Date("2018-12-30");
	$scope.selectmodel = "xpms-model";
	$scope.generateVGraph = function(barchart,barchartid)
		    {

		       var chart = c3.generate({
			        bindto:'#'+barchartid,
			        data: {
			        	x: 'date',
			        	json: barchart,
				        keys: {
				        	x: "date",
				            value: ['positive', 'negative','neutral']
				        },
			            type: 'bar',
			            groups: [
			                ['positive', 'negative','neutral']
			            ]
			        },
			        axis: {
			            x: {
			            	type: 'category',
			                tick: {
				                format: '%m-%d-%Y'
				            }
			            }
			        }
			     });
		    }
	$scope.generatepiGraph = function(piechart,piechartid)
	{
		var chart = c3.generate({
	        bindto:'#'+piechartid,
	        data: {
	        json: piechart,
	        keys: {

	            value: ['positive', 'negative','neutral'],
	        },
	        type:'pie'

	      }



	     });
	}
	$scope.generateLineGraph = function(linechart,linechartid)
	{
		var chart = c3.generate({
	        bindto:'#'+linechartid,
	        data: {
	        	x: 'date',
	        	json: linechart,
		        keys: {
		        	x: "date",
		            value: ['positive', 'negative','neutral']
		        },
	            type: 'line'

	        },
	        axis: {
	            x: {
	            	type: 'category',
	                tick: {
		                format: '%m-%d-%Y'
		            }
	            }
	        }



	     });
	}


	$scope.refreshSentiment_Data = function()
	{
		var d = new Date($scope.fromdate);
		var dto = new Date($scope.todate);
		//var d = new Date();

		// Start of new code 25-Sep
		var fromdate = d.getFullYear()  + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " +
		("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":"+ ("0" + d.getSeconds()).slice(-2);

		var todate = dto.getFullYear()  + "-" + ("0"+(dto.getMonth()+1)).slice(-2) + "-" + ("0" + dto.getDate()).slice(-2) + " " +
		("0" + dto.getHours()).slice(-2) + ":" + ("0" + dto.getMinutes()).slice(-2) + ":"+ ("0" + dto.getSeconds()).slice(-2);
		// End of new code 25-Sep

		var fromto_date_json = {
				"fromdate" : fromdate,
				"todate": todate,
				//'fromdate' : $scope.fromdate,   new code 25-Sep
				//'todate' : $scope.todate,       new code 25-Sep
				"model":$scope.selectmodel,
                "source":"101"

			}
			$http.post('http://ec2-52-55-236-26.compute-1.amazonaws.com:18098/analysis',fromto_date_json, {
				headers : {
					'Content-Type' : 'application/json',
				}

			}).success(function(data) {
				$scope.showgraph = true;
				for(var i=0;i<data.length;i++)
				{
					console.log(data[i].barchart);
				  if(data[i].barchart)
					  {
					  $scope.generateVGraph(data[i].barchart,'barchart');

					  $scope.generateLineGraph(data[i].barchart,'linechart');
					  }
				  else
				  {
					  $scope.generatepiGraph(data[i].piechart,'piechart');
				  }

				}


			}).error(function() {
				$scope.showgraph = false;

			});



	}
	$scope.refreshResult_V2 = function()
	{
		var d = new Date($scope.fromdate);
		var dto = new Date($scope.todate);
		//var d = new Date();

		// Start of new code 25-Sep
		var fromdate = d.getFullYear()  + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " +
		("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":"+ ("0" + d.getSeconds()).slice(-2);

		var todate = dto.getFullYear()  + "-" + ("0"+(dto.getMonth()+1)).slice(-2) + "-" + ("0" + dto.getDate()).slice(-2) + " " +
		("0" + dto.getHours()).slice(-2) + ":" + ("0" + dto.getMinutes()).slice(-2) + ":"+ ("0" + dto.getSeconds()).slice(-2);
		// End of new code 25-Sep

		var fromto_date_json = {
				"fromdate" : fromdate,
				"todate": todate,
				'filtertype' : $scope.ngflitertype,
				'filtervalue' : $scope.ngflitertype1,
				"model":$scope.selectmodel,
                "source":"101"

			}
			$http.post('http://ec2-52-55-236-26.compute-1.amazonaws.com:18098/analysis',fromto_date_json, {
				headers : {
					'Content-Type' : 'application/json',
				}

			}).success(function(data) {
				$scope.showgraph = true;
				for(var i=0;i<data.length;i++)
				{
					console.log(data[i].barchart);
				  if(data[i].barchart)
				  {
					  $scope.generateVGraph(data[i].barchart,'barchart1');

					  $scope.generateLineGraph(data[i].barchart,'linechart1');
				  }
				  else
				  {
					  $scope.generatepiGraph(data[i].piechart,'piechart1');
				  }

				}


			}).error(function() {
				$scope.showgraph = false;

			});



	}
	//$scope.refreshSentiment_Data();
  // data visu

  // feedback
  $scope.feedbackData = function()
  {
    $http.get('http://ec2-52-55-236-26.compute-1.amazonaws.com:18098/sentiment', {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {
                    console.log(""+JSON.stringify(data));
				  $scope.resultDataVisualList = data;

			}).error(function() {
				$scope.showgraph = false;

			});


  }
  $scope.feedbackData();


    $scope.piplineDetails  =  function(piplineid)
    {
       $state.go('transformation',{'id':piplineid});
    }
    $scope.getAllPiplinelist = function(){
        customModelDashboardService.getFeaturePipline().then(function(response){
            if(response.data)
            {
               // $scope.pipelinelist = response.data.data;
              //console.log("dd"+JSON.stringify(response.data));
              // var data =  response.data.data;
                for(var i=0;i<response.data.length;i++)
                {
                 //console.log("dd"+JSON.stringify(data[i]));
                 $scope.pipelinelist.push(response.data[i]);
                }
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
    $scope.getAllPiplinelist()
         $scope.piplinedbclick = function(pid)
       {
         //console.log("testin ::;:"+id);
         $state.go('transformation',{'id':pid});

       }
       $scope.showhidedeails = false;
       $scope.showlist = true;
        $scope.piplineJobdbclick = function(pjobid)
       {
         //console.log("testin ::;:"+id);
        $scope.showhidedeails = true;
        $scope.showlist = false;
         $scope.getPiplineJobDetailsById(pjobid);

       }
       $scope.piplinejoblist =  function()
       {
          $scope.showhidedeails = false;
         $scope.showlist = true;
          $scope.getPiplineJob();
       }
        $scope.getPiplineJob = function(){
         $scope.pipelineJob = [];
        customModelDashboardService.getPiplinejobs().then(function(response){
            if(response.data)
            {
               // $scope.pipelinelist = response.data.data;
              //console.log("dd"+JSON.stringify(response.data));
              // var data =  response.data.data;
                for(var i=0;i<response.data.length;i++)
                {
                 //console.log("dd"+JSON.stringify(data[i]));
                 $scope.pipelineJob.push(response.data[i]);
                }
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
     $scope.getPiplineJob();

     $scope.getPiplineJobDetailsById = function(id){
        // $scope.pipelineJob = [];
        customModelDashboardService.getPiplinejobsDetailsByID(id).then(function(response){
            if(response.data)
            {
                $scope.xstageDetails = response.data;
               // PiplineJobDetails

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
    $scope.getStageconfiglist = function()
  {
   $scope.stagecfgData = [];
    $http.get('http://localhost:18098/stages', {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {
                   for(var i=0;i<data.length;i++)
                   {
                     $scope.stagecfgData.push(data[i]);
                   }


			}).error(function() {
				$scope.showgraph = false;

			});


  }
  $scope.getStageconfiglist();
  $scope.pipjobRunButton = function()
  {

  }


}];