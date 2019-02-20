module.exports = ['$scope','$rootScope','ngDialog','$state','$stateParams','$location','$anchorScroll','entityLinkingService','processDetailsServices','documentsListService','$window','$sce',
function($scope,$rootScope,ngDialog,$state,$stateParams,$location,$anchorScroll,entityLinkingService,processDetailsServices,documentsListService,$window,$sce) {
	'use strict';

	 var vm = this;
     window.scrollTo(0,0);
     $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
     vm.sess_id= $scope.loginData.sess_id;
     vm.loginDataObj = $scope.loginData;
     $scope.showDomainTab = false;
     $scope.rightPanelHeight  =$window.innerHeight-150;
     $scope.height = $window.innerHeight - 96;
     $scope.pdfHeight = $window.innerHeight - 130;
     $scope.elementHeight = $window.innerHeight - 240;
     $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
     $scope.getDemo = false;
     $rootScope.inSolution = true;
     $scope.showNavigation = false;
     $scope.entitiesData=[];
     $scope.rowHighlight = [];
     $scope.rowHighlightAttr = [];
     $scope.currentDocId = $stateParams.id;
     $scope.newNode = '';
     $scope.coordinatesDisplay=[];
     $scope.checkObj = {};
     $scope.checkObj.accept = true;
     $scope.checkObj.correct = true;
     $scope.checkObj.review = true;
     vm.showPopup = {};
     vm.showPopup.popup = false;
     vm.showPopupConfirm = false;
     vm.annotatinclickfromjs = false;
     $scope.listOfNewAttributes = [];
     $scope.displayNewEntity = false;
     $scope.displayNewAttribute = false;
     $scope.currentQueueName = localStorage.getItem("queueName");
     $scope.parentfilename = localStorage.getItem("parentfilename");
     /*  extraction code starts */

    var pdfjsLib = window['PDFAnnotate'];
    const { UI } = pdfjsLib;
    var documentId = '';
    vm.pdfSrc = "";
    var PAGE_HEIGHT;
    var RENDER_OPTIONS = {
        documentId,
        pdfDocument: null,
        scale: parseFloat(localStorage.getItem(`${documentId}/scale`), 10) || 0.25,
        rotate: parseInt(localStorage.getItem(`${documentId}/rotate`), 10) || 0
    };
    //var anno = document.getElementById("annotationdiv");
    //anno.innerHTML = '';
    $scope.annotations = [];

    //pdfjsLib.setStoreAdapter(new pdfjsLib.LocalStoreAdapter());
    function getAnnotations(documentId) {
        return $scope.annotations;
    }


    function findAnnotation(documentId, annotationId) {
        var index = -1;
        var annotations = getAnnotations(documentId);
        for (var i = 0, l = annotations.length; i < l; i++) {
            if (annotations[i].uuid === annotationId) {
                index = i;
                break;
            }
        }
        return index;
    }

    $scope.MyStoreAdapter = new pdfjsLib.StoreAdapter({
        getAnnotations(documentId, pageNumber) {
            return new Promise((resolve, reject) => {
                var annotations = getAnnotations(documentId).filter((i) => {
                    return i.page === pageNumber && i.class === 'Annotation';
                });

                resolve({
                    documentId,
                    pageNumber,
                    annotations
                });
            });
        },

        getAnnotation(documentId, annotationId) {
            var annotation;
            for (var i = 0, l = $scope.annotations.length; i < l; i++) {
                if ($scope.annotations[i].uuid === annotationId) {
                    annotation = $scope.annotations[i];
                    break;
                }
            }

            return Promise.resolve(annotation);
            //return  Promise.resolve(getAnnotations(documentId)[findAnnotation(documentId, annotationId)]);
        },


        // getAnnotation(documentId, annotationId) {
        //     console.log("getannotation");
        //     var anno;
        //     for (var i = 0; i < $scope.annotations.length; i++) {
        //         if ($scope.annotations[i].uuid == annotationId)
        //             anno = $scope.annotations[i];
        //     }
        //     return Promise.resolve(anno);
        // },

        addAnnotation(documentId, pageNumber, annotation) {
            annotation.class = 'Annotation';
            annotation.uuid = $scope.uniqueIdGenerator();
            annotation.page = pageNumber;

            // var annotations = getAnnotations(documentId);
            //$scope.annotations.push(annotation);
            // updateAnnotations(documentId, annotations);
            let existingnode = {};
            if ($scope.updatewithnewannotationNode == true) {
                existingnode = $scope.updannotation;
                existingnode.x = annotation.x;
                existingnode.y = annotation.y;
                existingnode.width = annotation.width;
                existingnode.height = annotation.height;
                existingnode.page_num = annotation.page;
                existingnode.page = annotation.page;

                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + existingnode.uuid + "']")
                allrect.forEach(function (rect) {
                    //rect.setAttribute("stroke", "yellow");
                    rect.remove();
                });


                UI.disableEdit();
                //vm.updateNode(existingnode, existingnode.typeoffield);

            } else if (vm.newcell) {
                console.log(vm.newcelldata);
                annotation.uuid = vm.newcelldata.temp_id;
                existingnode = annotation;
                vm.adddatatoTable(existingnode);
                $scope.annotations.push(existingnode);
            }
            else {
                vm.addnewAnnotation(annotation);
                existingnode = annotation;
            }
            return new Promise((resolve, reject) => {

                resolve(existingnode);
            });


        },

        editAnnotation(documentId, pageNumber, annotation) {
            console.log("for first staart", Date.now());
            vm.selectedNode = annotation;
            for (var i = 0; i < $scope.annotations.length; i++) {
                if ($scope.annotations[i].uuid == annotation.uuid) {
                    $scope.annotations[i] = annotation;
                    break;
                }
            }
            console.log("for first done", Date.now());
            let p = document.getElementById("pdf-annotate-edit-overlay");
            if (p) {
                p.remove();
            }
            //vm.updateNode(annotation, annotation.typeoffield);

            return new Promise((resolve) => {
                resolve(true);
            })

            // return new Promise((resolve) => {
            //     console.log("for resolve start", Date.now());
            //     resolve(annotation);
            //     //UI.disableEdit();

            //     console.log("for resolve done", Date.now());
            // });




        },

        deleteAnnotation(documentId, annotationId) {


            // for (var i = 0; i < $scope.annotations.length; i++) {
            //     if ($scope.annotations[i].uuid == annotationId) {
            //         vm.editablenode($scope.annotations[i]);
            //         break;
            //     }
            // }
            // enableDrawRect("area");
            // return false;

            var index = -1;
            for (var i = 0; i < $scope.annotations.length; i++) {
                if ($scope.annotations[i].uuid == annotationId) {
                    index = i;
                    enableDrawRect("area");
                    vm.editablenode($scope.annotations[i]);
                    break;
                }
            }
            if (index > -1) {
                $scope.annotations.splice(index, 1);
            }

            return new Promise((resolve, reject) => {
                resolve(true);
            });



        },

        addComment(documentId, annotationId, content) {

        },

        deleteComment(documentId, commentId) {

        },
        getComments(documentId, annotationId) {
            var comments = [];
            return new Promise((resolve) => {
                resolve(comments);
            })
        }
    });

    pdfjsLib.setStoreAdapter($scope.MyStoreAdapter);


    PDFJS.workerSrc = '/app/sharedPDFJS/pdf.worker.js';


    // Render stuff
    var NUM_PAGES = 0;

    function handleannotationrightclick(e, node) {
        vm.selectedNode = node;
        var uuid = e.uuid; //(e.toElement.innerHTML).split("__")[0];
        var pageNum = e.page; //(e.toElement.innerHTML).split("__")[1];
        var target = document.querySelector("[data-pdf-annotate-id='" + uuid + "']");
        $scope.existtarget = target;
        let scalerender = RENDER_OPTIONS.scale * 100;
        let scaleheight = ((scalerender * e.y) / 100);
        let scalewidth = ((scalerender * e.x)/100);
        $scope.current_page = pageNum;
        document.getElementById('content-wrapper').scrollTop = ((parseInt(pageNum) - 1) * PAGE_HEIGHT) + scaleheight ;
        document.getElementById('content-wrapper').scrollLeft = scalewidth ;

        UI.enableEdit();
        vm.annotatinclickfromjs = true;
        UI.fireEvent('annotation:click', target);
        setTimeout(function(){
         vm.annotatinclickfromjs = false;
        },2000);
    }
     vm.render = function() {
        document.getElementById('loadingpdf').style.display = 'block';
        PDFJS.getDocument(RENDER_OPTIONS.documentId).then((pdf) => {

            RENDER_OPTIONS.pdfDocument = pdf;

            var viewer = document.getElementById('viewer');
            viewer.innerHTML = '';
            NUM_PAGES = pdf.pdfInfo.numPages;
            $scope.no_of_pages = NUM_PAGES;
            $scope.$apply();
            for (var i = 0; i < NUM_PAGES; i++) {
                var page = UI.createPage(i + 1);
                viewer.appendChild(page);
                UI.renderPage(i + 1, RENDER_OPTIONS).then(([pdfPage, annotations]) => {
                    var viewport = pdfPage.getViewport(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate);
                    PAGE_HEIGHT = viewport.height;
                });
            }


            document.getElementById('loadingpdf').style.display = 'none';
            UI.disableEdit();

            // UI.renderPage(1, RENDER_OPTIONS).then(([pdfPage, annotations]) => {
            //     let viewport = pdfPage.getViewport(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate);
            //     PAGE_HEIGHT = viewport.height;
            // });
//
//            if (vm.selectedNode != null) {
//                setTimeout(function () {
//                    setrectColor("transparent");
//                    setHeilight(vm.selectedNode.regions[0].uuid);
//                    handleannotationrightclick(vm.selectedNode.regions[0], vm.selectedNode);
//                }, 300)
//
//            }

        });
    }

    function enableDrawRect(type) {
        switch (type) {
            case 'cursor':
                UI.enableEdit();
                break;
            case 'draw':
                UI.enablePen();
                break;
            case 'text':
                UI.enableText();
                break;
            case 'point':
                UI.enablePoint();
                break;
            case 'area':
            case 'highlight':
            case 'strikeout':
                UI.enableRect(type);
                break;
        }
    };

    function disableDrawRect(tooltype) {
        switch (tooltype) {
            case 'cursor':
                UI.disableEdit();
                break;
            case 'draw':
                UI.disablePen();
                break;
            case 'text':
                UI.disableText();
                break;
            case 'point':
                UI.disablePoint();
                break;
            case 'area':
            case 'highlight':
            case 'strikeout':
                UI.disableRect();
                break;
        }
    };

    function setrectColor(colortype) {
        var allrect = document.querySelectorAll("rect");
        allrect.forEach(function (rect) {
            if (colortype == "transparent") {
                //rect.setAttribute("stroke", colortype);
                rect.style.display = "none";
            }
            else {
                rect.style.display = "block";
            }
        });
    }

    function setHeilight(annotationid) {
        var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + annotationid + "']")
        var firstrect = false;
        allrect.forEach(function (rect) {
            if (firstrect == false) {
                rect.style.display = "block";
                firstrect = true;

                var stroke = rect.getAttribute("stroke");
                if (stroke) {
                    //rect.setAttribute("fill", stroke);
                    rect.setAttribute("stroke-width", '16px');
                    //rect.style.opacity = 0.2;
                }
            } else {
                rect.remove();
            }
        });
    }

    function setbackground() {
        var allrect = document.querySelectorAll("rect");
        allrect.forEach(function (rect) {
            var stroke = rect.getAttribute("stroke");
            if (stroke) {
                rect.setAttribute("fill", "transparent");
                rect.style.opacity = 0.6;
            }
        });
    }
    function filterRect(type, isshow) {
        var allrect = document.querySelectorAll("rect[status='" + type + "']")
        allrect.forEach(function (rect) {
            //rect.setAttribute("stroke", "transparent");
            if (isshow) {
                rect.style.display = "block";
            } else {
                rect.style.display = "none";
            }
        });
    }

    function handleZoom(scale) {
        scale = parseFloat(scale, 10);
        let rotate = 0;

        if (RENDER_OPTIONS.scale !== scale || RENDER_OPTIONS.rotate !== rotate) {
            RENDER_OPTIONS.scale = scale;
            RENDER_OPTIONS.rotate = rotate;

            localStorage.setItem(`${RENDER_OPTIONS.documentId}/scale`, RENDER_OPTIONS.scale);
            localStorage.setItem(`${RENDER_OPTIONS.documentId}/rotate`, RENDER_OPTIONS.rotate % 360);

            vm.render();
        }
    }

    vm.pdfinit = function(){

    // Text stuff
    (function () {
        var textSize;
        var textColor;

        // function initText() {
        //   var size = document.querySelector('.toolbar .text-size');
        //   [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96].forEach((s) => {
        //     size.appendChild(new Option(s, s));
        //   });

        //   setText(
        //     localStorage.getItem(`${RENDER_OPTIONS.documentId}/text/size`) || 10,
        //     localStorage.getItem(`${RENDER_OPTIONS.documentId}/text/color`) || '#000000'
        //   );

        //   initColorPicker(document.querySelector('.text-color'), textColor, function (value) {
        //     setText(textSize, value);
        //   });
        // }

        function setText(size, color) {
            var modified = false;

            if (textSize !== size) {
                modified = true;
                textSize = size;
                localStorage.setItem(`${RENDER_OPTIONS.documentId}/text/size`, textSize);
                document.querySelector('.toolbar .text-size').value = textSize;
            }

            if (textColor !== color) {
                modified = true;
                textColor = color;
                localStorage.setItem(`${RENDER_OPTIONS.documentId}/text/color`, textColor);

                var selected = document.querySelector('.toolbar .text-color.color-selected');
                if (selected) {
                    selected.classList.remove('color-selected');
                    selected.removeAttribute('aria-selected');
                }

                selected = document.querySelector(`.toolbar .text-color[data-color="${color}"]`);
                if (selected) {
                    selected.classList.add('color-selected');
                    selected.setAttribute('aria-selected', true);
                }

            }

            if (modified) {
                UI.setText(textSize, textColor);
            }
        }

        function handleTextSizeChange(e) {
            setText(e.target.value, textColor);
        }

        document.querySelector('.toolbar .text-size').addEventListener('change', handleTextSizeChange);

        // initText();
    })();

    // Pen stuff
    (function () {
        var penSize;
        var penColor;

        function initPen() {
            var size = document.querySelector('.toolbar .pen-size');
            for (var i = 0; i < 20; i++) {
                size.appendChild(new Option(i + 1, i + 1));
            }

            setPen(
                1,
                '#000000'
            );

            // initColorPicker(document.querySelector('.pen-color'), penColor, function (value) {
            //   setPen(penSize, value);
            // });
        }

        function setPen(size, color) {
            var modified = false;

            if (penSize !== size) {
                modified = true;
                penSize = size;
                document.querySelector('.toolbar .pen-size').value = penSize;
            }

            if (penColor !== color) {
                modified = true;
                penColor = color;

                var selected = document.querySelector('.toolbar .pen-color.color-selected');
                if (selected) {
                    selected.classList.remove('color-selected');
                    selected.removeAttribute('aria-selected');
                }

                selected = document.querySelector(`.toolbar .pen-color[data-color="${color}"]`);
                if (selected) {
                    selected.classList.add('color-selected');
                    selected.setAttribute('aria-selected', true);
                }
            }

            if (modified) {
                UI.setPen(penSize, penColor);
            }
        }

        function handlePenSizeChange(e) {
            setPen(e.target.value, penColor);
        }

        document.querySelector('.toolbar .pen-size').addEventListener('change', handlePenSizeChange);

        initPen();
    })();

    // Toolbar buttons
    (function () {
        var tooltype = localStorage.getItem(`${RENDER_OPTIONS.documentId}/tooltype`) || 'cursor';
        if (tooltype) {
            setActiveToolbarItem(tooltype, document.querySelector(`.toolbar button[data-tooltype=${tooltype}]`));
        }

        function setActiveToolbarItem(type, button) {
            var active = document.querySelector('.toolbar button.active');
            if (active) {
                active.classList.remove('active');

                switch (tooltype) {
                    case 'cursor':
                        UI.disableEdit();
                        break;
                    case 'draw':
                        UI.disablePen();
                        break;
                    case 'text':
                        UI.disableText();
                        break;
                    case 'point':
                        UI.disablePoint();
                        break;
                    case 'area':
                    case 'highlight':
                    case 'strikeout':
                        UI.disableRect();
                        break;
                }
            }

            if (button) {
                button.classList.add('active');
            }
            if (tooltype !== type) {
                localStorage.setItem(`${RENDER_OPTIONS.documentId}/tooltype`, type);
            }
            tooltype = type;

            switch (type) {
                case 'cursor':
                    UI.enableEdit();
                    break;
                case 'draw':
                    UI.enablePen();
                    break;
                case 'text':
                    UI.enableText();
                    break;
                case 'point':
                    UI.enablePoint();
                    break;
                case 'area':
                case 'highlight':
                case 'strikeout':
                    UI.enableRect(type);
                    break;
            }
        }

        function handleToolbarClick(e) {
            if (e.target.nodeName === 'BUTTON') {
                setActiveToolbarItem(e.target.getAttribute('data-tooltype'), e.target);
            }
        }

        document.querySelector('.toolbar').addEventListener('click', handleToolbarClick);
    })();

    // Scale/rotate
    (function () {
        function setScaleRotate(scale, rotate) {
            scale = parseFloat(scale, 10);
            rotate = parseInt(rotate, 10);

            if (RENDER_OPTIONS.scale !== scale || RENDER_OPTIONS.rotate !== rotate) {
                RENDER_OPTIONS.scale = scale;
                RENDER_OPTIONS.rotate = rotate;

                localStorage.setItem(`${RENDER_OPTIONS.documentId}/scale`, RENDER_OPTIONS.scale);
                localStorage.setItem(`${RENDER_OPTIONS.documentId}/rotate`, RENDER_OPTIONS.rotate % 360);

                vm.render();
            }
        }

        function handleScaleChange(e) {
            setScaleRotate(e.target.value, RENDER_OPTIONS.rotate);
        }

        function handleRotateCWClick() {
            setScaleRotate(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate + 90);
        }

        function handleRotateCCWClick() {
            setScaleRotate(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate - 90);
        }

        document.querySelector('.toolbar select.scale').value = RENDER_OPTIONS.scale;
        document.querySelector('.toolbar select.scale').addEventListener('change', handleScaleChange);
        document.querySelector('.toolbar .rotate-ccw').addEventListener('click', handleRotateCCWClick);
        document.querySelector('.toolbar .rotate-cw').addEventListener('click', handleRotateCWClick);
    })();

    // Clear toolbar button
    (function () {
        function handleClearClick(e) {
            if (confirm('Are you sure you want to clear annotations?')) {
                for (var i = 0; i < NUM_PAGES; i++) {
                    document.querySelector(`div#pageContainer${i + 1} svg.annotationLayer`).innerHTML = '';
                }

                localStorage.removeItem(`${RENDER_OPTIONS.documentId}/annotations`);
            }
        }
        document.querySelector('a.clear').addEventListener('click', handleClearClick);
    })();

    }



    function disableEdition(){
    setTimeout(function(){
        if(document.getElementById("pdf-annotate-edit-overlay"))
        document.getElementById("pdf-annotate-edit-overlay").remove();
        },100);

    }
    function handleAnnotationClick(target) {

        //setrectColor("transparent");
        if(vm.selectedElementFlag){
             setbackground();
             vm.selectedElementId = target.dataset.pdfAnnotateId;
             target.setAttribute("fill","#3792c2");
             target.setAttribute("fill-opactiy","0.4");
             disableEdition();

        }else{
            $scope.rowHighlight = [];
            if(!vm.annotatinclickfromjs && document.getElementsByClassName(target.dataset.pdfAnnotateId) && document.getElementsByClassName(target.dataset.pdfAnnotateId)[0]){
                document.getElementsByClassName(target.dataset.pdfAnnotateId)[0].scrollIntoView();
                var p = document.getElementsByClassName(target.dataset.pdfAnnotateId)[0];
                if(!p.closest("ol").classList.contains("in")){
                    var s = p.closest("ol").closest("li");
                    s.querySelector(".nodetoggle").click();
                };
                $scope.rowHighlight[target.dataset.pdfAnnotateId] = 'highlightClass';
                UI.disableEdit();
            }
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
            }
            disableDrawRect("area");

        }


    }

    UI.addEventListener('annotation:click', handleAnnotationClick);

    /* extractioncode ends */

    function setOrderForAnnotations(){
        var svgs = document.querySelectorAll("svg");
        for(var k=0;k<svgs.length;k++){
            var allrects = svgs[k].querySelectorAll("rect");
            var tmpRects = [];
             for(var i=0; i < allrects.length;i++){
                  tmpRects.push(allrects[i]);
             };
             var sortedRects = tmpRects.sort(function(rect1,rect2){
                return rect1.getAttribute("y") - rect2.getAttribute("y")
             });

             svgs[k].querySelectorAll("rect").forEach(function(rect){
                rect.remove();
             });

             for(var i=sortedRects.length-1;i>=0;i--){
                svgs[k].appendChild(sortedRects[i]);
             };
         }
         document.getElementById('loadingpdf').style.display = 'none';



    };

    function setOrderForSpecificTime(){
            setTimeout(function(){
                document.getElementById('loadingpdf').style.display = 'block';
                setOrderForAnnotations();
            },3000);
       };

     vm.navigatePage = function(type){

        if(type == 'next'){
           $scope.nextClass = 'nextCursor';
           var rec_num = $scope.filter_obj.current_record_no+1;
           if(rec_num < $scope.recentRecords.length){
              var prop = 'none';
              if($scope.recentRecords[rec_num].is_digital){
                    prop = 'digital';
              }
              $scope.filter_obj.current_record_no = rec_num;
              localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
              $state.go("app.review",{id:$scope.recentRecords[rec_num].doc_id, type:prop,queue:$stateParams.queue},{reload:true})
           }
           else{
              $scope.filter_obj.page_num = $scope.filter_obj.page_num+1;
              $scope.filter_obj.current_record_no = -1;
              $scope.getDocumentsListData(type);

           }
        }
        else if(type == 'prev'){
          $scope.prevClass = 'prevCursor';
          var rec_num = $scope.filter_obj.current_record_no-1;
          if(rec_num >= 0){
              var prop = 'none';
              if($scope.recentRecords[rec_num].is_digital){
                    prop = 'digital';
              }
              $scope.filter_obj.current_record_no = rec_num;
              localStorage.setItem('filterObj',JSON.stringify($scope.filter_obj))
              $state.go("app.review",{id:$scope.recentRecords[rec_num].doc_id, type:prop,queue:$stateParams.queue},{reload:true})
          }
          else{
              $scope.filter_obj.page_num = $scope.filter_obj.page_num-1;
              $scope.filter_obj.current_record_no = $scope.recentRecords.length;
              $scope.getDocumentsListData(type);

          }
        }
     };

     $scope.updateFilterObj = function(type){
          $scope.filter_obj = JSON.parse(localStorage.getItem('filterObj'));
          if($scope.filter_obj == null || $scope.filter_obj == undefined){
            $scope.showNavigation = false;
          }
          else{
            if($scope.filter_obj.hasOwnProperty('current_record_no')){
                $scope.showNavigation = true;
                $scope.recentRecords = JSON.parse(localStorage.getItem('recentRecords'));
                if( $scope.recentRecords == null ||  $scope.recentRecords == undefined){
                }else{
                  $scope.total_records =  $scope.filter_obj.totalRecords;
                  //vm.documentType = $scope.recentRecords[$scope.filter_obj.current_record_no].mime_type;
                  $scope.no_of_records =  (($scope.filter_obj.page_num-1) *$scope.filter_obj.no_of_recs) + $scope.filter_obj.current_record_no+1;
                }
            }
            else{
              $scope.showNavigation = false;
            }

          }

          vm.navigatePage(type);
     };

     $scope.updateFilterObj('none');

     if($stateParams.type.toLowerCase() != "digital"){









         $scope.rect = {
                data_color: '#337ab7',
                marker_color: '#00ad2d',
                section_color:'#FF0000',
                stroke: 5
         };

         $scope.colorCodes = {
           'orange_border':'#fb9019',
           'green_border':'#26ce3f',
           'blue_border':'#4a90e2'
         }

         vm.updateDrawer = function(type,item){
           if(item.is_accept == undefined && item.is_corrected == undefined && item.need_review == undefined){
                item.need_review = true;
                item.is_accept = false;
                item.is_corrected = false;
           }

           if(item.regions!=undefined){
                for(var i =0;i<item.regions.length;i++){
                    var obj = angular.copy(item);
                    obj.x = obj.regions[i].x1;
                    obj.width = obj.regions[i].x2 - obj.regions[i].x1;
                    obj.y = obj.regions[i].y1;
                    obj.height = obj.regions[i].y2 - obj.regions[i].y1;
                    obj.is_display = true;
                    obj.stroke = $scope.rect.stroke;
                    obj.color = $scope.colorCodes.orange_border;
                    obj.bgColor = $scope.colorCodes.orange_border;
                    if(obj.temp_id!=undefined){
                        obj.slice_id = angular.copy(obj.temp_id+i);
                        obj.slice_id = angular.copy(obj.slice_id.replace(/~/gi, "-"));
                        item.regions[i].slice_id = angular.copy(obj.temp_id+i);
                        item.regions[i].slice_id = angular.copy(item.regions[i].slice_id.replace(/~/gi, "-"));
                    }
                    if (obj.temp_id == undefined) {
                      obj.temp_id = $scope.uniqueIdGenerator();
                    }
                    item.temp_id = obj.temp_id;
                    obj.class = "Annotation";
                    obj.page = obj.regions[i].page_num;
                    obj.typeoffield = angular.copy(obj.type);
                    obj.type = "area";
                    obj.uuid = obj.temp_id;
                    obj.documentId = vm.pdfSrc;
                    obj.status = "review";
                    if(obj.is_accept){
                        obj.color = $scope.colorCodes.green_border;
                        obj.bgColor = $scope.colorCodes.green_border;
                        obj.status = "accept";
                    }
                    if(obj.is_corrected){
                        obj.color = $scope.colorCodes.blue_border;
                        obj.bgColor = $scope.colorCodes.blue_border;
                        obj.status = "correct";
                    }
                    obj.borderStyle='solid';
                    if(item.type=='domain'){
                      obj.is_display = false;
                      obj.borderStyle='dashed';
                    }

                    obj.page_num = obj.regions[i].page_num;
                    $scope.annotations.push(obj);

//                    obj.index = $scope.drawer[obj.regions[i].page_num].length;
//                    item.drawerIndexObj['value'+i] = obj.index;
//                    $scope.drawer[obj.regions[i].page_num].push(obj);
                }
           }

         };

         vm.getAttributeByHierarchy = function(data,type){
                if(type == 'attribute'){
                    for(var j=0;j<data.attributes.length;j++){
                        for(var k=0;k<data.attributes[j].values.length;k++){
                            if(data.attributes[j].values[k].regions!=undefined){
                                    data.attributes[j].values[k].drawerIndexObj = {};
                                    vm.updateDrawer('value',data.attributes[j].values[k]);
                            }
                        }
                   }
                }
                else if(type == 'grouped_entity'){
                    for(var i=0;i<data.groups.length;i++){
                       if(data.groups[i].type == 'attribute'){
                           for(var j=0;j<data.groups[i].attributes.length;j++){
                                if(data.groups[i].attributes[j].values!=undefined && data.groups[i].attributes[j].values.length>0){
                                    for(var k=0;k<data.groups[i].attributes[j].values.length;k++){
                                        if(data.groups[i].attributes[j].values[k].regions!=undefined){
                                                data.groups[i].attributes[j].values[k].drawerIndexObj = {};
                                                vm.updateDrawer('value',data.groups[i].attributes[j].values[k]);
                                        }
                                    }
                                }
                           }
                       }
                    }
                }
         };

         vm.hideElement = function(node){

            if(node.is_delete){
              return true;
            }
            if(node.is_accept && !$scope.checkObj.accept){
                return true
            }
            if(node.is_corrected && !$scope.checkObj.correct){
                return true
            }
            if(node.need_review && !$scope.checkObj.review){
                return true
            }
            return false
         };

         vm.changeIntaraction = function(type,value){
             filterRect(type, value);

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
                   if(data[i].type=='grouped_entity' || data[i].type == 'attribute'){
                      vm.getAttributeByHierarchy(data[i],data[i].type);

                   }
                   else if(data[i].type=='entity' || data[i].type=='domain'){
                        vm.recursiveByHierarchy(data[i].attributes);
                   }

                }
         };

         vm.getresultByHierarchy = function(){
                vm.recursiveByHierarchy($scope.extractOutput);
         };

         vm.enableSelectorInEdit = function(item,coordinates,node){

            vm.selectedObj.type = 'panel';
            vm.selectedObj.key1 = item;
            vm.selectedObj.key2 = coordinates;
            vm.selectedObj.key3 = node;
            for(var i=0;i<$scope.no_of_pages;i++){
               $scope.selector[i+1].clear();
               $scope.selector[i+1].enabled=false;
            }
            var size = Object.keys(node.drawerIndexObj).length;
            for(var j=0;j<size;j++){
                $rootScope.selectedIndex.push(node.drawerIndexObj['value'+j]);
            };
            for(var k =0;k<coordinates.length;++k){
                $rootScope.selectedPage.push(coordinates[k].page_num);
                vm.doSetTimeout(k,coordinates,node);
            }
            $rootScope.imageBlur='';
         };

         vm.doSetTimeout = function(k,coordinates,data){
            if(!vm.selectedObj.selectType){
                vm.selectedObj.selectType = true;
                $scope.actualDivWidth = $("#actual").width();
                $scope.actualImageWidth = $("#calImage").width();
                $scope.actualSliceWidth = $('#'+coordinates[k].slice_id).width();
                $scope.ratio = $scope.actualSliceWidth/$scope.actualImageWidth;
                $scope.unwantedValue = $scope.actualDivWidth/$scope.ratio;
                $scope.zoomLevel = $scope.unwantedValue/$scope.actualImageWidth;
                if($scope.zoomLevel>=1){
                    vm.zoomValue = 1;
                }
                else{
                   vm.zoomValue  = $scope.zoomLevel;
                }
                $(".zoomSize").css("zoom",vm.zoomValue);
            }
            var heightOfImage = (coordinates[k].page_num-1)*document.getElementById("calImage").style.height.replace("px","");
            setTimeout(function(){
//                    var topPos = document.getElementById('page_'+coordinates[k].page_num).offsetTop;
//                    var scrollingElement = angular.copy(topPos+coordinates[k].y1-200);
//                    var scrollingElementLeft = angular.copy(coordinates[k].x1);
//                    document.getElementById('scrollImage').scrollTop = scrollingElement;
//                    document.getElementById('scrollImage').scrollLeft = scrollingElementLeft;

                    document.getElementById('scrollImage').scrollTop = vm.zoomValue*heightOfImage+coordinates[k].y1*vm.zoomValue-200;
                    document.getElementById('scrollImage').scrollLeft = coordinates[k].x1*vm.zoomValue-100;


            },200);
         };

         vm.enableSelectorInImageClick = function(page_number,coordinates,data){
            $scope.rowHighlight = [];
            for(var i=0;i<$scope.no_of_pages;i++){
               $scope.selector[i+1].clear();
               $scope.selector[i+1].enabled=false;
            }
            $scope.zoomDisplay = 'zoomSize1';
            for(var k =0;k<coordinates.length;++k){
                $rootScope.selectedIndex.push(data.index);
                $rootScope.selectedPage.push(coordinates[k].page_num);
                vm.doSetTimeout(k,coordinates);

            }
            $rootScope.imageBlur='';
         };






         vm.getCurrentValue = function(node){
            $scope.rowHighlight = [];
            $scope.rowHighlight[node.temp_id] = 'highlightClass';
            setrectColor("transparent");
            setHeilight(node.temp_id);
            let p = document.getElementById("pdf-annotate-edit-overlay");
            if (p) {
                p.remove();
            }
            UI.disableEdit();

            var pageNum = 1;
            $scope.current_page = 1;
            if (node.regions) {
                if(node.regions.length>0){
                    pageNum = node.regions[0].page_num;
                    $scope.current_page = node.regions[0].page_num;
                    var scalerender = RENDER_OPTIONS.scale * 100;
                    var scaleheight = ((scalerender * node.regions[0].y1) / 100);
                    var scalewidth = ((scalerender *  node.regions[0].x1)/100);
                    document.getElementById('content-wrapper').scrollTop = ((parseInt(pageNum) - 1) * PAGE_HEIGHT) + scaleheight;
                    document.getElementById('content-wrapper').scrollLeft = scalewidth ;
                }
            }


            return;

         };

         vm.getGroups = function (type) {
                  entityLinkingService.getEntityLinks($stateParams.id, vm.sess_id).then(function (data) {
                       //data.data.data.data.template_type='unknown'
                       if (data.data.status == "success") {
                            $scope.extractedData = data.data.data;
                            $scope.elementsList = [];
                            if($scope.extractedData.data.elements!=undefined){
                                     $scope.elementsList = $scope.extractedData.data.elements;
                            }
                            $scope.entitiesData = $scope.extractedData.data.entity;

                            $scope.copyData = angular.copy($scope.entitiesData);
                            $scope.deepCopyOfSectionsData = { 'data': $scope.copyData };
                            $scope.volume = $scope.extractedData.volume;
                            $scope.recordData = $scope.extractedData.data.metadata;
                            $scope.reviewStatesList = $scope.extractedData.review_state;
                            $scope.doc_id = $scope.extractedData.data.doc_id;
                            $scope.root_id = $scope.extractedData.data.root_id;
                            $scope.showUnknown = false;
                            if ($scope.recordData.properties.extension != "email") {
                                if ($scope.extractedData.data.template_type != undefined) {
                                    if ($scope.extractedData.data.template_type == 'unknown' || $scope.extractedData.data.template_type == 'known') {
                                        $scope.current_page = 1;
                                        if ($scope.extractedData.data.doc_type == undefined || $scope.extractedData.data.doc_type == 'image') {
                                            $scope.showUnknown = true;
                                        } else {
                                            vm.renderHtml = $scope.pagesInfo[$scope.current_page - 1].doc_html;
                                        }
                                        $scope.current_page = 1;
                                        $scope.rowHighlight = [];
                                        $scope.tableRow = [];
                                        $scope.extractOutput = $scope.entitiesData;
                                        vm.getresultByHierarchy();

                                        RENDER_OPTIONS.documentId = "/static" + $scope.volume + $scope.recordData.properties.digital_pdf_resource.key;
                                        vm.pdfSrc = "/static" + $scope.volume + $scope.recordData.properties.digital_pdf_resource.key;

//                                        RENDER_OPTIONS.documentId = '/app/sharedPDFJS/cms.pdf';
//                                        vm.pdfSrc = "/app/sharedPDFJS/cms.pdf";

                                        vm.pdfinit();
                                        vm.render();
                                        setOrderForSpecificTime();
                                    }


                                }

                            }
                            else {
                                $scope.processListDetails = data.data;
                                $scope.recordData = $scope.processListDetails.data;
                                $scope.mime_type = data.data.data.data.extn;
                                vm.documentType = data.data.data.data.doc_type;
                                vm.docAttributes = data.data.data.data.doc_attributes;
                                $scope.processListDetails = data.data.data;
                                $scope.recordDataConfig = $scope.processListDetails.config.record_data;
                                $scope.recordData = $scope.processListDetails.data;
                                vm.emailAttachmentsArray = data.data.data.data.attachments;
                                vm.emailEntities = data.data.data.data.elements;
                            }
                        } else {
                                    $.UIkit.notify({
                                        message: data.data.msg,
                                        status: 'danger',
                                        timeout: 3000,
                                        pos: 'top-center'
                                    });
                       }
                  },function (err) {

                  })
         };
         vm.getGroups('load');
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
                         // $scope.current_page = activePage;
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

         vm.zoomValue = 0.20;
         $(".zoomSize").css("zoom",vm.zoomValue);
         vm.selectedObj = {};

         vm.zoomCalculation = function(){
            if(vm.zoomValue<=0.25){
                vm.zoomValue = 0.20;
            }
            else if(vm.zoomValue>0.20 && vm.zoomValue<=0.45){
                vm.zoomValue = 0.40;
            }
            else if(vm.zoomValue>0.40 && vm.zoomValue<=0.65){
                vm.zoomValue = 0.60;
            }
            else if(vm.zoomValue>0.60 && vm.zoomValue<=0.85){
                vm.zoomValue = 0.80;
            }
            else{
                vm.zoomValue = 1;
            }
         };


         vm.zoomIn = function () {
            var zoom = '';
            if (RENDER_OPTIONS.scale < 1.4) {
                let zoom = RENDER_OPTIONS.scale + 0.1
                handleZoom(zoom);
            }
            setOrderForSpecificTime();


         };

        vm.zoomReset = function(){
            handleZoom(0.17);
            setOrderForSpecificTime();
        };

        vm.zoomOut = function () {
            var zoom = '';
            if (RENDER_OPTIONS.scale > 0.1) {
                zoom = RENDER_OPTIONS.scale - 0.1;
                handleZoom(zoom);
            }
            setOrderForSpecificTime();


        };


         vm.enableSelector = function(){
            $scope.rowHighlight = [];
            $scope.zoomDisplay = 'zoomSize';
//            $scope.current_page = 1;
//            $scope.current_selection_page_number = 1;
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

        vm.showallAnnotations = function () {
            setrectColor("yellow");
            UI.disableEdit();
        };

        vm.disableSelector = function () {
            vm.selectedNode=null;
            if($scope.drawerCopy!=undefined){
                if($scope.drawerCopy.length>0){
                     $scope.annotations = [];
                     $scope.annotations = angular.copy($scope.drawerCopy);
                }
            }
            vm.render();
            setTimeout(() => {
                vm.showallAnnotations();
            }, 300);
            setOrderForSpecificTime();

        };

         vm.changePageNumUnknown = function (type) {
            if (type == 'next')
                $scope.current_page++;
            else
                $scope.current_page--;
            var zoomVal = $('.' + $scope.zoomDisplay).css("zoom");
            setTimeout(function () {
                document.getElementById('content-wrapper').scrollTop = ((parseInt($scope.current_page) - 1) * PAGE_HEIGHT);
            }, 100);
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
         $scope.innerData={}







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


          $rootScope.$on("selector",function(evt,data){


               $scope.current_selection_page_number = data.id;
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
              $scope.current_page = data.page_num;
              $scope.rowHighlightAttr = [];
              $scope.rowHighlightAttr[data.temp_id] = 'highlightClass'
              vm.enableSelectorInImageClick(data.page_num,data.regions,data)
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
            entityLinkingService.retrain({'sess_id':vm.sess_id}).then(function(data){
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
       }
       else{
          processDetailsServices.postProcessList($stateParams.id,vm.sess_id).then(function(data){
              if(data.data.status=="success"){
                  vm.documentType = $stateParams.type.toLowerCase();
                  $scope.processListDetails = data.data.data;
                  $scope.recordDataConfig = $scope.processListDetails.config.record_data;
                  $scope.recordData =$scope.processListDetails.data;
                  vm.digitalDocumentData =angular.copy(data.data.data.data.elements.digital);
                  vm.heightOfWindow = $(window).height()-70;
                  vm.heightOfWindow1 = $(window).height()-120;
              }
          });

          $rootScope.emailSlider = {
            value: 75,
            options: {
              floor: 0,
              ceil: 100,
              onEnd: function(id) {

              }
            }
          };

//          $scope.emailBodyHtml = function() {
//              return $sce.trustAsHtml(vm.emailDocumentData.attributes.body);
//          };
//
//          $scope.emailOriginalHtml = function(){
//              return $sce.trustAsHtml(vm.emailDocumentData.attributes.original);
//          }

          $scope.emailAttachments = function(htmldata){
              return $sce.trustAsHtml(htmldata);
          }

          $scope.downloadAttachment = function(file_path){
             var downloadUrl = $scope.url+'/api/download/efs/'+file_path;
             window.location.assign(downloadUrl);
          }

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

       vm.renderHTMLData = function(){
            return $sce.trustAsHtml(vm.renderHtml);
       };
       vm.renderEmailHTMLData = function(data){
            return $sce.trustAsHtml(data);
       };
       vm.showEmailAttachment = function(attachmentObj){
            //alert(attachmentObj);
            var doc_id=attachmentObj.doc_id;
            var prop="none";
            //$state.reload();
            $state.go("app.review",{id:doc_id, type:prop,queue:$stateParams.queue})
       };

       vm.updateNlp = function(obj,prop){
           var sendObj = {"elements":obj,"doc_id":$stateParams.id};
           entityLinkingService.sendEmailNlp({'data':sendObj,'sess_id':vm.sess_id}).then(function(data){
              if(data.data.status=="success"){
                 $.UIkit.notify({
                       message : data.data.msg,
                       status  : 'success',
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

       vm.newAttribute = function(action){
           vm.newAttributeObj = angular.copy({"attribute":"","value":"","action":action});
           vm.newAttributeShow = true;
       };

       vm.saveNewAttribute = function(){
           if(vm.newAttribute.attribute != "" && vm.newAttribute.attribute != undefined){
               if(vm.newAttribute.value != "" && vm.newAttribute.value != undefined){
                   vm.emailEntities.fields[0].nlp.attributes.push(vm.newAttribute);
                   entityLinkingService.sendEmailNlp({'data':sendObj,'sess_id':vm.sess_id}).then(function(data){
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

       vm.getEntitiesList = function(){
          entityLinkingService.getDomainObjectsEntities({'sess_id':vm.sess_id}).then(function(resp){
              $scope.doEntitiesList = resp.data;
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
       vm.getEntitiesList();

       vm.getAttributesList = function(){
          entityLinkingService.getDomainObjects({'sess_id':vm.sess_id}).then(function(resp){
              $scope.entitiesList = resp.data;
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

       vm.showAttributes = function(node){
            vm.respectedAttributes = [];
            if($scope.entitiesList[node.entity_key]!=undefined)
               vm.respectedAttributes = $scope.entitiesList[node.entity_key];
       };

       vm.showAttributesForNew = function(val){
            vm.respectedAttributes = [];
            var entity_key = val.entity_key;
            if($scope.entitiesList[entity_key]!=undefined)
               vm.respectedAttributes = $scope.entitiesList[entity_key];
       };

       vm.showNewEntities = function(node){
            vm.respectedEntities = [];
            if($scope.doEntitiesList[node.name]!=undefined)
               vm.respectedEntities = $scope.doEntitiesList[node.name];
       };

       vm.selectedAttribute = function(name,attr,node){
            attr.name = name;
            if(attr.name === attr.extracted_name){
                node.is_changed = false;
                for(var i=0;i<attr.values.length;i++){
                    if(attr.values.value === attr.values.extracted_value){
                        node.is_changed = false;
                    }
                    else{
                        node.is_changed = true;
                        break;
                    }
                }
            }
            else{
                node.is_changed = true;
            }
//            var obj={
//                "sess_id":vm.sess_id,
//                "data":{
//                        "insight_id": thisVal.insight_id,
//                        "entity_id": thisVal.entity_id,
//                        "type": thisVal.type,
//                        "old_key": node.entity_key+"."+node.extracted_name,
//                        "key": node.entity_key+"."+node.name,
//                        "action": "upsert",
//                        "doc_id":$stateParams.id,
//                        "value":node.values
//                      }
//            };
//            $scope.submitFeedback(obj);

       };

       vm.selectedNewEntityAttribute = function(attr,node){
            $scope.newEntityObj.name = attr;
            $scope.newEntityObj.entity_key = node.name+"."+attr;
            vm.attributeKey = "Attribute";

       };
       vm.selectedNewEntityAttributeValue = function(attr){
            vm.attributeKey = attr;

       };

       vm.selectedAttributeForNew = function(attr,node){
            $scope.listOfNewAttributesObjs[node.insight_id].attributeName = attr;
       }

      $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
      $scope.download =function(){
        var downloadUrl = $scope.url+'/api/download/json/'+$scope.doc_id+'/';
        window.location.assign(downloadUrl);
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

        $scope.editAttributeValues = function(index,tempId,templateType,node,thisVal){
            if(templateType!='known'){
                $scope.isEditAttributeValue[tempId]=true;
                $scope.newNode = node.entity_id;
                $scope.nodeNameBackup = angular.copy(node.name);
                $scope.nodeValueBackup = angular.copy(node.current_value);
                var temp = thisVal.$parentNodeScope.$modelValue.temp_id;
                var afterTemp = temp.replace("-",".");
                $scope.attributesList = $scope.entitiesList[afterTemp];
            }
        };
        $scope.cancelEditAttributeValues = function(index,tempId,templateType,node){
            $scope.isEditAttributeValue[tempId]=false;
            node.name = angular.copy($scope.nodeNameBackup);
            node.current_value = angular.copy($scope.nodeValueBackup);
        };
        $scope.saveEditAttributeValues = function(index,tempId,templateType,node,thisVal,parentIndex){
//            console.log("node=>", node);
//            console.log("index=>", index);
            console.log("chnages in extract" +$scope.extractOutput);

            var temidArray  = tempId.split("-");
            var entId=temidArray[temidArray.length-1];
            var entId1=entId.replace(/~/g, "-");

            var enKey = getKey(tempId);
            var old_key = angular.copy(enKey);
            var idnx = enKey.lastIndexOf(".");
            enKey = enKey.substring(0,idnx);
            enKey = enKey +'.'+ node.name;

            var elValue=[];
            var insId = "";
            angular.forEach(node.current_value, function(val, key){
                var curArr={};
                curArr.element_id=val.element_id;
                curArr.is_checked=val.is_checked;
                curArr.page_num=val.page_num;
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
                        "old_key": old_key,
                        "key": enKey,
                        "action": "upsert",
                        "doc_id":$stateParams.id,
                        "value":elValue
                      }
            };
            node.is_corrected = true;
            $scope.submitFeedback(obj,tempId);
        };

        $scope.submitFeedback = function(obj){
            var reqObj = {"sess_id":vm.sess_id,"data":{"feedback": obj.data}};
            entityLinkingService.saveEntityLinkingFeedback(reqObj).then(function (data) {
                if(data.data.status=="success"){

                    $scope.newNode = "";
                    vm.attributeKey = "";
                    vm.attributeValue= "";
                    vm.selectedElementFlag = false;
                    vm.selectedElementId = '';

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
                 message : "Internal server error @saveEntityLinkingFeedback",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            })
        };

        vm.deleteEntityCall = function(node){
                node.is_delete = true;
                var obj={
                    "sess_id":vm.sess_id,
                    "data":{
                        "entity_id": node.entity_id,
                        "type": "entity",
                        "doc_id":$stateParams.id,
                        "action": "delete"
                    }
                };
                //$scope.submitFeedback(obj);

        };

        vm.deleteFeedback = function(node,thisVal){
                   thisVal.is_changed = true;
                   thisVal.attr_delete = true;
//                var obj={
//                "sess_id":vm.sess_id,
//                "data":{
//                        "insight_id": thisVal.insight_id,
//                        "entity_id": thisVal.entity_id,
//                        "type": thisVal.type,
//                        "key": node.entity_key+"."+node.name,
//                        "action": "delete",
//                        "doc_id":$stateParams.id,
//                        "value":node.values
//                      }
//                };
//
//                $scope.submitFeedback(obj);

        };

        vm.deleteAttribute = function(node,thisVal){
            if(vm.showPopupConfirm){
                node.is_delete = true;
                vm.deleteFeedback(node,thisVal);
            }
            else{
                ngDialog.open({ template: 'confirmEntityBox',
                  controller: ['$scope','$state' ,function($scope,$state) {
                      $scope.activePopupText = 'Are you sure you want to delete '+node.name+ ' attribute';
                      $scope.onConfirmActivation = function (flag){
                            ngDialog.close();
                            if(flag){
                                vm.showPopupConfirm = true;
                            }

                            node.is_delete = true;
                            vm.deleteFeedback(node,thisVal);
                      };
                  }]
                });
            }


        };

        vm.deleteElementData = function(node){
            node.is_delete = true;
            var size = Object.keys(node.drawerIndexObj).length;
            for(var i=0;i<size;i++){
                $scope.drawer[node.regions[i].page_num][node.drawerIndexObj['value'+i]].is_display = false;
                $scope.drawer[node.regions[i].page_num][node.drawerIndexObj['value'+i]].is_delete = true;
            }
            vm.disableSelector();
        }

        vm.deleteValue = function(node){
            if(vm.showPopupConfirm){
                vm.deleteElementData(node);

            }
            else{
                ngDialog.open({ template: 'confirmEntityBox',
                  controller: ['$scope','$state' ,function($scope,$state) {
                      $scope.activePopupText = 'Are you sure you want to delete '+node.value+ ' value';
                      $scope.onConfirmActivation = function (flag){
                            ngDialog.close();
                            if(flag){
                                vm.showPopupConfirm = true;
                            }

                            vm.deleteElementData(node);
                      };
                  }]
                });
            }


        };

        vm.deleteGroup = function(node,thisVal,index){
            if(node.is_new){
                thisVal.$parentNodeScope.$modelValue.groups.splice(index,1);
            }
            else{
             node.is_delete = true;
            }
        };

        vm.addNewAttribute = function(node,thisVal){
            var temp = thisVal.$parentNodeScope.$modelValue.entity_key;
            $scope.coordinatesDisplay = [];
            $scope.listOfNewAttributes = [];
            $scope.listOfNewAttributesObjs={};
            vm.attributeValue = "";
            vm.attributeKey = "";
            vm.selectedElementId = '';
            vm.selectedElementFlag = false;
            $scope.drawerCopy = angular.copy($scope.annotations);
            $scope.listOfNewAttributes[node.insight_id] = true;
            $scope.listOfNewAttributesObjs[node.insight_id] = {};
            $scope.listOfNewAttributesObjs[node.insight_id].attributeName = "Attribute";
            $scope.listOfNewAttributesObjs[node.insight_id].attributeValue = "";
            $scope.listOfNewAttributesObjs[node.insight_id].entity_key = temp;
//            for(var i=0;i<node.groups.length;i++){
//                $scope.listOfNewAttributes[node.groups[i].insight_id] = true;
//                $scope.listOfNewAttributesObjs[node.groups[i].insight_id] = {};
//                $scope.listOfNewAttributesObjs[node.groups[i].insight_id].attributeName = "Attribute";
//                $scope.listOfNewAttributesObjs[node.groups[i].insight_id].attributeValue = "";
//                $scope.listOfNewAttributesObjs[node.groups[i].insight_id].entity_key = node.entity_key;
//            }

        };

        vm.addNewAttributeInEntity = function(node,thisVal){
            var temp = node.entity_key;
            $scope.coordinatesDisplay = [];
            $scope.listOfNewAttributes = [];
            $scope.listOfNewAttributesObjs={};
            vm.attributeValue = "";
            vm.attributeKey = "";
            vm.selectedElementId = '';
            vm.selectedElementFlag = false;
            $scope.drawerCopy = angular.copy($scope.annotations);
            $scope.listOfNewAttributes[node.insight_id] = true;
            $scope.listOfNewAttributesObjs[node.insight_id] = {};
            $scope.listOfNewAttributesObjs[node.insight_id].attributeName = "Attribute";
            $scope.listOfNewAttributesObjs[node.insight_id].attributeValue = "";
            $scope.listOfNewAttributesObjs[node.insight_id].entity_key = temp;
        };

        vm.addNewGroupInEntity = function(node,thisVal){
            var obj = {};
                obj.type='attribute';
                obj.is_new=true;
                obj.is_changed= true;
                obj.attributes = [];
                obj.insight_id=$scope.uniqueIdGenerator();
                obj.entity_id = $scope.uniqueIdGenerator();
                obj.name = node.name
                node.groups.unshift(obj);
                $scope.coordinatesDisplay = [];
                $scope.listOfNewAttributes = [];
                $scope.listOfNewAttributesObjs={};
                vm.attributeValue = "";
                vm.attributeKey = "";
                vm.selectedElementId = '';
                vm.selectedElementFlag = false;
                $scope.drawerCopy = angular.copy($scope.annotations);
                $scope.listOfNewAttributes[obj.insight_id] = true;
                $scope.listOfNewAttributesObjs[obj.insight_id] = {};
                $scope.listOfNewAttributesObjs[obj.insight_id].attributeName = "Attribute";
                $scope.listOfNewAttributesObjs[obj.insight_id].attributeValue = "";
                $scope.listOfNewAttributesObjs[obj.insight_id].entity_key = node.entity_key;
        };

        vm.deleteEntity = function(node){
            var attrKey = node.name;
            ngDialog.open({ template: 'confirmBox1',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete '+attrKey+ ' entity';
                  $scope.onConfirmActivation = function (){
                        ngDialog.close();
                        vm.deleteEntityCall(node);
                  };
              }]
            });
        };


        vm.editCoordinates = function(node){
            $scope.coordinatesDisplay = [];
            $scope.coordinatesDisplay[node.temp_id] = true;
            //vm.getCurrentValue(node);
            node.is_edit_coordinates = true;
            //vm.enableSelector('new');
            for(var i=0;i<$scope.no_of_pages;i++){
               $scope.selector[i+1].clear();
               $scope.selector[i+1].enabled=true;
            }
            var zoomValue = 1;
            $(".zoomSize").css("zoom",zoomValue);


            for(var i=0;i<node.regions.length;i++){
                var heightOfImage = (node.regions[i].page_num-1)*document.getElementById("calImage").style.height.replace("px","");

                        document.getElementById('scrollImage').scrollTop = zoomValue*heightOfImage+node.regions[i].y1*zoomValue-200;
                        document.getElementById('scrollImage').scrollLeft = node.regions[i].x1*zoomValue-100;



                vm.editZone(node.regions[i])
            }
        };

        vm.acceptCoordinates = function(node,type,obj){

            $scope.coordinatesDisplay = [];

            if(node.regions.length==0){
                for(var i=0;i<$scope.no_of_pages;i++){
                   if($scope.selector[i+1].x1!=undefined){

                      var obj = {};

                      obj.x1 = $scope.selector[i+1].x1;
                      obj.y1 = $scope.selector[i+1].y1;
                      obj.x2 = $scope.selector[i+1].x2;
                      obj.y2 = $scope.selector[i+1].y2;
                      obj.page_num = i+1;
                      node.regions.push(obj);
                      vm.updateDrawer('value',node,'');
                      break;
                   }
                }
                vm.disableSelector();
                return;
            }

            for(var i=0;i<node.regions.length;i++){
               var page_number = node.regions[i].page_num
               if($scope.selector[page_number].x1!=undefined){
                  node.regions[i].x1 = $scope.selector[page_number].x1;
                  node.regions[i].y1 = $scope.selector[page_number].y1;
                  node.regions[i].x2 = $scope.selector[page_number].x2;
                  node.regions[i].y2 = $scope.selector[page_number].y2;
               }
            }
            var size = Object.keys(node.drawerIndexObj).length;
            for(var i=0;i<size;i++){
                $scope.drawer[node.regions[i].page_num][node.drawerIndexObj['value'+i]].x1 = node.regions[i].x1;
                $scope.drawer[node.regions[i].page_num][node.drawerIndexObj['value'+i]].y1 = node.regions[i].y1;
                $scope.drawer[node.regions[i].page_num][node.drawerIndexObj['value'+i]].x2 = node.regions[i].x2;
                $scope.drawer[node.regions[i].page_num][node.drawerIndexObj['value'+i]].y2 = node.regions[i].y2;
            }
            vm.disableSelector();
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


        vm.editZone = function(coordinates){

                  //$rootScope.selectedIndex = index;
                  $(".image-style").height($(window).height());
                  $rootScope.highlight=[];
                  $rootScope.imageBlur='';
            //      $rootScope.highlight[index] = "highlightClass";
            //      $scope.zoomDisplay = 'zoomSize1';

                   $scope.imageObj={};
                   $scope.imageObj.width = document.getElementById("calImage").style.width.replace("px","");
                   $scope.imageObj.height = document.getElementById("calImage").style.height.replace("px","");
                   $scope.calculation(coordinates);
                    $scope.selector[coordinates.page_num].x1 = coordinates.x1;
                    $scope.selector[coordinates.page_num].y1 = coordinates.y1;
                    $scope.selector[coordinates.page_num].x2 = coordinates.x2;
                    $scope.selector[coordinates.page_num].y2 = coordinates.y2;
            //        if($scope.drawer[index].key == 'value')
            //              $scope.selector.color = $scope.rect.marker_color;
            //        else
            //             $scope.selector.color = $scope.rect.data_color;
            //        $scope.selector.stroke  = $scope.rect.stroke;
            //        $scope.selector.enabled = true;

                    if(document.getElementsByClassName("mr-box")[coordinates.page_num-1].style!=undefined){
                        document.getElementsByClassName("mr-box")[coordinates.page_num-1].style.display = "none";
                        document.getElementsByClassName("mr-box")[coordinates.page_num-1].style.top = coordinates.y1+"px";
                        document.getElementsByClassName("mr-box")[coordinates.page_num-1].style.left = coordinates.x1+"px";
                        document.getElementsByClassName("mr-box")[coordinates.page_num-1].style.bottom = ""+$scope.obj.bottom+"px";
                        document.getElementsByClassName("mr-box")[coordinates.page_num-1].style.right = ""+$scope.obj.right+"px";
                    }
                    if(document.getElementsByClassName("mr-shadow")[coordinates.page_num-1].style!=undefined){
                        document.getElementsByClassName("mr-shadow left")[coordinates.page_num-1].style.right = ""+$scope.obj.shleftRight+"px";
                        document.getElementsByClassName("mr-shadow center top")[coordinates.page_num-1].style.left = ""+$scope.obj.shcentertopleft+"px";
                        document.getElementsByClassName("mr-shadow center top")[coordinates.page_num-1].style.right = ""+$scope.obj.shcentertopright+"px";
                        document.getElementsByClassName("mr-shadow center top")[coordinates.page_num-1].style.bottom = ""+$scope.obj.shcentertopbottom+"px";
                        document.getElementsByClassName("mr-shadow center bottom")[coordinates.page_num-1].style.left = ""+$scope.obj.shcenterbottomleft+"px";
                        document.getElementsByClassName("mr-shadow center bottom")[coordinates.page_num-1].style.right = ""+$scope.obj.shcenterbottoformight+"px";
                        document.getElementsByClassName("mr-shadow center bottom")[coordinates.page_num-1].style.top = ""+$scope.obj.shcenterbottomtop+"px"
                        document.getElementsByClassName("mr-shadow right")[coordinates.page_num-1].style.left = ""+$scope.obj.shrightleft+"px";
                    }


        };

        vm.getEXtractedValue = function(node){
            node.value = node.extracted_value;
        };
        $scope.uniqueIdGenerator = function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };

        function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
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
                curArr.page_num=val.page_num,
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
                        "doc_id":$stateParams.id,
                        "value":elValue
                      }
            };
            node.is_accept = true;
            $scope.submitFeedback(obj,tempId);
//            entityLinkingService.acceptEntityLinking(obj).then(function (data) {
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
                return 'accepted1'
            }
            else if(node.is_corrected){
              return 'corrected1'
            }
            else{
               return 'reviewed1'
            }
        };

        vm.addNewNode = function(node,type,thisVal){
           vm.attributeValue = "";
           vm.attributeKey = "";
           vm.selectedElementId = '';
           vm.selectedElementFlag = false;
           $scope.drawerCopy = angular.copy($scope.drawer);
           $scope.entityModeEdit = false;
           if(type == 'group'){
               $scope.newNode = node.entity_id;
                var temp = thisVal.$parentNodeScope.$modelValue.temp_id;
                var afterTemp = temp.replace("-",".");
                $scope.attributesList = $scope.entitiesList[afterTemp];

           }
           else{
                $scope.newNode = node.temp_id;
                var temp = node.temp_id;
                var afterTemp = temp.replace("-",".");
                $scope.attributesList = $scope.entitiesList[afterTemp];
           }

        };

        vm.addNewEntity = function(node){
           if(node.type == 'domain'){
               vm.attributeValue = "";
               vm.attributeKey = "Attribute";
               vm.selectedElementId = '';
               vm.selectedElementFlag = false;
               $scope.displayNewEntity = true;
               $scope.newEntityObj = {};
               $scope.newEntityObj.parent_insight_id = node.insight_id;
               $scope.newEntityObj.is_new = true;
               $scope.newEntityObj.is_changed = true;
               $scope.newEntityObj.name = "Entity";
               $scope.newEntityObj.type = "grouped_entity";
               $scope.newEntityObj.groups = [];

//                {
// 	"cardinality": "n",
// 	"groups": [{
// 		"type": "attribute",
// 		"entity_id": "12cdd635-c88e-44ee-a4ba-515e74009c16",
// 		"insight_id": "3c15686e-674f-4702-9ab2-4337f6665089",
// 		"attributes": [{
// 			"is_corrected": false,
// 			"name": "problem",
// 			"is_accept": true,
// 			"temp_id": "resume-subheadings_active_problems_summary-problem-12cdd635~c88e~44ee~a4ba~515e74009c16",
// 			"values": [{
// 				"coordinates": ],
// 				"value": "problem",
// 				"score": 90.0,
// 				"temp_id": "resume-subheadings_active_problems_summary-problem-12cdd635~c88e~44ee~a4ba~515e74009c16_1",
// 				"is_checked": true,
// 				"extracted_value": "problem",
// 				"page_number": 2,
// 				"element_id": "1f158160-43fc-4c66-b9cf-2ee6604c856c"
// 			}],
// 			"type": "attribute",
// 			"justification": "",
// 			"extracted_name": "problem",
// 			"need_review": false,
// 			"entity_key": "resume.subheadings_active_problems_summary"
// 		}]
// 	}],
// 	"name": "subheadings_active_problems_summary",
// 	"entity_key": "resume.subheadings_active_problems_summary",
// 	"temp_id": "resume-subheadings_active_problems_summary",
// 	"type": "grouped_entity",
// 	"parent_entity_id": "c05a61e0-98af-429c-a126-a26f96c15192",
// 	"extracted_name": "subheadings_active_problems_summary",
// 	"entity_id": ""
// }
           }


        };

        $scope.changeSelectEntity = function(node){
            var ent = node.name+'.'+vm.entityKey;
            $scope.attributesList = $scope.entitiesList[ent];
        };

        vm.getListByHierarchy = function (data) {

            vm.updateDrawer('value', data);
            if (data.children != undefined) {
                for (var i = 0; i < data.children.length; i++) {
                        vm.updateDrawer('value', data.children[i],'list');
                }
            }

        };
        vm.getTableByHierarchy = function (value) {
            var j = 0;
            //               angular.forEach(value.tables.headings,function(obj,index){
            //                   value.tables.headings[index] = value.tables.headings[index].join("");
            //               });
            //               value.tables.headings = value.tables.headings.join();
            angular.forEach(value.cells, function (value1, key1) {
                    vm.updateDrawer('value', value1, 'table');

            })
        };

        vm.selectedElement = function(){
            vm.selectedElementId = '';
            vm.selectedElementFlag = true;
            if($scope.elementsList.length>0){
                $scope.annotations = angular.copy([]);

                $scope.zoomDisplay = 'zoomSize';
                $scope.current_page = 1;
                $scope.current_selection_page_number = 1;
                $rootScope.selectedIndex =[];
                $rootScope.selectedPage = [];

                //vm.enableSelector();
                for(var i=0;i<$scope.elementsList.length;i++){
                    //vm.updateDrawer('value',$scope.elementsList[i]);
                    if ($scope.elementsList[i].node_type == 'table') {

                        vm.getTableByHierarchy($scope.elementsList[i])
                    }
                    else if ($scope.elementsList[i].node_type == 'list') {
                        vm.getListByHierarchy($scope.elementsList[i]);
                    }
                    else
                        vm.updateDrawer('value',$scope.elementsList[i]);
                }
                vm.render();
                setOrderForSpecificTime();
            }
        };

        vm.cancelNewAttribute = function(node){
            $scope.annotations = angular.copy([]);
//            for(var i=0;i<$scope.no_of_pages;i++){
//                $scope.drawer[i+1] = angular.copy([]);
//            }
            vm.zoomValue = 0.20;
            $(".zoomSize").css("zoom",vm.zoomValue);
            $scope.current_page = 1;
            $scope.current_selection_page_number = 1;
            $rootScope.selectedIndex =[];
            $rootScope.selectedPage = [];
            $scope.annotations = angular.copy($scope.drawerCopy);
            vm.render();
            vm.selectedElementId = '';
            vm.selectedElementFlag = false;
            $scope.listOfNewAttributes[node.insight_id] = false;
            $scope.listOfNewAttributesObjs[node.insight_id] = {};


            vm.attributeValue = "";
            vm.attributeKey = "";
            vm.entityKey = "";
        };

        vm.cancelNewEntity = function(){
            if($scope.drawerCopy!=undefined){
                if($scope.drawerCopy.length>0){
                     $scope.annotations = [];
                     $scope.annotations = angular.copy($scope.drawerCopy);
                     vm.render();
                     setTimeout(() => {
                        vm.showallAnnotations();
                     }, 300);
                }
            }
            $scope.displayNewEntity = false;
            $scope.displayNewAttribute = false;
            vm.attributeValue = "";
            vm.attributeKey = "";
            vm.selectedElementId = '';
            vm.selectedElementFlag = false;

        };



        vm.saveNewEntity = function(){
            if($scope.newEntityObj.name == 'Entity'){
                $.UIkit.notify({
                                               message : 'Please select an Entity ',
                                               status  : 'danger',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });
                 return
            }
            $scope.displayNewAttribute = true;
            $scope.drawerCopy = angular.copy($scope.annotations);
            //$scope.newEntityObj.groups.push({'entity_key':$scope.newEntityObj.entity_key,'type':'attribute',''})

        };

        vm.saveNewNodeAttribute = function(node,thisVal){
           if(vm.selectedElementId==''){
             $.UIkit.notify({
                                               message : 'Please select an element ',
                                               status  : 'danger',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });
             return
           }

           var reqObj={
                "sess_id":vm.sess_id,
                "data":{
                        "insight_id": node.insight_id,
                        "type": "attribute",
                        "key": name+'.'+$scope.listOfNewAttributesObjs[node.insight_id].attributeName,
                        "entity_id": node.entity_id,
                        "element_id":vm.selectedElementId,
                        "action": "upsert",
                        "doc_id":$stateParams.id,
                        "value": [{
			                "value": $scope.listOfNewAttributesObjs[node.insight_id].attributeValue,
			                "is_checked": true
		                }]
                      }
           };

           var entity_id = angular.copy(node.entity_id);
           entity_id = entity_id.replace(/-/gi, "~")
           var tempId = thisVal.$parentNodeScope.$modelValue.temp_id
           var str = angular.copy(tempId.split('-'));
           var temp_id = ''
           var unique_id = $scope.uniqueIdGenerator();
           for(var j=0;j<str.length-1;j++){
                temp_id+=str[j]+'-'
           }
           temp_id = temp_id+unique_id+"-"+entity_id


           var obj = {  "is_newAttr": true,
                        "is_corrected": false,
                        "values": [{
                            "temp_id": temp_id+'_1',
                            "score": 100,
                            "coordinates": [],
                            "extracted_value": $scope.listOfNewAttributesObjs[node.insight_id].attributeValue,
                            "value": $scope.listOfNewAttributesObjs[node.insight_id].attributeValue,
                            "id":vm.selectedElementId,
                            "drawerIndexObj":{}
                        }],
                        "need_review": false,
                        "type": "attribute",
                        "is_accept": true,
                        "justification": "",
                        "temp_id": temp_id,
                        "name": $scope.listOfNewAttributesObjs[node.insight_id].attributeName,
                        "extracted_name": $scope.listOfNewAttributesObjs[node.insight_id].attributeName,
                        "entity_key":thisVal.$parentNodeScope.$modelValue.entity_key

           }
           node.attributes.push(obj);
           node.is_changed = true;
           $scope.listOfNewAttributes[node.insight_id] = false;
           $scope.listOfNewAttributesObjs[node.insight_id] = {};

           vm.cancelNewAttribute(node)
		   //$scope.submitFeedback(reqObj);
        };

        vm.saveNewEntityWithAttribute = function(node){
            if(vm.attributeKey=='Attribute'){
             $.UIkit.notify({
                                               message : 'Please select an Attribute ',
                                               status  : 'danger',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });
                return
             }
            if(vm.selectedElementId==''){
             $.UIkit.notify({
                                               message : 'Please select an element ',
                                               status  : 'danger',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });
             return
             }
             var reqObj={
                "sess_id":vm.sess_id,
                "data":{
                        "type": "entity",
                        "entity_name": vm.attributeKey,
                        "action": "upsert",
                        "doc_id":$stateParams.id,
                        "attributes":[{
                            "type": "attribute",
                            "insight_id":node.insight_id,
                            "key": $scope.newEntityObj.entity_key,
                            "entity_id": node.entity_id,
                            "element_id":vm.selectedElementId,
                            "action": "upsert",
                            "doc_id":$stateParams.id,
                            "value": [{
                                "value": vm.attributeValue,
                                "is_checked": true
                            }]
                        }]
                      }
             };

             $scope.newEntityObj.temp_id = node.temp_id+"-"+$scope.newEntityObj.entity_key;

             var obj = {type:'attribute',attributes:[{name:vm.attributeKey,type:'attribute',entity_key:$scope.newEntityObj.entity_key,element_id:vm.selectedElementId,'values':[{value:vm.attributeValue,extracted_value:vm.attributeValue,id:vm.selectedElementId}]}]}
             $scope.newEntityObj.groups.push(obj);
             node.attributes.unshift($scope.newEntityObj);
             $scope.extractOutput = $scope.extractOutput;
             vm.cancelNewEntity();



			//$scope.submitFeedback(reqObj);



        };

        vm.saveNewnodeWithEntity = function(node,type,thisVal){
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
                        "type": "entity",
                        "entity_name": vm.entityKey,
                        "action": "upsert",
                        "doc_id":$stateParams.id,
                        "attributes":[{
                            "insight_id": node.insight_id,
                            "type": "attribute",
                            "key": vm.entityKey+'.'+vm.attributeKey,
                            "entity_id": node.attributes[0].entity_id,
                            "element_id":vm.selectedElementId,
                            "action": "upsert",
                            "doc_id":$stateParams.id,
                            "value": [{
                                "value": vm.attributeValue,
                                "is_checked": true
                            }]
                        }]
                      }
            };

            if(type != 'group'){
               obj.data.add_type=type_group
            }

            var pushObj = {
                    "type": "entity",
                    "name": vm.entityKey,
                    "attributes":[{
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
                    }]
				}
//		    if(type=="group"){
//		        node.attributes.push(pushObj.attributes[0]);
//		    }
//		    else{
//		        node.attributes.push(pushObj);
//		    }
			$scope.submitFeedback(obj,tempId);
        };

        vm.changedValue = function(node,attr,value){
            if(value.value === value.extracted_value){
                node.is_changed = false;
                if(attr.name === attr.extracted_name){
                    node.is_changed = false;
                }
                else{
                    node.is_changed = true;
                }
            }
            else{
                node.is_changed = true;
            }
        };

        vm.saveAttributeEdit = function(value,node,thisVal){

            var obj={
                "sess_id":vm.sess_id,
                "data":{
                        "insight_id": thisVal.insight_id,
                        "entity_id": thisVal.entity_id,
                        "type": thisVal.type,
                        "old_key": node.entity_key+"."+node.extracted_name,
                        "key": node.entity_key+"."+node.name,
                        "action": "upsert",
                        "doc_id":$stateParams.id,
                        "value":[{'element_id':value.element_id,'value':value.value,'page_number':value.page_num,'score':value.score,'is_checked': true}]
                      }
            };
            $scope.submitFeedback(obj);
        };

        vm.completeReview = function(){
            var text = $scope.recordData.properties.filename;
            var doc_id = $scope.currentDocId;
            vm.feedbackObj = [];
            $scope.extractOutputForFeedback = angular.copy($scope.extractOutput)
            vm.recursiveForFeedback($scope.extractOutputForFeedback);
            var temp = {}
            temp.root_id = $scope.root_id;
            temp.feedback = vm.feedbackObj;
            temp.doc_id = $scope.doc_id;
            ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to complete the review for '+"'"+text+"'"+' ?';
                  $scope.onConfirmActivation = function (){
                             ngDialog.close();
                             entityLinkingService.saveCompleteReviewEntLink({'data':temp,'sess_id':vm.sess_id}).then(function(resp){
                                  if(resp.data.status == "success"){

                                       $.UIkit.notify({
                                               message : resp.data.msg,
                                               status  : 'success',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });

                                       if(vm.loginDataObj.role == "sv"){
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

        vm.formatEntitiesForFeedback = function(data,type){
            if(type == 'attribute'){
                           if(data.is_changed){
                                       if(data.attr_delete){
                                               var newEntity_obj = {};
                                               newEntity_obj.insight_id = data.insight_id;
                                               newEntity_obj.action = 'delete';
                                               newEntity_obj.data  = {};
                                               newEntity_obj.data.attributes = {};
                                               for(var j=0;j<data.attributes.length;j++){
                                                    if(data.attributes[j].is_delete){
                                                        newEntity_obj.data.attributes[data.attributes[j].name] = [];
                                                        if(data.attributes[j].values!=undefined && data.attributes[j].values.length>0){
                                                            for(var k=0;k<data.attributes[j].values.length;k++){
                                                                if(!(data.attributes[j].values[k].is_delete)){
                                                                    var values = []
                                                                    values.push(data.attributes[j].values[k].value);
                                                                    values.push(data.attributes[j].values[k].id);
                                                                    newEntity_obj.data.attributes[data.attributes[j].name].push(values);
                                                                }
                                                            }
                                                        }
                                                    }
                                               }
                                               vm.feedbackObj.push(newEntity_obj);
                                       }

                                       var newEntity_obj = {};
                                       newEntity_obj.insight_id = data.insight_id;
                                       newEntity_obj.action = 'upsert';
                                       newEntity_obj.data  = {};
                                       newEntity_obj.data.entity_name = data.name;
                                       newEntity_obj.data.attributes = {};
                                       for(var j=0;j<data.attributes.length;j++){
                                            if(!data.attributes[j].is_delete){
                                                    var deleteAttrFlag = false;
                                                    if(!(data.attributes[j].name === data.attributes[j].extracted_name)){
                                                       if(!(data.attributes[j].is_newAttr)){
                                                           deleteAttrFlag = true;
                                                           var deleteAttr_obj = {};
                                                           deleteAttr_obj.insight_id = data.insight_id;
                                                           deleteAttr_obj.action = 'delete';
                                                           deleteAttr_obj.data  = {};
                                                           deleteAttr_obj.data.entity_name = data.name;
                                                           deleteAttr_obj.data.attributes = {};
                                                           deleteAttr_obj.data.attributes[data.attributes[j].extracted_name] = [];
                                                       }
                                                    }
                                                    newEntity_obj.data.attributes[data.attributes[j].name] = [];
                                                    if(data.attributes[j].values!=undefined && data.attributes[j].values.length>0){
                                                        for(var k=0;k<data.attributes[j].values.length;k++){
                                                            if(!(data.attributes[j].values[k].is_delete)){
                                                                var values = []
                                                                values.push(data.attributes[j].values[k].value);
                                                                values.push(data.attributes[j].values[k].id);
                                                                newEntity_obj.data.attributes[data.attributes[j].name].push(values);
                                                                if(deleteAttrFlag){
                                                                    deleteAttr_obj.data.attributes[data.attributes[j].extracted_name].push(values);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if(deleteAttrFlag){
                                                        vm.feedbackObj.push(deleteAttr_obj);
                                                    }

                                            }
                                       }
                                       vm.feedbackObj.push(newEntity_obj);

                           }

            }
            else if(type == 'entity'){
                if(!(data.is_changed && data.is_new && data.is_delete)){
                    if(data.is_delete){
                        var feedbackEntityObj = {};
                        feedbackEntityObj.insight_id = data.insight_id;
                        feedbackEntityObj.action ='delete';
                        vm.feedbackObj.push(feedbackEntityObj);
                    }
                }
            }
            else if(type == 'grouped_entity'){
                var flag = true;
                if(!(data.is_changed && data.is_new && data.is_delete)){
                    if(data.is_delete){
                        var feedbackEntityObj = {};
                        feedbackEntityObj.insight_id = data.parent_insight_id;
                        feedbackEntityObj.action ='delete';
                        feedbackEntityObj.data  = {};
                        feedbackEntityObj.data.attributes = {};
                        feedbackEntityObj.data.attributes[data.name] = [];
                        vm.feedbackObj.push(feedbackEntityObj);
                    }
                    else if(data.is_changed && data.is_new){
                        var newEntity_obj = {};
                        newEntity_obj.parent_insight_id = data.parent_insight_id;
                        newEntity_obj.action = 'upsert';
                        for(var i=0;i<data.groups.length;i++){
                           if(data.groups[i].is_delete){
                                if(!data.is_new){
                                    var feedbackEntityObj = {};
                                    feedbackEntityObj.insight_id = data.groups[i].insight_id;
                                    feedbackEntityObj.action ='delete';
                                    vm.feedbackObj.push(feedbackEntityObj);
                                }
                           }
                           else{
                               if(data.groups[i].type == 'attribute'){
                                   newEntity_obj.data  = {};
                                   newEntity_obj.data.entity_name = data.name;
                                   newEntity_obj.data.attributes = {};
                                   for(var j=0;j<data.groups[i].attributes.length;j++){
                                        if(!data.groups[i].attributes[j].is_delete){
                                            newEntity_obj.data.attributes[data.groups[i].attributes[j].name] = [];
                                            if(data.groups[i].attributes[j].values!=undefined && data.groups[i].attributes[j].values.length>0){
                                                for(var k=0;k<data.groups[i].attributes[j].values.length;k++){
                                                    if(!(data.groups[i].attributes[j].values[k].is_delete)){
                                                        var values = []
                                                        values.push(data.groups[i].attributes[j].values[k].value);
                                                        values.push(data.groups[i].attributes[j].values[k].id);
                                                        newEntity_obj.data.attributes[data.groups[i].attributes[j].name].push(values);
                                                    }

                                                }
                                            }
                                        }
                                   }
                                   vm.feedbackObj.push(newEntity_obj);
                               }
                           }
                        }

                    }
                    else{
                        for(var i=0;i<data.groups.length;i++){
                           if(data.groups[i].is_delete){
                                if(!data.is_new){
                                    var feedbackEntityObj = {};
                                    feedbackEntityObj.insight_id = data.groups[i].insight_id;
                                    feedbackEntityObj.action ='delete';
                                    vm.feedbackObj.push(feedbackEntityObj);
                                }
                           }
                           else if(data.groups[i].is_new){
                                var newEntity_obj = {};
                                newEntity_obj.parent_insight_id = data.parent_insight_id;
                                newEntity_obj.action = 'upsert';
                                if(data.groups[i].type == 'attribute'){
                                   newEntity_obj.data  = {};
                                   newEntity_obj.data.entity_name = data.name;
                                   newEntity_obj.data.attributes = {};
                                   for(var j=0;j<data.groups[i].attributes.length;j++){
                                        if(!data.groups[i].attributes[j].is_delete){
                                            newEntity_obj.data.attributes[data.groups[i].attributes[j].name] = [];
                                            if(data.groups[i].attributes[j].values!=undefined && data.groups[i].attributes[j].values.length>0){
                                                for(var k=0;k<data.groups[i].attributes[j].values.length;k++){
                                                    if(!(data.groups[i].attributes[j].values[k].is_delete)){
                                                        var values = []
                                                        values.push(data.groups[i].attributes[j].values[k].value);
                                                        values.push(data.groups[i].attributes[j].values[k].id);
                                                        newEntity_obj.data.attributes[data.groups[i].attributes[j].name].push(values);
                                                    }

                                                }
                                            }
                                        }
                                   }
                                   vm.feedbackObj.push(newEntity_obj);
                                }

                           }
                           else{

                               if(data.groups[i].type == 'attribute'){
                                   if(data.groups[i].is_changed){
                                       if(data.groups[i].attr_delete){
                                               var newEntity_obj = {};
                                               newEntity_obj.insight_id = data.groups[i].insight_id;
                                               newEntity_obj.action = 'delete';
                                               newEntity_obj.data  = {};
                                               newEntity_obj.data.attributes = {};
                                               for(var j=0;j<data.groups[i].attributes.length;j++){
                                                    if(data.groups[i].attributes[j].is_delete){
                                                        newEntity_obj.data.attributes[data.groups[i].attributes[j].name] = [];
                                                        if(data.groups[i].attributes[j].values!=undefined && data.groups[i].attributes[j].values.length>0){
                                                            for(var k=0;k<data.groups[i].attributes[j].values.length;k++){
                                                                if(!(data.groups[i].attributes[j].values[k].is_delete)){
                                                                    var values = []
                                                                    values.push(data.groups[i].attributes[j].values[k].value);
                                                                    values.push(data.groups[i].attributes[j].values[k].id);
                                                                    newEntity_obj.data.attributes[data.groups[i].attributes[j].name].push(values);
                                                                }
                                                            }
                                                        }
                                                    }
                                               }
                                               vm.feedbackObj.push(newEntity_obj);
                                       }

                                       var newEntity_obj = {};
                                       newEntity_obj.insight_id = data.groups[i].insight_id;
                                       newEntity_obj.action = 'upsert';
                                       newEntity_obj.data  = {};
                                       newEntity_obj.data.entity_name = data.name;
                                       newEntity_obj.data.attributes = {};
                                       for(var j=0;j<data.groups[i].attributes.length;j++){
                                            if(!data.groups[i].attributes[j].is_delete){
                                                    var deleteAttrFlag = false;
                                                    if(!(data.groups[i].attributes[j].name === data.groups[i].attributes[j].extracted_name)){
                                                       if(!(data.groups[i].attributes[j].is_newAttr)){
                                                           deleteAttrFlag = true;
                                                           var deleteAttr_obj = {};
                                                           deleteAttr_obj.insight_id = data.groups[i].insight_id;
                                                           deleteAttr_obj.action = 'delete';
                                                           deleteAttr_obj.data  = {};
                                                           deleteAttr_obj.data.entity_name = data.name;
                                                           deleteAttr_obj.data.attributes = {};
                                                           deleteAttr_obj.data.attributes[data.groups[i].attributes[j].extracted_name] = [];
                                                       }
                                                    }
                                                    newEntity_obj.data.attributes[data.groups[i].attributes[j].name] = [];
                                                    if(data.groups[i].attributes[j].values!=undefined && data.groups[i].attributes[j].values.length>0){
                                                        for(var k=0;k<data.groups[i].attributes[j].values.length;k++){
                                                            if(!(data.groups[i].attributes[j].values[k].is_delete)){
                                                                var values = []
                                                                values.push(data.groups[i].attributes[j].values[k].value);
                                                                values.push(data.groups[i].attributes[j].values[k].id);
                                                                newEntity_obj.data.attributes[data.groups[i].attributes[j].name].push(values);
                                                                if(deleteAttrFlag){
                                                                    deleteAttr_obj.data.attributes[data.groups[i].attributes[j].extracted_name].push(values);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if(deleteAttrFlag){
                                                        vm.feedbackObj.push(deleteAttr_obj);
                                                    }

                                            }
                                       }
                                       vm.feedbackObj.push(newEntity_obj);

                                   }
                               }
                           }
                        }

                    }
                }
            }
        };

        vm.recursiveForFeedback = function(data){
            for(var i=0;i<data.length;i++){
                   if(data[i].type=='grouped_entity' || data[i].type == 'attribute'){
                      vm.formatEntitiesForFeedback(data[i],data[i].type);

                   }
                   else if(data[i].type=='entity' || data[i].type=='domain'){
                        vm.formatEntitiesForFeedback(data[i],data[i].type);
                        vm.recursiveForFeedback(data[i].attributes);
                   }


            }
        };

        vm.completeFeedback = function(){
            vm.feedbackObj = [];
            $scope.extractOutputForFeedback = angular.copy($scope.extractOutput)
            vm.recursiveForFeedback($scope.extractOutputForFeedback);
            var temp = {}
            temp.root_id = $scope.root_id;
            temp.feedback = vm.feedbackObj;
            temp.doc_id = $scope.doc_id;

            entityLinkingService.saveEntityLinkingFeedback({'data':temp,'sess_id':vm.sess_id}).then(function(resp){
                                  if(resp.data.status == "success"){

                                       $.UIkit.notify({
                                               message : resp.data.msg,
                                               status  : 'success',
                                               timeout : 3000,
                                               pos     : 'top-center'
                                       });
                                       vm.getGroups('load');

//                                       if(vm.loginDataObj.role == "sv"){
//                                            $state.go("app.supervisorDocumentsList",{"id":$stateParams.queue});
//                                       }
//                                       else{
//                                            $state.go("app.agentDocumentsList",{"id":$stateParams.queue});
//                                       }
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

        $scope.goToCaseDashboard = function(){
            if($scope.loginData.role == "sv"){
                $state.go("app.supervisorDocumentsList",{"id":$stateParams.queue});
            }
            else{
                $state.go("app.agentDocumentsList",{"id":$stateParams.queue});
            }
        };

        vm.stateChangeFunct = function(obj){
            entityLinkingService.saveChangedState({'data':obj,'sess_id':vm.sess_id}).then(function(resp){
                  if(resp.data.status == "success"){
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
            },function(err){
                  $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                  });
            });
        };

        vm.clearStateSelection = function(){
            vm.changedState = "";
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        };

        vm.saveStateChange = function(){
            var obj = {"doc_state": vm.changedState,"doc_id": $stateParams.id};
            if(vm.changedState != ""){
                ngDialog.open({ template: 'confirmBox1',
                  preCloseCallback:function(){ vm.clearStateSelection() },
                  controller: ['$scope','$state' ,function($scope,$state) {
                      $scope.activePopupText = 'Would you like to send this document to '+vm.changedState+'?';
                      $scope.onConfirmActivation = function (){
                            vm.stateChangeFunct(obj);
                            ngDialog.close();
                      };
                  }]
                });
            }
        };

        document.getElementById('content-wrapper').addEventListener('scroll', function (e) {
            $scope.current_page = Math.round(e.target.scrollTop / PAGE_HEIGHT) + 1;
            console.log('page_number'+ $scope.current_page);

        });

        document.getElementById('content-wrapper').addEventListener('scroll', function (e) {
            $scope.current_page = Math.round(e.target.scrollTop / PAGE_HEIGHT) + 1;
            console.log('page_number'+ $scope.current_page);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }

        });


      /******************************************************************************
                Entity Linking code ends here
      ******************************************************************************/
      vm.collapsed = {};
        $scope.chnageIcon =function(collapse,temp_id){
            vm.collapsed[temp_id] = !vm.collapsed[temp_id];
            console.log("collapse==>", vm.collapsed[temp_id]);
        };




}];