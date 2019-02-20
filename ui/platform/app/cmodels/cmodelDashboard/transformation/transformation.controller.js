module.exports = ['$scope','entitydata','$rootScope','ngDialog','Upload','$state','$window','$location','$timeout','$http','$uibModalInstance','transformationService', function($scope,entitydata,$rootScope,ngDialog,Upload,$state,$window,$location,$timeout,$http,$uibModalInstance,transformationService) {
	'use strict';

    	var vm = this;
		vm.clear = clear;
		vm.piplineObj = entitydata;
		$scope.finderloader = false;
		//$scope.jsonElements = [];
		$scope.dataGraph = [
{
	"Letter": "A",
	"Freq": 20
},
{
	"Letter" : "B",
	"Freq": 12
},
{
	"Letter" : "C",
	"Freq": 47
},
{
	"Letter" : "D",
	"Freq": 34
},
{
	"Letter" : "E",
	"Freq" : 54
},
{
	"Letter" : "F",
	"Freq" : 21
},
{
	"Letter" : "G",
	"Freq" : 57
},
{
	"Letter" : "H",
	"Freq" : 31
},
{
	"Letter" : "I",
	"Freq" : 17
},
{
	"Letter" : "J",
	"Freq" : 5
},
{
	"Letter" : "K",
	"Freq" : 23
},
{
	"Letter" : "L",
	"Freq" : 39
},
{
	"Letter" : "M",
	"Freq" : 29
},
{
	"Letter" : "N",
	"Freq" : 33
},
{
	"Letter" : "O",
	"Freq" : 18
},
{
	"Letter" : "P",
	"Freq" : 35
},
{
	"Letter" : "Q",
	"Freq" : 11
},
{
	"Letter" : "R",
	"Freq" : 45
},
{
	"Letter" : "S",
	"Freq" : 43
},
{
	"Letter" : "T",
	"Freq" : 28
},
{
	"Letter" : "U",
	"Freq" : 26
},
{
	"Letter" : "V",
	"Freq" : 30
},
{
	"Letter" : "X",
	"Freq" : 5
},
{
	"Letter" : "Y",
	"Freq" : 4
},
{
	"Letter" : "Z",
	"Freq" : 2
}
];



 // console.log(data);
		function clear()
		{
			$uibModalInstance.dismiss('cancel');
		}

	// Add node to click handle .
     $scope.handleNodeClicked =  function()
	 {
         $scope.jsonElementsupdate = [];
		  var selectedNodes = $scope.chartViewModel.getSelectedNodes();
          $scope.formFields =  selectedNodes[0].data.property;

	 }


	$scope.deleteSelected = function ()
	{

		$scope.chartViewModel.deleteSelected();
		//$scope.saveNodeDataModel
	};

	$scope.gererate = function()
	{
	    console.time('start guid');
        var d = new Date().getTime();
        var uuid = 'xxx-xxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        console.timeEnd('start guid');
        return uuid;
	}

	//
	// Create the view-model for the chart and attach to the scope.

	//
	//$scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
	//$scope.newNodeDataModel = '';
	$scope.saveNodeDataModel = [];
	$scope.createNodeJson = [];
	 $scope.flowchartdraw = function(dataValue)
    {
      $scope.datav = dataValue;
      $scope.rngESUS = $scope.gererate();
      var keys= [];
       angular.forEach($scope.jsonElements, function(value, key) {

             angular.forEach(value, function(value1, key1) {
             for(var i=0;i<value1.length;i++)
             {
               if(value1[i].classId == $scope.datav)
               {
                  // $scope.data  = $scope.jsonElements[i].portattrib.id
                  console.log(value1[i].stageInfo);

                  $scope.datainfo = JSON.parse(value1[i].stageInfo);
                  $scope.datainfo.nodes[0].name = $scope.datainfo.nodes[0].name+' '+ $scope.rngESUS;
                  $scope.datainfo.nodes[0].id = $scope.rngESUS;
                  $scope.datainfo.nodes[0].x = $scope.datainfo.nodes[0].x+45;
                   $scope.datainfo.nodes[0].y = $scope.datainfo.nodes[0].y+45;
               $scope.data  = angular.copy($scope.datainfo.nodes[0]);
             // $scope.chartViewModel.push({'property':$scope.datainfo.nodes[0].property});
               $scope.chartViewModel.addNode($scope.data);
               $scope.saveNodeDataModel.push({'nodes': $scope.data,'property':$scope.datainfo.nodes[0].property});


            // $scope.jsonElements[i].nodes[0].name = $scope.jsonElements[i].nodes[0].name+' '+ $scope.rngESUS;
            // $scope.jsonElements[i].nodes[0].id = $scope.rngESUS;
            // $scope.jsonElements[i].nodes[0].x = $scope.jsonElements[i].nodes[0].x+45;
             //$scope.jsonElements[i].nodes[0].y = $scope.jsonElements[i].nodes[0].y+45;
           //  $scope.data  = angular.copy($scope.jsonElements[i].nodes[0]);
              //$scope.chartViewModel.push({'property':$scope.jsonElements[i].property});
            // $scope.chartViewModel.addNode($scope.data);
             //$scope.saveNodeDataModel.push({'nodes': $scope.data,'property':$scope.jsonElements[i].property});

               }

             }


        });
        });





    }

    $scope.jsonGenerater = function()
    {
        $scope.savenodeJsonModel = [];
       $scope.arraynodes = [];
       $scope.arrayproprty = [];
       $scope.arrayconnn = [];
                for(var i=0;i<$scope.chartViewModel.data.nodes.length;i++)
              {
                      for(var j=0;j<$scope.saveNodeDataModel.length;j++)
                  {
                     if($scope.chartViewModel.data.nodes[i].name == $scope.saveNodeDataModel[j].nodes.name)
                     {
                       $scope.arraynodes.push($scope.chartViewModel.data.nodes[i]);
                     }
                  }

              }
                for(var k=0;k<$scope.chartViewModel.data.connections.length;k++)
              {
                $scope.arrayconnn.push($scope.chartViewModel.data.connections[k]);
              }
             $scope.savenodeJsonModel.push({'nodes':$scope.arraynodes,'connections': $scope.arrayconnn});
             return  $scope.savenodeJsonModel;

    }
    $scope.saveDrawNode =  function()
    {
       //console.log("hhh");
      var jsongenerate =  $scope.jsonGenerater();
      //console.log("json::generateing::"+JSON.stringify(jsongenerate));
      //vm.piplineObj.id =  '';
      vm.piplineObj.stageInfo = JSON.stringify(jsongenerate);
      $http.post('http://localhost:18098/pipe',vm.piplineObj, {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

			   $uibModalInstance.dismiss('cancel');
               $.UIkit.notify({
                                   message : "Save Successfully",
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                                });




			}).error(function() {
				//AlertService.error('Server Error:Please contact to admin');

			});

    }
//    $scope.SaveData = function()
//    {
//      console.log("save::data:11"+JSON.stringify($scope.formFields));
//    }

    $scope.piplineDetails = function()
    {
         // console.log("eventdd::"+$scope.piplineId.id);
			$http.get('http://localhost:18098/pipes/'+vm.piplineObj.id, {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {

           // console.log("pipline: ::"+JSON.stringify(data));

             vm.piplineObj = data;
             console.log("pipline: ::"+JSON.stringify(vm.piplineObj));
             var jsonstrin = JSON.parse(data.stageInfo);
             if(Object.keys(jsonstrin).length != '0')
              {
                   var chartdata = jsonstrin[0].nodes;
                  for(var i=0;i<chartdata.length;i++)
                  {
                    $scope.saveNodeDataModel.push({'nodes':chartdata[i],'property':chartdata[i].property});
                  }
                   $scope.chartViewModel = new flowchart.ChartViewModel(jsonstrin[0]);
              }
              else
              {
                    var chartDataModel = [{	nodes: [],connections: []	}];
                    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel[0]);

              }

			}).error(function() {
				//AlertService.error('Server Error:Please contact to admin');

			});

    }
     $scope.piplineDetails();
     $scope.ShowContextMenu = function()
  {
     //alert('hh');
    //list.append('clicked');
  }
     $scope.piplineStages = function()
    {
       $scope.jsonElements = [];
       $scope.finderloader = true;
         // console.log("eventdd::"+$scope.piplineId.id);
			$http.get('http://localhost:18098/stagesgrp', {
				headers : {
					'Content-Type' : 'application/json'
				}

			}).success(function(data) {
               $scope.finderloader = false;
             for(var i=0; i<data.length;i++)
             {
                $scope.jsonElements.push(data[i]);
             }


			}).error(function() {
				//AlertService.error('Server Error:Please contact to admin');

			});

    }
    $scope.piplineStages();
   $scope.dataView = function()
   {
     var selectedNodes = $scope.chartViewModel.getSelectedNodes();
     console.log("data view::::"+selectedNodes);
      $('#dataModal').modal('show');
       $scope.generateLineGraph();

   }
   $scope.generateLineGraph = function()
	{
		var chart = c3.generate({
		    size: {
                height: 500,
                width: 480
            },
	        bindto:'#graphid',
	        data: {
	        	json: $scope.dataGraph,
		        keys: {
		            value: ['letter', 'Freq']
		        },
	            type: 'line'

	        }

	     });
	}



}];