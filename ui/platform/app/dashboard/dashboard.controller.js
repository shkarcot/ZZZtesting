module.exports = ['$scope', '$state', '$rootScope','entitiesService','config','resourceServices',
function($scope, $state,$rootScope,entitiesService,config,resourceServices) {
	'use strict';
	  var vm = this;
	  $rootScope.currentState = 'dashboard';
	  $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      var userData=localStorage.getItem('userInfo');
      $scope.solution_name = localStorage.getItem('solutionName');
      userData=JSON.parse(userData);
      vm.sess_id = userData.sess_id;
      vm.username = userData.username;
      //$scope.solutionId=userData.user.solution_id;
      var windowsize=window.innerWidth;
      $scope.windowWidth=window.innerWidth;
      $scope.windowHeight=window.innerHeight;
      $scope.config = config;
      $scope.windowWidth=$scope.windowWidth-($scope.windowWidth*15/100);
      $scope.windowHeight=$scope.windowHeight-($scope.windowHeight*30/100);
      $scope.dicList = [];
      $scope.dbSpinner=false;

      $scope.logout =function(){

            localStorage.clear();
            window.location.href = "http://"+ location.host+"/logout";
        };

        $scope.goTologging = function(){
            $state.go('app.logging');
        }
        $scope.goToAdapt = function(){
            $state.go('app.adapt');
        }


      $(".navigationHeight").height($(window).height()-215);
      $('#tree1').width($scope.windowWidth);
      $('#tree1').height($scope.windowHeight);
      $scope.consEntityObj={};
     /* angular.forEach(entitiesList.data,function(value,index){
          var obj={"solution_id": userData.user.solution_id,"entity_name": value.entity_name};
          entitiesService.syncLearnedAttributes({'obj':obj,'sess_id':userData.sess_id}).then(function(result){
            if(result.data.status=='success'){
              //result.data.entity={"entity_synonym": ["men", "women"], "_id": "598ad2327a1c11001eae1599", "solution_id": "_test", "entity_name": "person", "is_published": true, "created_ts": "2017-08-09 09:13:22", "attributes": [{"type": "string", "key_name": "color", "synonym": [""]}, {"type": "numeric", "key_name": "age", "synonym": [""]}, {"type": "string", "key_name": "learned_attribute", "corpus": null, "entity_name": "", "synonym": [], "is_learned_attribute": true}], "request_id": "faf4617e-8cf9-4535-bcdc-747f21d14a46"};

              if(result.data.entity != undefined){
                angular.forEach(result.data.entity.attributes,function(value,idx){
                   if(value.is_learned_attribute== true){
                    //$scope.consEntityObj["attributes"]=value);
                    entitiesList.data[index].attributes.push(value);
                   }
                });
              }
            }
            console.log($scope.consEntityObj);
          });

      });*/
      //console.log(JSON.stringify($scope.entities));
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $(window).scrollTop(0);

      var chart = c3.generate({
        bindto : '#chart',
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250]
            ],
            type: 'bar',
            colors: {
                data1: '#8fd3cd'
            },
        }
      });
      var areachart = c3.generate({
        bindto :'#areachart',
        data: {
            x: 'x',
            columns: [
                ['x', 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ],
                ['data1', 30, 200, 100, 400, 150, 250, 400],
                ['data2', 830, 1200, 1100, 1400, 1150, 1250, 1500],
            ]
        },
        axis: {
          x: {
            padding: {
              left: 0,
              right: 0,
            }
          },
          y: {
            padding: {
              bottom: 0,
            }
          }
        },
        regions: [
            {axis: 'x', start:11, end: 12, class: 'region1'},
            {axis: 'x', start:12,end: 13, class: 'region2'},
            {axis: 'x', start:13,end: 14, class: 'region1'},
            {axis: 'x',start:14,end: 15, class: 'region2'},
            {axis: 'x', start:15,end: 16, class: 'region1'},
            {axis: 'x', start:16,end: 17, class: 'region2'},
            {axis: 'x', start:17,end: 18, class: 'region1'},
            {axis: 'x', start:18,end: 19, class: 'region2'},
            {axis: 'x', start:19,end: 20, class: 'region1'},
            {axis: 'x', start:21,end: 22, class: 'region2'},
            {axis: 'x', start:23, class: 'region1'}
        ]
      });
      var linechart = c3.generate({
          bindto :'#linechart',
          data: {
              columns: [
                  ['data1', 10],
                  ['data2', 15],
                  ['data3', 20],
                  ['data4', 25],
                  ['data5', 30]
              ],
              type: 'pie'
          },
          axis: {
            x: {
              padding: {
                left: 0,
                right: 0,
              }
            },
            y: {
              padding: {
                bottom: 0,
              }
            }
          },
          pie: {
              label: {
                  format: function (value, ratio, id) {
                      return d3.format('')(value);
                  }
              }
          }
      });
      var gridchart = c3.generate({
          bindto :'#gridchart',
          data: {
              columns: [
                  ['sample', 30, 200, 100, 400, 150, 250, 120, 200]
              ]
          },
          axis: {
            x: {
              padding: {
                left: 0,
                right: 0,
              }
            },
            y: {
              padding: {
                bottom: 0,
              }
            }
          },
          grid: {
              x: {
                  show: true
              },
              y: {
                  show: true
              }
          }
      });

   $scope.generateEntityGraph = function(divId,width,height){
      $scope.entityList=[];
      $scope.attributeList={};
      $scope.object = $scope.entities;
      $scope.graph={"mode":"NORMAL","nodes":[],"links":[]};
      var i=0;
      var flag = false;
      angular.forEach($scope.object,function(value,keys){
          $scope.graph.nodes.push({
                 "size": 70,
                "score": 0,
                "id": value.entity_name,
                "type": "circle",
                "category": "entity"
          });
          i++;
          $scope.entityList={"id":value.entity_name};
          var srcId = $scope.graph.nodes.length-1;
          angular.forEach(value.attributes,function(val,key1){
             if(val.is_learned_attribute != undefined){
               flag = true;
             }
             else{
               flag = false;
             }
             if(i==0){
                $scope.graph.links.push({"source":i,"target":$scope.graph.nodes.length});
             }
             else{
                $scope.graph.links.push({"source": srcId,"target":$scope.graph.nodes.length});
             }
             $scope.graph.nodes.push({
                 "size": 40,
                "score": 0.5,
                "id": val.key_name,
                "type": "square",
                "category": "attribute",
                "entityName": val.entity_name,
                "is_learned_attribute": flag
             });
          });
          i++;
      });

      for(var i=0;i<$scope.graph.links.length;i++){
         for(var j=0;j<$scope.graph.links.length;j++){
            if(i!=j){
                if($scope.graph.nodes[$scope.graph.links[i].target].id == $scope.graph.nodes[$scope.graph.links[j].target].id){
                   $scope.graph.links[j].target = $scope.graph.links[i].target;
                }
            }
         }
      }
      var modifiedlinks = [];
      for(var k=0;k<$scope.graph.links.length;k++){
         if($scope.graph.nodes[$scope.graph.links[k].target].category == "attribute"){
           for(var j=0;j<$scope.graph.links.length;j++){
              if($scope.graph.nodes[$scope.graph.links[j].source].id == $scope.graph.nodes[$scope.graph.links[k].target].id){
                 $scope.graph.nodes[$scope.graph.links[k].target].extraAttrib = true;
                 modifiedlinks.push({"source": $scope.graph.links[k].source,"target": $scope.graph.links[j].source});
              }
           }
         }
      }

      for(var i=0;i<modifiedlinks.length;i++){
         $scope.graph.links.push(modifiedlinks[i]);
      }

      var w = width;
      var h = height;

      var keyc = true, keys = true, keyt = true, keyr = true, keyx = true, keyd = true, keyl = true, keym = true, keyh = true, key1 = true, key2 = true, key3 = true, key0 = true;

      var focus_node = null, highlight_node = null;

      var text_center = false;
      var outline = false;

      var min_score = 0;
      var max_score = 1;

      var color = d3.scale.linear()
        .domain([min_score, (min_score+max_score)/2, max_score])
        .range(["lime", "yellow", "red" ]);

      var highlight_color = "blue";
      var highlight_trans = 0.1;

      var size = d3.scale.pow().exponent(1)
        .domain([1,100])
        .range([8,24]);

      var force = d3.layout.force()
        .linkDistance(100)
        .charge(-300)
        .size([w,h]);

      var default_node_color = "#ccc";
      //var default_node_color = "rgb(3,190,100)";
      var default_link_color = "#ccc";
      var nominal_base_node_size = 8;
      var nominal_text_size = 10;
      var max_text_size = 24;
      var nominal_stroke = 1.5;
      var max_stroke = 4.5;
      var max_base_node_size = 36;
      var min_zoom = 0.1;
      var max_zoom = 7;
      var svg = d3.select(divId).append("svg");
      var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom]);
      var g = svg.append("g");
      svg.style("cursor","move");

      //d3.json("/js/nodes.json", function(error, graph) {
      var graph=$scope.graph;
      var linkedByIndex = {};
          graph.links.forEach(function(d) {
        linkedByIndex[d.source + "," + d.target] = true;
          });

        function isConnected(a, b) {
              return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
          }

        function hasConnections(a) {
          var s = [];
          if(a.extraAttrib != undefined){
              return false;
          }
          else{
              for (var property in linkedByIndex) {
                  s = property.split(",");
                  if ((s[0] == a.index || s[1] == a.index))
                    return true;
              }
          }
        return false;
        }

        force
          .nodes(graph.nodes)
         .links(graph.links)
          .start();

        svg.append("defs").append("marker")
              .attr("id", "arrow-head")
              .attr("viewBox", "0 -5 10 10")
              .attr("refX", 65)
              .attr("refY", 0)
              .attr("markerWidth", 5)
              .attr("markerHeight", 5)
              .attr("orient", "auto")
              .append("path")
              .attr("fill", "#666")
              .attr("stroke", "#666")
              .attr("stroke-width", "1px")
              .attr("d", "M0,-5L10,0L0,5Z");

        var link = g.selectAll(".link")
          .data(graph.links)
          .enter().append("line")
          .attr("class", "link")
          .attr("d", linkArrow)
          .style("display",function(d){
             if(d.target.extraAttrib == undefined)
                return "block";
             else
                return "none";
          })
          .attr("marker-start", function(d) { return d.label === "lives" ? "url(#tail-crossed)" : "none"; })
          .attr("marker-end", function(d) { return d.label === "mother" || d.label === "father" ? "url(#hollow-head)" : "url(#arrow-head)"; })
        .style("stroke-width",nominal_stroke)
        .style("stroke", function(d) {
        if (isNumber(d.score) && d.score>=0) return color(d.score);
        else return default_link_color; });

        var node = g.selectAll(".node")
          .data(graph.nodes)
          .enter().append("g")
          .attr("class", "node")
          .call(force.drag);

        node.on("dblclick.zoom", function(d) { d3.event.stopPropagation();
          var dcx = (window.innerWidth/2-d.x*zoom.scale());
          var dcy = (window.innerHeight/2-d.y*zoom.scale());
          zoom.translate([dcx,dcy]);
           g.attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");
        });

        var tocolor = "fill";
        var towhite = "stroke";
        if (outline) {
          tocolor = "stroke";
          towhite = "fill";
        }

        function linkArrow(d) {
            return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
        }

        var circle = node.append("path")
              .attr("d", d3.svg.symbol()
              .size(function(d) { return Math.PI*Math.pow(size(d.size)||nominal_base_node_size,2); })
              .type(function(d) { return d.type; }))
              .style(tocolor, function(d) {
              if (isNumber(d.score) && d.score>=0) return color(d.score);
              else return default_node_color; })
                //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
              .style("stroke-width", nominal_stroke)
              .style(towhite, "white")
              .style("fill", function(d){
                     if(d.category == 'attribute'){
                       if(d.is_learned_attribute){
                         return "lime";
                       }
                       else{
                         return "rgb(255, 127, 14)";
                       }
                     }
                     else{
                       return "rgb(31, 119, 180)";
                     }
                    })
              .style("display", function(o) {
                        return hasConnections(o) ? "block" : "none";});


        var text = g.selectAll(".text")
          .data(graph.nodes)
          .enter().append("text")
          .attr("dy", ".35em")
        .style("font-size", nominal_text_size + "px")
        .style("display", function(o) {
                        return hasConnections(o) ? "block" : "none";});

          if (text_center)
           text.text(function(d) { return d.id; })
          .style("text-anchor", "middle");
          else
          text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
            .text(function(d) { return '\u2002'+d.id; });

          node.on("mouseover", function(d) {
          set_highlight(d);
          })
          .on("mousedown", function(d) { d3.event.stopPropagation();
            focus_node = d;
          set_focus(d);
          if (highlight_node === null) set_highlight(d);

        }	).on("mouseout", function(d) {
            exit_highlight();

        }	);

        d3.select(window).on("mouseup",
          function() {
              if (focus_node!==null)
              {
                focus_node = null;
                if (highlight_trans<1)
                {

              circle.style("opacity", 1);
              text.style("opacity", 1);
              link.style("opacity", 1);
            }
          }
          if (highlight_node === null) exit_highlight();
        });

        function exit_highlight()
        {
          highlight_node = null;
          if (focus_node===null)
          {
            svg.style("cursor","move");
            if (highlight_color!="white")
            {
                circle.style(towhite, "white");
              text.style("font-weight", "normal");
              link.style("stroke", function(o) {return (isNumber(o.score) && o.score>=0)?color(o.score):default_link_color;});
            }

          }
        }

        function set_focus(d)
        {
        if (highlight_trans<1)  {
//            var bbox = svg[0][0].getBBox();
//            var centerX = bbox.width * .5;
//            var centerY = bbox.height * .5;
//            var offsetX = centerX - d.px;
//            var offsetY = centerY - d.py;
//            svg.attr('transform', 'translate(' + offsetX + ',' + offsetY + ')');
            circle.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });

            text.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });

            link.style("opacity", function(o) {
                return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
            });
          }
        }

        function set_focus_filter(d)
        {
        var dummy = [];
        var dummy1 = [];
        var dummy2 = [];
        if (highlight_trans<1)  {
            for(var i=0;i<d.length;i++){
              circle.style("opacity", function(o) {
                  if(isConnected(d[i], o)){
                     dummy.push(o);
                     return 1;
                  }
                  else{
                     var flag = false;
                     for(j=0;j<dummy.length;j++){
                        if(dummy[j].id == o.id){
                           flag = true;
                           break;
                        }
                     }
                     if(flag){
                        return 1;
                     }
                     else{
                        return highlight_trans;
                     }
                  }
              });

              text.style("opacity", function(o) {
                  if(isConnected(d[i], o)){
                     dummy1.push(o);
                     return 1;
                  }
                  else{
                     var flag = false;
                     for(j=0;j<dummy1.length;j++){
                        if(dummy1[j].id == o.id){
                           flag = true;
                           break;
                        }
                     }
                     if(flag){
                        return 1;
                     }
                     else{
                        return highlight_trans;
                     }
                  }
              });

              link.style("opacity", function(o) {
                  if(o.source.index == d[i].index || o.target.index == d[i].index){
                     dummy2.push(o.source);
                     return 1;
                  }
                  else{
                     var flag = false;
                     for(j=0;j<dummy2.length;j++){
                        if(dummy2[j].id == o.source.id){
                           flag = true;
                           break;
                        }
                     }
                     if(flag){
                        return 1;
                     }
                     else{
                        return highlight_trans;
                     }
                  }
              });
            }
          }
        }


        function set_highlight(d)
        {
          svg.style("cursor","pointer");
          if (focus_node!==null) d = focus_node;
          highlight_node = d;

          if (highlight_color!="white")
          {
              circle.style(towhite, function(o) {
                        return isConnected(d, o) ? highlight_color : "white";});
              text.style("font-weight", function(o) {
                        return isConnected(d, o) ? "bold" : "normal";});
              link.style("stroke", function(o) {
                  return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score>=0)?color(o.score):default_link_color);
              });
          }
        }


        zoom.on("zoom", function() {
          var stroke = nominal_stroke;
          if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
          link.style("stroke-width",stroke);
          circle.style("stroke-width",stroke);

          var base_radius = nominal_base_node_size;
            if (nominal_base_node_size*zoom.scale()>max_base_node_size) base_radius = max_base_node_size/zoom.scale();
                circle.attr("d", d3.svg.symbol()
                .size(function(d) { return Math.PI*Math.pow(size(d.size)*base_radius/nominal_base_node_size||base_radius,2); })
                .type(function(d) { return d.type; }));

          //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
          if (!text_center) text.attr("dx", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); });

          var text_size = nominal_text_size;
            if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
            text.style("font-size",text_size + "px");

          g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });

        svg.call(zoom);
        resize();

        force.on("tick", function() {
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        });

        function resize() {
          svg.attr("width", width).attr("height", height);

          force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
             w = width;
             h = height;
        }

      function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }

      $scope.objEntity = "";
      function suggest_entitiy(term) {
        var q = term.toLowerCase().trim();
        var results = [];
        for (var i = 0; i < $scope.graph.nodes.length; i++) {
          var entity =  $scope.graph.nodes[i];
          if (entity.id.toLowerCase().indexOf(q) === 0 && entity.category == "entity"){
            entity.label = entity.id;
            entity.value = entity.id;
            results.push(entity);
          }
        }
        if(term == ""){
          circle.style("opacity", 1);
          text.style("opacity", 1);
          link.style("opacity", 1);
        }
        set_focus_filter(results);

        return results;
      }

      function select(selected_item){
        console.log(selected_item);
        set_focus(selected_item);
      }

      $scope.autocomplete_entitiy = {
        suggest: suggest_entitiy,
        on_select: select
      };
   };

   function toFormatDate(date){
       var date = new Date(date);
       var year = date.getFullYear();
       var month = date.getMonth()+1;
       var dt = date.getDate();

       if (dt < 10) {
         dt = '0' + dt;
       }
       if (month < 10) {
         month = '0' + month;
       }
       return dt+'/'+month+'/'+year;
   }

//   $(function() {
//      $scope.entities.sort(function(a,b) {
//          return new Date(a.created_ts).getTime() - new Date(b.created_ts).getTime()
//      });
//      console.log($scope.entities);
//      $( "#slider-range" ).slider({
//        range: true,
//        min: new Date($scope.entities[8].created_ts).getTime() / 1000,
//        max: new Date($scope.entities[$scope.entities.length-1].created_ts).getTime() / 1000,
//        step: 86400,
//        values: [ new Date($scope.entities[8].created_ts).getTime() / 1000, new Date($scope.entities[$scope.entities.length-1].created_ts).getTime() / 1000 ],
//        start: function(event, ui){
//           $(ui.handle).find('.ui-slider-tooltip').fadeIn();
//        },
//        slide: function( event, ui) {
//          $( "#date1" ).html(new Date(ui.values[ 0 ] *1000).toDateString());
//          $( "#date2" ).html(new Date(ui.values[ 1 ] *1000).toDateString());
//          $(ui.handle).find('.ui-slider-tooltip').text(new Date(ui.value *1000).toDateString());
//        },
//        stop: function( event, ui ) {
//          var startDate = toFormatDate(new Date(ui.values[0]*1000).toISOString());
//          var endDate = toFormatDate(new Date(ui.values[1]*1000).toISOString());
//          $scope.checkForDateRange(startDate,endDate);
//        },
//        create: function( event, ui ) {
//            var tooltip = $('<div class="ui-slider-tooltip" />').css({
//                position: 'absolute',
//                top: '-25px',
//                left: '-25px',
//                width: '120px',
//                background: 'rgb(31, 119, 180)',
//                color: 'white'
//            });
//            $(event.target).find('.ui-slider-handle').append(tooltip);
//
//            // get handles and set up values
//            var firstHandle  = $(event.target).find('.ui-slider-handle')[0];
//            var secondHandle = $(event.target).find('.ui-slider-handle')[1];
//            firstHandle.firstChild.innerText = new Date(new Date($scope.entities[8].created_ts).getTime()).toDateString();
//            secondHandle.firstChild.innerText = new Date(new Date($scope.entities[$scope.entities.length-1].created_ts).getTime()).toDateString();
//        }
//      });
//      $( "#date1" ).html( (new Date($( "#slider-range" ).slider( "values", 0 )*1000).toDateString()));
//      $( "#date2" ).html( (new Date($( "#slider-range" ).slider( "values", 1 )*1000).toDateString()));
//   });



   $scope.checkForDateRange = function(dt1,dt2){
      var d1 = dt1.split("/");
      var d2 = dt2.split("/");
      $scope.entities = [];
      angular.forEach($scope.entityCopy,function(value,key){
          var dateCheck = toFormatDate(value.created_ts);
          var c = dateCheck.split("/");
          var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);
          var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
          var check = new Date(c[2], parseInt(c[1])-1, c[0]);
          if(check > from && check < to){
            $scope.entities.push(value);
          }
      });
      $("#graphChartForEntity").empty();
      $scope.generateEntityGraph("#graphChartForEntity",$scope.dialogBoxWidth, $scope.windowHeight);
   };

   $scope.entityGraphWidth = $("#entityGraph").width();
   $scope.graphHeight = window.innerHeight -238;

   $scope.updateSvg1 = function(){
      $scope.entityCopy = angular.copy($scope.entityCopy);
      setTimeout(function(){
          $scope.dialogBoxWidth = $("#modalGraphwidth").width();
          $("#graphChartForEntity").empty();
          $scope.generateEntityGraph("#graphChartForEntity",$scope.dialogBoxWidth, $scope.windowHeight);
      }, 500);
   };
   $scope.showGraph=true;
   $scope.getEntitiesList = function(){
      $scope.dbSpinner=true;
      entitiesService.getEntities({"sess_id":vm.sess_id}).then(function(response){
         if(response.data.domain_object.length>0)
            $scope.showGraph=true;
         else
         $scope.showGraph=false;

         $scope.dbSpinner=false;
         $scope.entities = [];
         $scope.entities = response.data.domain_object;
         $scope.entityCopy = angular.copy($scope.entities);
         $scope.generateEntityGraph("#entityGraph",$scope.entityGraphWidth, $scope.graphHeight);
      });
   };
   $scope.getEntitiesList();

   $scope.getDictionaryList = function(){
       resourceServices.getDictionary({"sess_id":vm.sess_id}).then(function(response){
             $scope.dicList = response.data.data;
       });
   };
   //$scope.getDictionaryList();
}];