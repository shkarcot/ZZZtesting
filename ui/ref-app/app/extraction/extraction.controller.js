module.exports = ['$scope', '$rootScope', 'ngDialog', '$state', '$stateParams', '$location', '$anchorScroll', 'reviewService', 'processDetailsServices', 'documentsListService', 'extractionService', '$window', '$sce', function ($scope, $rootScope, ngDialog, $state, $stateParams, $location, $anchorScroll, reviewService, processDetailsServices, documentsListService, extractionService, $window, $sce) {
    'use strict';

    var vm = this;
    window.scrollTo(0, 0);
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    vm.sess_id = $scope.loginData.sess_id;
    vm.loginDataObj = $scope.loginData;
    $scope.showDomainTab = false;
    $scope.height = $window.innerHeight - 96;
    $scope.pdfHeight = $window.innerHeight - 130;
    $scope.elementHeight = $window.innerHeight - 240;
    $scope.url = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    $scope.getDemo = false;
    $rootScope.inSolution = true;
    $scope.showNavigation = false;
    $scope.entitiesData = [];
    $scope.rowHighlight = [];
    $scope.selectedEleId = '';
    $scope.tableEleId = '';
    $scope.rowObj = {};
    $scope.tableRow = [];
    $scope.newNode = '';
    $scope.currentDocId = $stateParams.id;
    $scope.checkObj = {};
    $scope.checkObj.accept = true;
    $scope.checkObj.correct = true;
    $scope.checkObj.review = true;
    $scope.headersDisplayLength = 4;
    vm.showPopup = {};
    vm.showPopup.popup = false;
    vm.showPopupConfirm = false;
    vm.annotatinclickfromjs = false;


    $scope.coordinatesDisplay = [];
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
                annotation.uuid = existingnode.temp_id;


                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + existingnode.uuid + "']")
                allrect.forEach(function (rect) {
                    //rect.setAttribute("stroke", "yellow");
                    rect.remove();
                });


                //UI.disableEdit();
                vm.updateNode(existingnode, existingnode.typeoffield);
                $scope.annotations.push(existingnode);

            }else if (vm.newcell) {

                annotation.uuid = vm.newcelldata.temp_id;
                existingnode = annotation;
                vm.adddatatoTable(existingnode);
                $scope.annotations.push(existingnode);
            }else if(vm.newCoordinatesForUpdateNodeFlag){
                annotation.uuid = vm.newCoordinatesForUpdateNodeObj.temp_id;
                if(vm.labelEditAnnotation)
                  annotation.uuid = vm.newCoordinatesForUpdateNodeObj.temp_id_key;
                existingnode = annotation;
                vm.adddatatoNode(existingnode);
                $scope.annotations.push(existingnode);
                vm.newCoordinatesForUpdateNodeFlag = false;
            }
            else {
                vm.addnewAnnotation(annotation);
                existingnode = annotation;
            }
            disableDrawRect("area");
            return new Promise((resolve, reject) => {

                resolve(existingnode);
            });


        },

        editAnnotation(documentId, pageNumber, annotation) {


            vm.selectedNode = annotation;
            for (var i = 0; i < $scope.annotations.length; i++) {
                if ($scope.annotations[i].uuid == annotation.uuid) {
                    $scope.annotations[i] = annotation;
                    break;
                }
            }

            let p = document.getElementById("pdf-annotate-edit-overlay");
            if (p) {
                p.remove();
            }
            vm.updateNode(annotation, annotation.typeoffield);
            disableDrawRect("area");

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
                    if($scope.annotations[i].temp_id_key){
                        vm.editablelabelnode($scope.annotations[i]);
                    }else{
                        vm.editablenode($scope.annotations[i]);
                    }
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

            // UI.renderPage(1, RENDER_OPTIONS).then(([pdfPage, annotations]) => {
            //     let viewport = pdfPage.getViewport(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate);
            //     PAGE_HEIGHT = viewport.height;
            // });

            if (vm.selectedNode != null) {
                setTimeout(function () {
                    setrectColor("transparent");
                    setHeilight(vm.selectedNode.regions[0].uuid);
                    handleannotationrightclick(vm.selectedNode.regions[0], vm.selectedNode);
                }, 300)

            }
            UI.disableEdit();

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
                rect.setAttribute("fill", stroke);
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



    function handleAnnotationClick(target) {
       if(target==null)
            return;
        $scope.rowHighlight = [];
        if(!vm.annotatinclickfromjs && document.getElementsByClassName(target.dataset.pdfAnnotateId) && document.getElementsByClassName(target.dataset.pdfAnnotateId)[0]){
            document.getElementsByClassName(target.dataset.pdfAnnotateId)[0].scrollIntoView();
            var p = document.getElementsByClassName(target.dataset.pdfAnnotateId)[0];
            if(!p.closest("ol").classList.contains("in")){
                var s = p.closest("ol").closest("li");
                s.querySelector(".nodetoggle").click();
            };
//            if(!p.parentElement.classList.contains("in")){
//              p.parentElement.parentElement.querySelectorAll(".nodetoggle")[0].click();
//            }

            $scope.rowHighlight[target.dataset.pdfAnnotateId] = 'highlightClass';
            UI.disableEdit();
        }
        if($scope.$root){
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
            }
        }
        disableDrawRect("area");
    }

    UI.addEventListener('annotation:click', handleAnnotationClick);

    /* extractioncode ends */

    vm.handleNewTabledata = function (obj) {
        if (obj.new_cell) {
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].new_cell = false;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x1 = obj.regions[0].x1;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y1 = obj.regions[0].y1;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x2 = obj.regions[0].x2;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y2 = obj.regions[0].y2;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].page_num = obj.regions[0].page_num;
        } else {
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x1 = obj.x;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y1 = obj.y;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x2 = obj.x + obj.width;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y2 = obj.y + obj.height;
            vm.newElement.cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].page_num = obj.page;
        }


    }
    vm.updaterightsideObject = function (obj, elements) {
        var key;
        if (vm.newElement == {}) {
            vm.handleNewTabledata(obj);
            vm.newcelldata = angular.copy({});
            return;
        }

        for (var i = 0; i < elements.length; i++) {
            if (elements[i].type == "section") {
                key = vm.updaterightsideObject(obj, elements[i].elements);
            } else {
                if(elements[i].type =='list'){
                   for(var j=0;j<elements[i].children.length;j++){
                        if (elements[i].children[j].temp_id == obj.temp_id) {
                                elements[i].children[j].regions[0].x1 = obj.x;
                                elements[i].children[j].regions[0].y1 = obj.y;
                                elements[i].children[j].regions[0].x2 = obj.x + obj.width;
                                elements[i].children[j].regions[0].y2 = obj.y + obj.height;
                                elements[i].children[j].regions[0].page_num = obj.page;
                                break;


                        }
                   }
                   key = elements[i];

                  break;
                }

                if (elements[i].id == obj.id) {

                    // console.log("need to update", elements[i]);
                    if (elements[i].type != "table") {
                        if(elements[i].type =='field'){
                            if(vm.labelEditAnnotation){
                                if(elements[i].temp_id_key == obj.uuid){
                                    if(elements[i].key.regions.length==0 || elements[i].key.regions==undefined){
                                        elements[i].key.regions = [{}];
                                    }
                                    elements[i].key.regions[0].x1 = obj.x;
                                    elements[i].key.regions[0].y1 = obj.y;
                                    elements[i].key.regions[0].x2 = obj.x + obj.width;
                                    elements[i].key.regions[0].y2 = obj.y + obj.height;
                                    elements[i].key.regions[0].page_num = obj.page;
                                    elements[i].is_changed = true;
                                }
                            }
                            else{
                                elements[i].value.regions[0].x1 = obj.x;
                                elements[i].value.regions[0].y1 = obj.y;
                                elements[i].value.regions[0].x2 = obj.x + obj.width;
                                elements[i].value.regions[0].y2 = obj.y + obj.height;
                                elements[i].value.regions[0].page_num = obj.page;
                                elements[i].is_changed = true;
                            }
                        }else{
                            elements[i].regions[0].x1 = obj.x;
                            elements[i].regions[0].y1 = obj.y;
                            elements[i].regions[0].x2 = obj.x + obj.width;
                            elements[i].regions[0].y2 = obj.y + obj.height;
                            elements[i].regions[0].page_num = obj.page;
                            elements[i].is_changed = true;
                        }
                    } else if (elements[i].type == "table") {
                        if (obj.new_cell) {

                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].new_cell = false;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x1 = obj.regions[0].x1;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y1 = obj.regions[0].y1;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x2 = obj.regions[0].x2;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y2 = obj.regions[0].y2;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].page_num = obj.regions[0].page_num;
                        } else {
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x1 = obj.x ? obj.x:obj.regions[0].x1;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y1 = obj.y ? obj.x:obj.regions[0].y1;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].x2 = obj.x ?  (obj.x + obj.width) : obj.regions[0].x2;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].y2 = obj.y ?  (obj.y +obj.height) : obj.regions[0].y2;
                            elements[i].cells_reconstructed[vm.newcelldata.line_no][vm.newcelldata.col_no].regions[0].page_num = obj.page? obj.page : obj.regions[0].page_num;
                        }
                    }

                    key = elements[i];

                    break;
                }
            }
            if (key) {

                return key;
            }
        }
    };

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

    vm.editablenode = function (node) {
        $scope.updatewithnewannotationNode = true;
        $scope.updannotation = node;
    }
    vm.editablelabelnode = function (node) {
        vm.newCoordinatesForUpdateNodeFlag = true;
        vm.newCoordinatesForUpdateNodeObj = node;
    }

    vm.navigatePage = function (type) {

        if (type == 'next') {
            $scope.nextClass = 'nextCursor';
            var rec_num = $scope.filter_obj.current_record_no + 1;
            if (rec_num < $scope.recentRecords.length) {
                var prop = 'none';
                if ($scope.recentRecords[rec_num].is_digital) {
                    prop = 'digital';
                }
                $scope.filter_obj.current_record_no = rec_num;
                localStorage.setItem('filterObj', JSON.stringify($scope.filter_obj))
                $state.go("app.review", { id: $scope.recentRecords[rec_num].doc_id, type: prop, queue: $stateParams.queue }, { reload: true })
            }
            else {
                $scope.filter_obj.page_num = $scope.filter_obj.page_num + 1;
                $scope.filter_obj.current_record_no = -1;
                $scope.getDocumentsListData(type);

            }
        }
        else if (type == 'prev') {
            $scope.prevClass = 'prevCursor';
            var rec_num = $scope.filter_obj.current_record_no - 1;
            if (rec_num >= 0) {
                var prop = 'none';
                if ($scope.recentRecords[rec_num].is_digital) {
                    prop = 'digital';
                }
                $scope.filter_obj.current_record_no = rec_num;
                localStorage.setItem('filterObj', JSON.stringify($scope.filter_obj))
                $state.go("app.review", { id: $scope.recentRecords[rec_num].doc_id, type: prop, queue: $stateParams.queue }, { reload: true })
            }
            else {
                $scope.filter_obj.page_num = $scope.filter_obj.page_num - 1;
                $scope.filter_obj.current_record_no = $scope.recentRecords.length;
                $scope.getDocumentsListData(type);

            }
        }
    };

    $scope.updateFilterObj = function (type) {
        $scope.filter_obj = JSON.parse(localStorage.getItem('filterObj'));
        if ($scope.filter_obj == null || $scope.filter_obj == undefined) {
            $scope.showNavigation = false;
        }
        else {
            if ($scope.filter_obj.hasOwnProperty('current_record_no')) {
                $scope.showNavigation = true;
                $scope.recentRecords = JSON.parse(localStorage.getItem('recentRecords'));
                if ($scope.recentRecords == null || $scope.recentRecords == undefined) {
                } else {
                    $scope.total_records = $scope.filter_obj.totalRecords;
                    //vm.documentType = $scope.recentRecords[$scope.filter_obj.current_record_no].mime_type;
                    $scope.no_of_records = (($scope.filter_obj.page_num - 1) * $scope.filter_obj.no_of_recs) + $scope.filter_obj.current_record_no + 1;
                }
            }
            else {
                $scope.showNavigation = false;
            }

        }

        vm.navigatePage(type);
    };

    $scope.updateFilterObj('none');

    if ($stateParams.type.toLowerCase() != "digital") {



        $scope.colorCodes = {
            'orange_border': '#fb9019',
            'green_border': '#26ce3f',
            'blue_border': '#4a90e2'
        }

        vm.storeAnnotations = function(type, item, fieldType){
            if(item.regions!=undefined){
                    for (var i = 0; i < item.regions.length; i++) {
                        var obj = angular.copy(item);
                        if (fieldType == "table")
                            obj.type = fieldType;
                        obj.x = obj.regions[i].x1;
                        obj.width = obj.regions[i].x2 - obj.regions[i].x1;
                        obj.y = obj.regions[i].y1;
                        obj.height = obj.regions[i].y2 - obj.regions[i].y1;
                        obj.is_display = true;
                        obj.color = $scope.colorCodes.orange_border;
                        obj.bgColor = $scope.colorCodes.orange_border;
                        if (obj.temp_id == undefined) {
                            obj.temp_id = $scope.uniqueIdGenerator();
                        }
                        item.temp_id = obj.temp_id;
                        obj.class = "Annotation";
                        obj.page = obj.regions[i].page_num;
                        obj.typeoffield = angular.copy(obj.node_type);
                        obj.type = "area";
                        obj.uuid = obj.temp_id;
                        obj.documentId = vm.pdfSrc;
                        obj.status = "review";
                        if (obj.is_accept) {
                            obj.color = $scope.colorCodes.green_border;
                            obj.bgColor = $scope.colorCodes.green_border;
                            obj.status = "accept";
                        }
                        if (obj.is_corrected) {
                            obj.color = $scope.colorCodes.blue_border;
                            obj.bgColor = $scope.colorCodes.blue_border;
                            obj.status = "correct";
                        }

                        obj.borderStyle = 'solid';
                        if (item.type == 'section') {
                            obj.is_display = false;
                            obj.borderStyle = 'dashed';
                        }
                        obj.page_num = obj.regions[i].page_num; //obj.regions[i].page_num;

                        //obj.index = $scope.drawer[obj.regions[i].page].length;
                        // item.drawerIndexObj['value' + i] = obj.index;
                        // $scope.drawer[obj.regions[i].page_num].push(obj);
                        $scope.annotations.push(obj);
                    }
            }
        };

        vm.updateDrawer = function (type, item, fieldType) {

            if (item.is_accept == undefined && item.is_corrected == undefined && item.need_review == undefined) {
                item.need_review = true;
            }
            if(item.node_type =='field'){
                if(item.key){
                    if($scope.template_type!='unknown')
                       item.key.name = item.name;
                    if (item.key.name != undefined && item.key.name != '') {
                        item.original_label = angular.copy(item.key.name);
                    } else {
                        if (item.key.text != undefined && item.key.text != '') {
                            item.original_label = angular.copy(item.key.text);
                        }
                    }
                }
                if(item.value){
                     if (item.value.text != undefined) {
                            item.original_text = angular.copy(item.value.text);
                     }
                }
            }
            else if(item.node_type=='paragraph' || item.node_type=='sentence' || item.node_type=='heading' || item.node_type=='table'){
                if (item.text != undefined) {
                            item.original_text = angular.copy(item.text);
                }
            }
            else if(item.node_type=='omr_field'){
                if (item.text != undefined && item.text != '') {
                            item.original_label = angular.copy(item.text);
                }
            }



            if(fieldType == 'list' || fieldType == 'table'){
                item.original_text = item.text;
            }

            if(item.regions!=undefined){
                if(item.new_cell){
                    item.coordinates_copy = [];
                }
                else{
                  if(item.node_type=='field'){
                     item.value.coordinates_copy = angular.copy(item.value.regions);
                  }
                  else{
                     item.coordinates_copy = angular.copy(item.regions);
                  }
                }
            }
            if(item.node_type=='omr_field'){
                item.groups_copy = angular.copy(item.fields);
            }
            if(item.node_type=='field'){
                item.value.temp_id = item.temp_id;
                vm.storeAnnotations(type, item.value, fieldType)
            }else{
               vm.storeAnnotations(type, item, fieldType)
            }
            if(item.node_type === 'field'){
                vm.updateLabelAnnotation(item)
            }
        };

        vm.updateLabelAnnotation = function(item){

            item.temp_id_key = item.temp_id+'_key';
            if(item.key.regions!=undefined){
                item.label_coordinates_copy = angular.copy(item.key.regions);
            }
            if(item.key.regions!=undefined){
                for (var i = 0; i < item.key.regions.length; i++) {
                    var obj = angular.copy(item);
                    obj.x = obj.key.regions[i].x1;
                    obj.width = obj.key.regions[i].x2 - obj.key.regions[i].x1;
                    obj.y = obj.key.regions[i].y1;
                    obj.height = obj.key.regions[i].y2 - obj.key.regions[i].y1;
                    obj.is_display = true;
                    obj.color = $scope.colorCodes.orange_border;
                    obj.bgColor = $scope.colorCodes.orange_border;
                    if (obj.temp_id == undefined) {
                        obj.temp_id = $scope.uniqueIdGenerator();
                    }
                    item.temp_id = obj.temp_id;
                    obj.class = "Annotation";
                    obj.page = obj.key.regions[i].page_num;
                    obj.typeoffield = angular.copy(obj.node_type);
                    obj.type = "area";
                    obj.temp_id_key = item.temp_id_key;
                    obj.uuid = obj.temp_id_key ;
                    obj.documentId = vm.pdfSrc;
                    obj.status = "review";
                    if (obj.is_accept) {
                        obj.color = $scope.colorCodes.green_border;
                        obj.bgColor = $scope.colorCodes.green_border;
                        obj.status = "accept";
                    }
                    if (obj.is_corrected) {
                        obj.color = $scope.colorCodes.blue_border;
                        obj.bgColor = $scope.colorCodes.blue_border;
                        obj.status = "correct";
                    }

                    obj.borderStyle = 'solid';
                    if (item.type == 'section') {
                        obj.is_display = false;
                        obj.borderStyle = 'dashed';
                    }
                    obj.page_num = obj.key.regions[i].page_num; //obj.regions[i].page_num;

                    //obj.index = $scope.drawer[obj.regions[i].page].length;
                    // item.drawerIndexObj['value' + i] = obj.index;
                    // $scope.drawer[obj.regions[i].page_num].push(obj);
                    $scope.annotations.push(obj);
                }
            }
        };



        vm.getAttributeByHierarchy = function (data) {

                vm.updateDrawer('value', data);

        };

        vm.getListByHierarchy = function (data) {

            vm.updateDrawer('value', data);
            if (data.children != undefined) {
                for (var i = 0; i < data.children.length; i++) {
                        vm.updateDrawer('value', data.children[i],'list');
                }
            }

        };

        vm.getTableheadersCalculation = function (value) {
            value.headings_copy = angular.copy(value.headings_reconstructed);
            value.columnStart = 1;
            value.columnEnd = $scope.headersDisplayLength;
            var headersLength = value.headings_reconstructed.length;
            var fraction = Math.ceil(headersLength / $scope.headersDisplayLength);
            var totalScrolls = fraction * $scope.headersDisplayLength;
            var missedHeadersLength = totalScrolls - headersLength;
            for (var i = 0; i < missedHeadersLength; i++) {
                value.headings_reconstructed.push([]);
            }


        };
        vm.getTableByHierarchy = function (value) {
            var j = 0;
            //               angular.forEach(value.tables.headings,function(obj,index){
            //                   value.tables.headings[index] = value.tables.headings[index].join("");
            //               });
            //               value.tables.headings = value.tables.headings.join();
            angular.forEach(value.cells_reconstructed, function (value1, key1) {
                var k = 0;

                angular.forEach(value1, function (value2, key2) {
                    if (key2 == "subheaders") {
                        if (value2.regions != undefined) {

                            if (value2.page_num != undefined)
                                value2.page_num = value2.page_num;
                            else
                                value2.page_num = value.page_num;


                            value2.id = value.id;
                            vm.updateDrawer('value', value2, 'table');

                        }
                    }
                    else {
                        if (value2.regions != undefined) {
                            if (value2.page_num != undefined)
                                value2.page_num = value2.page_num;
                            else
                                value2.page_num = value.page_num;


                            value2.id = value.id;
                            vm.updateDrawer('value', value2, 'table');

                        }
                        k++;
                    }
                })
                j++
            })
        };


        vm.recursiveByHierarchy = function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].node_type == 'section' || data[i].node_type == 'default_section') {
                    //vm.getAttributeByHierarchy(data[i]);
                    if(data[i].children)
                      vm.recursiveByHierarchy(data[i].children);

                }
                else {
                    if (data[i].node_type == 'table') {
                        vm.getTableheadersCalculation(data[i]);
                        vm.getTableByHierarchy(data[i])
                    }
                    else if (data[i].node_type == 'list') {
                        vm.getListByHierarchy(data[i]);
                    }
                    else
                        vm.getAttributeByHierarchy(data[i]);
                }

            }
        };

        vm.getresultByHierarchy = function () {
            vm.recursiveByHierarchy($scope.extractOutput);
        };







        vm.getGroups = function (type) {
            extractionService.getListOfGroups($stateParams.id, vm.sess_id).then(function (data) {
                if (data.data.status == "success") {
                        $scope.extractedData = data.data;
                        $scope.extractedElements = [];
                        $scope.extractedElements = $scope.extractedData.data.elements;
                        $scope.copyData = angular.copy($scope.extractedElements);
                        $scope.deepCopyOfSectionsData = { 'data': $scope.copyData };
                        $scope.volume = $scope.extractedData.volume;
                        $scope.recordData = $scope.extractedData.data.metadata;
                        $scope.reviewStatesList = $scope.extractedData.review_state;
                        $scope.doc_id = $scope.extractedData.data.doc_id;
                        $scope.root_id = $scope.extractedData.data.root_id;
                        $scope.template_type = $scope.extractedData.data.template_type;
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
                                    $scope.extractOutput = $scope.extractedElements;
                                    vm.getresultByHierarchy();

                                    RENDER_OPTIONS.documentId = "/static" + $scope.volume + $scope.recordData.properties.digital_pdf_resource.key;
                                    vm.pdfSrc = "/static" + $scope.volume + $scope.recordData.properties.digital_pdf_resource.key;

//                                    RENDER_OPTIONS.documentId = '/app/sharedPDFJS/cms.pdf';
//                                    vm.pdfSrc = "/app/sharedPDFJS/cms.pdf";

                                    vm.pdfinit();
                                    vm.render();
                                    $scope.setOrderForSpecificTime();

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
            }, function (err) {

            })
        };
        vm.getGroups('load');


        $scope.fieldCriteria = function (node) {
            if (node != undefined) {
                if (node.is_accept) {
                    return 'accepted1'
                }
                else if (node.is_corrected) {
                    return 'corrected1'
                }
                else {
                    return 'reviewed1'
                }
            }
        };

        $scope.excelBtnArr = [];
        $scope.excelBtnArr[0] = 'excel-back';
        $scope.getSheetData = function (index) {
            $scope.excelBtnArr = [];
            $scope.excelBtnArr[index] = 'excel-back';
            vm.renderHtml = $scope.pagesInfo[index].doc_html;
        };

        $scope.openId = function (id) {
            var str = id.split('_');
            var id = '';
            $('.collapse.in').removeClass('in');
            // $(".group"+''+data.groupName).addClass('in');
            // $(".group"+''+data.groupName).removeAttr( 'style' );
            // $(".showRow"+ ''+data.indexObj.childIndex).addClass('in');
            // $(".showRow"+''+data.indexObj.childIndex).removeAttr( 'style' );
            for (var i = 0; i < str.length; i++) {
                if (i == 0)
                    id = id + '' + str[i];
                else
                    id = id + '_' + str[i];

                $("." + id).addClass('in');
                $("." + id).removeAttr('style');
            }
        };


        vm.classLengths = function (node) {
            if (node.node_type == 'field') {
                return 'col-lg-6 col-md-6 col-sm-6 col-xs-6 image-padding';
            }
            else if (node.node_type == 'paragraph') {
                return 'col-lg-12 col-md-12 col-sm-12 col-xs-12 image-padding';
            }
            else if (node.node_type == 'sentence') {
                return 'col-lg-12 col-md-12 col-sm-12 col-xs-12 image-padding';
            }
            else if (node.node_type == 'heading') {
                return 'col-lg-6 col-md-6 col-sm-6 col-xs-6 image-padding';
            }
            else {
                return 'col-lg-12 col-md-12 col-sm-12 col-xs-12 image-padding';
            }
        }

        vm.hideElement = function (node) {

            if (node.is_deleted) {
                return true;
            }
            if (node.is_accept && !$scope.checkObj.accept) {
                return true
            }
            if (node.is_corrected && !$scope.checkObj.correct) {
                return true
            }
            if (node.need_review && !$scope.checkObj.review) {
                return true
            }
            return false
        };

        vm.changeIntaraction = function (type, value) {

            filterRect(type, value);

        };



       $scope.setOrderForSpecificTime = function(){
            setTimeout(function(){
                document.getElementById('loadingpdf').style.display = 'block';
                setOrderForAnnotations();
            },3000);
       };

        vm.zoomIn = function () {
            var zoom = '';
            if (RENDER_OPTIONS.scale < 1.4) {
                let zoom = RENDER_OPTIONS.scale + 0.1
                handleZoom(zoom);
            }
            $scope.setOrderForSpecificTime();




        };

        vm.zoomReset = function(){
            handleZoom(0.17);
            $scope.setOrderForSpecificTime();
        };

        vm.zoomOut = function () {
            var zoom = '';
            if (RENDER_OPTIONS.scale > 0.1) {
                zoom = RENDER_OPTIONS.scale - 0.1;
                handleZoom(zoom);
            }

            $scope.setOrderForSpecificTime();


        };





        vm.showallAnnotations = function () {
            setrectColor("yellow");
            UI.disableEdit();
        };

        vm.disableSelector = function () {
            vm.selectedNode=null;

            setTimeout(() => {
                vm.showallAnnotations();
            }, 300);
            $scope.setOrderForSpecificTime();

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
            if (event.which === 13) {
                if ($scope.current_page <= $scope.no_of_pages) {
                    if ($scope.current_page > 0) {
                        var zoomVal = $('.' + $scope.zoomDisplay).css("zoom");
                        setTimeout(function () {
                            var topPos = document.getElementById('page_' + $scope.current_page).offsetTop;
                            var scrollingElement = angular.copy(topPos * zoomVal);
                            document.getElementById('scrollImage').scrollTop = scrollingElement;
                        }, 100);
                    }
                    else {
                        $.UIkit.notify({
                            message: 'Please Enter Page number',
                            status: 'warning',
                            timeout: 3000,
                            pos: 'top-center'
                        });
                    }
                }
                else {
                    $.UIkit.notify({
                        message: 'Please Enter Page number less than no.of pages',
                        status: 'warning',
                        timeout: 3000,
                        pos: 'top-center'
                    });
                }
            }
        };

        vm.resetDeletedElement = function(){
            if ($scope.updatewithnewannotationNode == true) {
                document.querySelectorAll("[data-pdf-annotate-page='" + $scope.updannotation.page + "']")[0].appendChild($scope.existtarget);
                $scope.annotations.push($scope.updannotation);
                $scope.updannotation = {};
                $scope.updatewithnewannotationNode = false;
            }
        };

        vm.resetLabelDeletedElement = function(){
            if (vm.newCoordinatesForUpdateNodeFlag == true) {
                document.querySelectorAll("[data-pdf-annotate-page='" + vm.newCoordinatesForUpdateNodeObj.page + "']")[0].appendChild($scope.existtarget);
                $scope.annotations.push(vm.newCoordinatesForUpdateNodeObj);
                // $scope.MyStoreAdapter.addAnnotation(vm.pdfSrc,$scope.updannotation.page,$scope.updannotation);

                vm.newCoordinatesForUpdateNodeObj = {};
                vm.newCoordinatesForUpdateNodeFlag = false;
            }
        };

        vm.getCurrentValue = function (node,type) {
            vm.resetDeletedElement();
            vm.resetLabelDeletedElement();
            if(type==undefined){
                vm.resetAllEvents();
            }
            $scope.rowHighlight = [];
            $scope.rowHighlight[node.temp_id] = 'highlightClass';


            var pageNum = 1;
            $scope.current_page = 1;
            if(node.node_type=='field'){
                setrectColor("transparent");
                setHeilight(node.value.temp_id);
                let p = document.getElementById("pdf-annotate-edit-overlay");
                if (p) {
                    p.remove();
                }
                UI.disableEdit();
                if(node.value.regions!=undefined){
                    if (node.value.regions.length>0) {
                        pageNum = node.value.regions[0].page_num;
                        $scope.current_page = node.value.regions[0].page_num;
                        var scalerender = RENDER_OPTIONS.scale * 100;
                        var scaleheight = ((scalerender * node.value.regions[0].y1) / 100);
                        var scalewidth = ((scalerender *  node.value.regions[0].x1)/100);
                        document.getElementById('content-wrapper').scrollTop = ((parseInt(pageNum) - 1) * PAGE_HEIGHT) + scaleheight;
                        document.getElementById('content-wrapper').scrollLeft = scalewidth ;
                    }
                }
            }else{
                setrectColor("transparent");
                setHeilight(node.temp_id);
                let p = document.getElementById("pdf-annotate-edit-overlay");
                if (p) {
                    p.remove();
                }
                UI.disableEdit();
                if(node.regions!=undefined){
                    if (node.regions.length>0) {
                        pageNum = node.regions[0].page_num;
                        $scope.current_page = node.regions[0].page_num;
                        var scalerender = RENDER_OPTIONS.scale * 100;
                        var scaleheight = ((scalerender * node.regions[0].y1) / 100);
                        var scalewidth = ((scalerender *  node.regions[0].x1)/100);
                        document.getElementById('content-wrapper').scrollTop = ((parseInt(pageNum) - 1) * PAGE_HEIGHT) + scaleheight;
                        document.getElementById('content-wrapper').scrollLeft = scalewidth ;
                    }
                }
            }
            if(node.node_type==='field'){
                if (node.key.regions.length>0) {
                    setHeilight(node.temp_id_key);
                }
            }


            return;

        };










        vm.deleteElementData = function (node,type) {
            node.is_deleted = true;
            node.is_changed = true;
            if(type==='table'){
                for (var i=0; i<node.cells_reconstructed.length; i++) {
                    var size = Object.keys(node.cells_reconstructed[i]).length;
                    for (var j=0; j<size; j++) {
                        var index = -1;
                        for (var k = 0; k < $scope.annotations.length; k++) {
                            if ($scope.annotations[k].uuid == node.cells_reconstructed[i][j].temp_id) {
                                index = k;
                                break;
                            }
                        }
                        if (index > -1) {
                            $scope.annotations.splice(index, 1);
                            var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.cells_reconstructed[i][j].temp_id + "']")
                            allrect[0].remove();
                        }
                    }
                }
            }else{
                var index = -1;
                for (var i = 0; i < $scope.annotations.length; i++) {
                    if ($scope.annotations[i].uuid == node.temp_id) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    $scope.annotations.splice(index, 1);
                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.temp_id + "']")
                    allrect[0].remove();
                }
            }


        }

        $scope.deleteField = function (node,type) {
            if (vm.showPopupConfirm) {
                vm.deleteElementData(node);
                vm.disableSelector();
                //vm.sendFeedback(node, 'delete');
            }
            else {
                ngDialog.open({
                    template: 'confirmEntityBox',
                    controller: ['$scope', '$state', function ($scope, $state) {
                        $scope.activePopupText = 'Are you sure you want to delete the element  ?';
                        $scope.onConfirmActivation = function (flag) {
                            if (flag) {
                                vm.showPopupConfirm = true;
                            }
                            ngDialog.close();
                            vm.deleteElementData(node,type);
                            //vm.disableSelector();
                            //vm.sendFeedback(node, 'delete')


                        };
                    }]
                });
            }
        };


        $scope.saveField = function (node, type) {
            if (type == undefined) {
                if (node.text != node.original_text) {
                    vm.sendFeedback(node, 'edit');
                }

            }
            else if (type == 'key') {

                if (node.name != undefined && node.name != '') {
                    if (node.name != node.original_label) {
                        vm.sendFeedback(node, 'edit');
                    }
                } else {
                    if (node.label != undefined && node.label != '') {
                        if (node.label != node.original_label) {
                            vm.sendFeedback(node, 'edit');
                        }
                    }
                }

            }
            else if (type == 'list') {
                var nodeCopy = angular.copy(node);
                if (nodeCopy.list_elements != undefined && nodeCopy.list_elements.length > 0) {
                    for (var i = 0; i < nodeCopy.list_elements.length; i++) {
                        nodeCopy.is_corrected = true;
                        nodeCopy.is_accept = false;
                        nodeCopy.need_review = false;
                        delete nodeCopy.list_elements[i].drawerIndexObj;
                        delete nodeCopy.list_elements[i].original_text;
                        for (var j = 0; j < nodeCopy.list_elements[i].regions.length; j++) {
                            delete nodeCopy.list_elements[i].regions[j].slice_id;
                        }
                    }
                }
                vm.sendFeedback(nodeCopy, 'edit', 'list');


            }

        };

        $scope.saveTableField = function (node) {
            node.is_corrected = true;
            $scope.selectedEleId = '';
            $scope.tableEleId = '';
            if (node.tables != undefined) {
                if (node.cells_reconstructed != undefined) {
                    var obj = node.cells_reconstructed[$scope.rowObj.index][$scope.rowObj.key];
                    obj.id = node.id;
                    $scope.rowObj = {};
                    $scope.tableEleId = '';
                    vm.sendFeedback(obj, 'edit')
                }
            }
        };

        $scope.saveOMRField = function (node) {
            node.is_corrected = true;
            $scope.selectedEleId = '';
            vm.sendFeedback(node, 'edit', 'omr');
        };

        vm.sendFeedback = function (node, type, fieldType) {
            var temp = {}
            temp.id = node.id;
            temp.request_type = 'extract_text';
            temp.doc_id = $scope.currentDocId;
            temp.feedback = [];
            var info = {}
            info.insight_id = node.insight_id;
            info.text = node.text;
            var nodeCopy = angular.copy(node.regions);
            info.regions = nodeCopy;
            for (var i = 0; i < info.regions.length; i++) {
                delete info.regions[i].slice_id
            }
            if (node.name != undefined && node.name != '') {
                info.name = node.name
            } else {
                if (node.label != undefined && node.label != '') {
                    info.label = node.label
                }
            }
            info.feedback_type = type;
            if (fieldType == 'omr') {
                info.groups = node.groups;
            }
            if (fieldType == 'list') {
                info.list_elements = node.list_elements;
            }
            if (type == 'delete') {
                info.is_deleted = true;
            }
            if (node.slice_path != undefined) {
                info.slice_path = node.slice_path
            }
            temp.feedback.push(info)
            if ($scope.getDemo) {
                temp.demo_mode = true;
            }
            extractionService.saveFeedback({ 'data': temp, 'sess_id': vm.sess_id }).then(function (resp) {
                if (resp.data.status == "success") {

                }
                else {
                    $.UIkit.notify({
                        message: resp.data.msg,
                        status: 'danger',
                        timeout: 3000,
                        pos: 'top-center'
                    });
                }
            }, function (err) {
                $.UIkit.notify({
                    message: "Internal server error",
                    status: 'warning',
                    timeout: 3000,
                    pos: 'top-center'
                });
            });
        };
        vm.formatTableForFeedback = function(table){
           var flag = true;
//            var table_flag = myForm.$dirty
            if(table.is_changed || table.is_new){
                var originalHeadingLength = table.headings_reconstructed.length - table.headings_copy.length;
                for (var s = 0; s < originalHeadingLength; s++) {
                   table.headings_reconstructed.splice(table.headings_reconstructed.length - 1, 1)
                }
                delete table.columnEnd;
                delete table.columnStart;
                delete table.headings_copy;
                for(var i=0;i<table.cells_reconstructed.length;i++){
                    var size = table.headings_reconstructed.length;
                    for(var j=0;j<size;j++){
                        table.cells_reconstructed[i][j].row_no = i;
                        table.cells_reconstructed[i][j].col_no = j;
                        table.cells_reconstructed[i][j].col_name = table.headings_reconstructed[j][0];
                        delete table.cells_reconstructed[i][j].new_cell;

                    }
                }
                var obj = {};
                if(table.is_new){
                    if(table.is_deleted)
                               flag = false
                    obj.parent_insight_id = table.parent_insight_id;
                }
                else{
                    obj.insight_id = table.insight_id;
                }

                obj.action = 'upsert';
                if(table.is_deleted)
                    obj.action = 'delete';
                else{
                    obj.reformat = 'table';
                    obj.data = {};
                    obj.data.cells_reconstructed = table.cells_reconstructed;
                    obj.data.headings_reconstructed = table.headings_reconstructed;
                    obj.data.headers = table.headers;
                }
                if(flag)
                  vm.feedbackObj.push(obj);
            }
        };

        vm.formatElementsForFeedback = function(element){
            var flag = true;
            if(element.node_type == 'list'){
                element.is_changed = true;
            }
            if(element.is_changed){
                var obj = {};
                obj.action = 'upsert';

                if(element.is_new){
                        if(element.is_deleted)
                           flag = false
                    obj.parent_insight_id = element.parent_insight_id;
                }
                else{
                    obj.insight_id = element.insight_id;
                }

                if(element.is_deleted)
                   obj.action = 'delete';
                else{
                    obj.data = {};
                    if(element.regions!=undefined){
                        obj.data.regions = [];
                    }
                    angular.forEach(element.regions,function(value,key){
                        var coordinates_obj = {};
                        coordinates_obj.x1 = value.x1;
                        coordinates_obj.x2 = value.x2;
                        coordinates_obj.y1 = value.y1;
                        coordinates_obj.y2 = value.y2;
                        coordinates_obj.page_num = value.page_num;
                        obj.data.regions.push(coordinates_obj);
                    })
                    if(element.is_new)
                        obj.data.node_type = element.node_type;
                    if(element.node_type == 'field'){
                        obj.data.key = {};
                        obj.data.value = {};
                        obj.data.key.text = element.key.text;
                        obj.data.value.text = element.value.text;
                        if(element.key.regions!=undefined){
                            obj.data.key.regions = [];
                            angular.forEach(element.key.regions,function(value,key){
                                var coordinates_obj = {};
                                coordinates_obj.x1 = value.x1;
                                coordinates_obj.x2 = value.x2;
                                coordinates_obj.y1 = value.y1;
                                coordinates_obj.y2 = value.y2;
                                coordinates_obj.page_num = value.page_num;
                                obj.data.key.regions.push(coordinates_obj);
                            })
                        }
                        if(element.value.regions!=undefined){
                            obj.data.value.regions = [];
                            angular.forEach(element.value.regions,function(value1,key){
                                var coordinates_obj = {};
                                coordinates_obj.x1 = value1.x1;
                                coordinates_obj.x2 = value1.x2;
                                coordinates_obj.y1 = value1.y1;
                                coordinates_obj.y2 = value1.y2;
                                coordinates_obj.page_num = value1.page_num;
                                obj.data.value.regions.push(coordinates_obj);
                            })
                        }

                    }
                    else if(element.node_type == 'list'){
                        if(element.children!=undefined){

                          obj.data.children = [];
                          for(var i=0;i<element.children.length;i++){
                            var tempObj = {};
                            if(element.children[i].text)
                                tempObj.text = element.children[i].text;
                            if(element.children[i].regions)
                                tempObj.regions = element.children[i].regions;
                            if(element.children[i].id)
                                tempObj.id = element.children[i].id;
                            if(element.children[i].is_deleted)
                                tempObj.is_deleted = element.children[i].is_deleted;

                            obj.data.children.push(tempObj);

                          }
                          angular.forEach(obj.data.children,function(value,key){
                                value.node_type="sentence";
                                if(value.regions!=undefined && value.regions.length>0){
                                    $scope.coordinates_list = angular.copy(value.regions);
                                    value.regions = [];
                                    angular.forEach($scope.coordinates_list,function(value2,key2){
                                        var coordinates_obj = {};
                                        coordinates_obj.x1 = value2.x1;
                                        coordinates_obj.x2 = value2.x2;
                                        coordinates_obj.y1 = value2.y1;
                                        coordinates_obj.y2 = value2.y2;
                                        coordinates_obj.page_num = value2.page_num;
                                        value.regions.push(coordinates_obj);
                                    })

                                }
                          })
                        }
                    }
                    else if(element.node_type == 'omr_field'){
                        obj.data.regions = [];
                        if(element.regions!=undefined){
                            obj.data.regions = [];
                            angular.forEach(element.regions,function(value1,key){
                                var coordinates_obj = {};
                                coordinates_obj.x1 = value1.x1;
                                coordinates_obj.x2 = value1.x2;
                                coordinates_obj.y1 = value1.y1;
                                coordinates_obj.y2 = value1.y2;
                                coordinates_obj.page_num = value1.page_num;
                                obj.data.regions.push(coordinates_obj);
                            })
                            obj.data.fields = element.fields;
                        }
                    }
                    else{
                    obj.data.text = element.text;
                    }

                }
                if(flag)
                  vm.feedbackObj.push(obj);
            }
        };

        vm.recursiveForFeedback = function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].node_type == 'section' || data[i].node_type == 'default_section') {
                    vm.formatElementsForFeedback(data[i]);
                    if(data[i].children)
                       vm.recursiveForFeedback(data[i].children);


                }
                else {
                    if (data[i].node_type == 'table') {
                        vm.formatTableForFeedback(data[i]);
                    }
                    else{
                        vm.formatElementsForFeedback(data[i]);
                    }

                }

            }
        };






        vm.completeFedBack = function(){
            vm.feedbackObj = [];
            $scope.extractOutputForFeedback = angular.copy($scope.extractOutput)
            vm.recursiveForFeedback($scope.extractOutputForFeedback);
            var temp = {}
            temp.root_id = $scope.root_id;
            temp.feedback = vm.feedbackObj;
            temp.doc_id = $scope.doc_id;
            console.log(temp);
            extractionService.saveNewElement({ 'data': temp, 'sess_id': vm.sess_id }).then(function (resp) {
                if (resp.data.status == "success") {
                            $.UIkit.notify({
                                message: resp.data.msg,
                                status: 'success',
                                timeout: 3000,
                                pos: 'top-center'
                            });
                            vm.getGroups('load');

//                            if (vm.loginDataObj.role == "sv") {
//                                $state.go("app.supervisorDocumentsList", { "id": $stateParams.queue });
//                            }
//                            else {
//                                $state.go("app.agentDocumentsList", { "id": $stateParams.queue });
//                            }
                }
                else {
                    $.UIkit.notify({
                        message: resp.data.msg,
                        status: 'danger',
                        timeout: 3000,
                        pos: 'top-center'
                    });
                }
            }, function (err) {
                $.UIkit.notify({
                    message: "Internal server error",
                    status: 'warning',
                    timeout: 3000,
                    pos: 'top-center'
                });
            });
        };






    }
    else {

    }


    vm.renderHTMLData = function () {
        return $sce.trustAsHtml(vm.renderHtml);
    };

    vm.renderEmailHTMLData = function (data) {
        return $sce.trustAsHtml(data);
    };

    vm.showEmailAttachment = function (attachmentObj) {
        //alert(attachmentObj);
        var doc_id = attachmentObj.doc_id;
        var prop = "none";
        //$state.reload();
        $state.go("app.review", { id: doc_id, type: prop, queue: $stateParams.queue })
    };

    vm.updateNlp = function (obj, prop) {
        var sendObj = { "elements": obj, "doc_id": $stateParams.id };
        reviewService.sendEmailNlp({ 'data': sendObj, 'sess_id': vm.sess_id }).then(function (data) {
            if (data.data.status == "success") {
                $.UIkit.notify({
                    message: data.data.msg,
                    status: 'success',
                    timeout: 3000,
                    pos: 'top-center'
                });
            }
        }, function (err) {
            $.UIkit.notify({
                message: "Internal server error",
                status: 'warning',
                timeout: 3000,
                pos: 'top-center'
            });
        });
    };

    vm.newAttribute = function (action) {
        vm.newAttributeObj = angular.copy({ "attribute": "", "value": "", "action": action });
        vm.newAttributeShow = true;
    };

    vm.saveNewAttribute = function () {
        if (vm.newAttribute.attribute != "" && vm.newAttribute.attribute != undefined) {
            if (vm.newAttribute.value != "" && vm.newAttribute.value != undefined) {
                vm.emailEntities.fields[0].nlp.attributes.push(vm.newAttribute);
                reviewService.sendEmailNlp({ 'data': sendObj, 'sess_id': vm.sess_id }).then(function (data) {
                    if (data.data.status == "success") {
                        vm.newAttributeShow = false;
                        vm.newAttrErr = "";
                        $.UIkit.notify({
                            message: data.data.msg,
                            status: 'success',
                            timeout: 3000,
                            pos: 'top-center'
                        });
                    }
                }, function (err) {
                    vm.newAttrErr = "";
                    $.UIkit.notify({
                        message: "Internal server error",
                        status: 'warning',
                        timeout: 3000,
                        pos: 'top-center'
                    });
                });
            }
            else {
                vm.newAttrErr = "Please enter the value";
            }
        }
        else {
            vm.newAttrErr = "Please enter the attribute";
        }
    };

    vm.getAttributesList = function () {
        reviewService.getDomainObjects({ 'sess_id': vm.sess_id }).then(function (resp) {
            $scope.entitiesList = resp.data;
        }, function (err) {
            console.log(err)
            $.UIkit.notify({
                message: "Internal server error",
                status: 'warning',
                timeout: 3000,
                pos: 'top-center'
            });
        });
    };
    vm.getAttributesList();

    $scope.url = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    $scope.download = function () {
        var downloadUrl = $scope.url + '/api/download/json/' + $scope.doc_id + '/';
        window.location.assign(downloadUrl);
    };


    vm.keyOptions = { "field": "Field", "paragraph": "Paragraph", "sentence": "Sentence", "heading": "Heading", "list":"List", "table": "Table" };
    $scope.uniqueIdGenerator = function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    vm.elementObj = function(type){

        vm.newElement.coordinates_copy = [];
        vm.newElement.original_label = '';
        vm.newElement.original_text = '';
        vm.newElement.is_changed = true;
        vm.newElement.is_new = true;
        vm.newElement.regions = [];
        if(type){
            vm.newElement.key = {};
            vm.newElement.value = {};
            vm.newElement.node_type = "field";
            vm.newElement.label_coordinates_copy = [];
            vm.newElement.key.confidence = 100;
            vm.newElement.key.regions = [];
            vm.newElement.value.confidence = 100;
            vm.newElement.value.regions = [];
            vm.newElement.key.text = '';
            vm.newElement.value.text = '';
            vm.newElement.key.is_corrected = true;
            vm.newElement.key.is_accept = false;
            vm.newElement.key.need_review = false;
            vm.newElement.value.is_corrected = true;
            vm.newElement.value.is_accept = false;
            vm.newElement.value.need_review = false;
        }else{
            delete vm.newElement.key;
            delete vm.newElement.value;
            vm.newElement.text = '';
            vm.newElement.confidence = 100;
            vm.newElement.is_corrected = true;
            vm.newElement.is_accept = false;
            vm.newElement.need_review = false;
        }
    };

    vm.addNewNode = function (node) {
        $scope.rowHighlight = [];
        $scope.croppingError = false;
        $scope.cropMsg = '';
        $scope.newNode = node.insight_id;
        vm.newElement = {};
        vm.newElement.id = $scope.uniqueIdGenerator();
        vm.newElement.temp_id = node.insight_id + "_" + vm.newElement.id;
        vm.newElement.parent_insight_id = node.insight_id;
        vm.elementObj('field');
        UI.disableEdit();
        setrectColor("transparent");



    };

    vm.cancelNewnode = function () {
        $scope.croppingError = false;
        $scope.cropMsg = '';
        vm.showLabelCrop = false;
        vm.showCrop = false;
        var index = -1;
        if(vm.newElement.label_id!=undefined){
            for (var i = 0; i < $scope.annotations.length; i++) {
                if ($scope.annotations[i].uuid == vm.newElement.label_id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                $scope.annotations.splice(index, 1);
                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + vm.newElement.label_id + "']")
                allrect[0].remove();
            }


        }
        var index =-1;
        if(vm.newElement.value_id!=undefined){
            for (var i = 0; i < $scope.annotations.length; i++) {
                if ($scope.annotations[i].uuid == vm.newElement.value_id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                $scope.annotations.splice(index, 1);
                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + vm.newElement.value_id + "']")
                allrect[0].remove();
            }


        }
        if(vm.newElement.node_type=='table'){
            if(vm.newElement.cells_reconstructed!=undefined){
                if(vm.newElement.cells_reconstructed.length>0){
                    var originalHeadingLength = vm.newElement.headings_reconstructed.length - vm.newElement.headings_copy.length;
                    for (var s = 0; s < originalHeadingLength; s++) {
                       vm.newElement.headings_reconstructed.splice(vm.newElement.headings_reconstructed.length - 1, 1)
                    }
                    for(var i=0;i<vm.newElement.cells_reconstructed.length;i++){
                        var size = vm.newElement.headings_reconstructed.length;
                        for(var j=0;j<size;j++){
                            var index = -1;
                            for (var m = 0; m<$scope.annotations.length; m++) {
                                    if ($scope.annotations[m].uuid == vm.newElement.cells_reconstructed[i][j].temp_id) {
                                        index = m;
                                        break;
                                    }
                            }
                            if (index > -1) {
                                $scope.annotations.splice(index, 1);
                                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + vm.newElement.cells_reconstructed[i][j].temp_id + "']")
                                allrect[0].remove();
                            }



                        }
                    }
                }
            }
        }
        if(vm.newElement.node_type=='list'){
           for(var i=0;i<vm.newElement.children.length;i++){
                            var index = -1;
                            for (var m = 0; m<$scope.annotations.length; m++) {
                                    if ($scope.annotations[m].uuid == vm.newElement.children[i].temp_id) {
                                        index = m;
                                        break;
                                    }
                            }
                            if (index > -1) {
                                $scope.annotations.splice(index, 1);
                                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + vm.newElement.children[i].temp_id + "']")
                                allrect[0].remove();
                            }
           }
        }
        vm.newElement = {};
        $scope.newNode = '';
        vm.disableSelector();
        vm.resetAllEvents();

    };

    vm.addNewListItem = function(node,index){
            $scope.croppingError = false;
            $scope.cropMsg = '';
            var obj = {};
            obj.text = '';
            obj.regions = [];
            obj.temp_id = vm.newElement.temp_id+"_"+$scope.uniqueIdGenerator();
            obj.confidence = 100;
            vm.newElement.children.splice(index+1, 0, obj);
    };

    vm.addNewExistingListItem = function(node,index){
            $scope.croppingError = false;
            $scope.cropMsg = '';
            var obj = {};
            obj.text = '';
            obj.regions = [];
            obj.temp_id = node.temp_id+"_"+$scope.uniqueIdGenerator();
            obj.confidence = 100;
            node.children.splice(index+1, 0, obj);
    };

    vm.deleteNewListItem = function(node,indexVal){
            if(vm.newElement.children.length>1){
                var index = -1;
                for (var i = 0; i < $scope.annotations.length; i++) {
                    if ($scope.annotations[i].uuid == vm.newElement.children[indexVal].temp_id) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    $scope.annotations.splice(index, 1);
                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" +vm.newElement.children[indexVal].temp_id+ "']")
                    allrect[0].remove();
                }

                vm.newElement.children.splice(indexVal,1);
            }else{
                $scope.croppingError = true;
                $scope.cropMsg = 'At least on list item is needed';
            }
    };
    vm.deleteExistingListItem = function(node,indexVal){
            if(node.children.length>1){
                var index = -1;
                for (var i = 0; i < $scope.annotations.length; i++) {
                    if ($scope.annotations[i].uuid ==node.children[indexVal].temp_id) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    $scope.annotations.splice(index, 1);
                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" +node.children[indexVal].temp_id+ "']")
                    allrect[0].remove();
                }

                node.children[indexVal].is_deleted = true;
            }else{
                $scope.croppingError = true;
                $scope.cropMsg = 'At least on list item is needed';
            }
    };

    vm.cropLabelText = function () {
        if(vm.newElement.key.regions!=undefined){
            if(vm.newElement.key.regions.length>0){
                vm.editLabelCoordinates(vm.newElement);
                return;
            }
        }
        setrectColor("transparent");
        enableDrawRect("area");
        vm.newElement.clickType = 'label';
        //vm.enableSelector('new');

    };

    vm.cropText = function () {
//        var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + vm.newElement.temp_id + "']")
//        allrect.forEach(function (rect) {
//               rect.remove();
//        });
        if(vm.newElement.node_type==='field'){
            if(vm.newElement.value.regions!=undefined){
                if(vm.newElement.value.regions.length>0){
                    vm.editCoordinates(vm.newElement);
                    return;
                }
            }
        }
        else{
            if(vm.newElement.regions!=undefined){
                if(vm.newElement.regions.length>0){
                    vm.editCoordinates(vm.newElement);
                    return;
                }
            }
        }
        setrectColor("transparent");
        enableDrawRect("area");
        vm.newElement.clickType = 'value';

        //       vm.showCrop = true;
        //       vm.enableSelector('new');

    };

    vm.cropListText = function(data,index){
        if(vm.newElement.children[index].regions!=undefined){
            if(vm.newElement.children[index].regions.length>0){
                vm.newElement.children[index].node_type = 'sentence';
                vm.editCoordinates(vm.newElement.children[index]);
                return;
            }
        }
        setrectColor("transparent");
        enableDrawRect("area");
        vm.newElement.clickType = 'list';
        for(var i=0;i<vm.newElement.children.length;i++){
            if(vm.newElement.children[i].temp_id == data.temp_id){
                vm.newElement.children[i].is_changed = true;
            }else{
                vm.newElement.children[i].is_changed = false;
            }
        }
    }



    vm.adddatatoTable = function (newtableannotation) {
        var annotation = newtableannotation;
        var value_coordinates = {};
        value_coordinates = {};
        value_coordinates.x1 = annotation.x;
        value_coordinates.y1 = annotation.y;
        value_coordinates.x2 = annotation.x + annotation.width;
        value_coordinates.y2 = annotation.y + annotation.height;
        value_coordinates.page_num = annotation.page;
        vm.newcelldata.regions.push(value_coordinates);
        vm.updateDrawer('value',vm.newcelldata);
        vm.updaterightsideObject(vm.newcelldata, $scope.extractOutput);
        var newcell = vm.newcelldata;
        if (vm.clickedtype == false) {
            //vm.saveCell(newcell.line_no, newcell.col_no, annotation, annotation);
            vm.newcelldata = angular.copy({});
        }
    };

    vm.adddatatoNode = function (newtableannotation) {
        var annotation = newtableannotation;
        var value_coordinates = {};
        value_coordinates = {};
        value_coordinates.x1 = annotation.x;
        value_coordinates.y1 = annotation.y;
        value_coordinates.x2 = annotation.x + annotation.width;
        value_coordinates.y2 = annotation.y + annotation.height;
        value_coordinates.page_num = annotation.page;

        if(vm.labelEditAnnotation){
          vm.newCoordinatesForUpdateNodeObj.key.regions = [];
          vm.newCoordinatesForUpdateNodeObj.key.regions.push(value_coordinates);
          vm.updateLabelAnnotation(vm.newCoordinatesForUpdateNodeObj);
         }
        else{
          vm.newCoordinatesForUpdateNodeObj.regions = [];
          vm.newCoordinatesForUpdateNodeObj.regions.push(value_coordinates);
          vm.updateDrawer('value',vm.newCoordinatesForUpdateNodeObj);
        }
        vm.updaterightsideObject(vm.newCoordinatesForUpdateNodeObj, $scope.extractOutput);

    }

    vm.addnewAnnotation = function (newannotation) {
        var annotation = newannotation;
        var value_coordinates = {};
        value_coordinates = {};
        value_coordinates.x1 = annotation.x;
        value_coordinates.y1 = annotation.y;
        value_coordinates.x2 = annotation.x + annotation.width;
        value_coordinates.y2 = annotation.y + annotation.height;
        value_coordinates.page_num = annotation.page;
        //vm.newElement.temp_id = newannotation.uuid;

        // vm.newElement.type = vm.newElement.type;
        if (vm.newElement.clickType == 'label') {
            vm.newElement.key.regions = [];
            vm.newElement.key.regions.push(value_coordinates);
            newannotation.uuid =  vm.newElement.temp_id+'_key';
            vm.newElement.label_id = newannotation.uuid;
            vm.newElement.temp_id_key = newannotation.uuid;
            newannotation.temp_id_key = vm.newElement.temp_id_key;
            $scope.annotations.push(newannotation);
        }else if(vm.newElement.clickType == 'value') {
            if(vm.newElement.node_type=='field'){
                vm.newElement.value.regions = [];
                vm.newElement.value.regions.push(value_coordinates);
                newannotation.uuid =  vm.newElement.temp_id;
                vm.newElement.value_id = newannotation.uuid;
                vm.newElement.value.temp_id = vm.newElement.value_id;
                $scope.annotations.push(newannotation);
            }else{
                vm.newElement.regions = [];
                vm.newElement.regions.push(value_coordinates);
                newannotation.uuid =  vm.newElement.temp_id;
                vm.newElement.value_id = newannotation.uuid;
                $scope.annotations.push(newannotation);
            }
        }else if(vm.newElement.clickType == 'list'){
            for(var i=0;i<vm.newElement.children.length;i++){
                if(vm.newElement.children[i].is_changed){
                    vm.newElement.children[i].regions = [];
                    vm.newElement.children[i].regions.push(value_coordinates);
                    newannotation.uuid =  vm.newElement.children[i].temp_id;
                    vm.newElement.children[i].value_id = newannotation.uuid;
                    $scope.annotations.push(newannotation);
                }
            }
        }
        UI.disableRect();
    };
    vm.newcell = false;
    vm.editTableCoordinates = function (node, fullnode, line, col, newtable) {
        fullnode.is_changed = true;
        vm.labelEditAnnotation = false;
        vm.labelEditAnnotation = false;
        let p = document.getElementById("pdf-annotate-edit-overlay");
        if (p) {
            p.remove();
        }
        vm.clickedtype = newtable;
        vm.newcelldata = node;
        vm.newcelldata.line_no = line;
        vm.newcelldata.col_no = col;
        if (node.regions.length == 0) {
            enableDrawRect("area");
            setrectColor("transparent");
            vm.newcell = true;
            vm.newcelldata.temp_id = node.temp_id;
            return;
        } else {
            node.is_edit_coordinates = true;
            var annotationnode = node.regions[0];
            annotationnode.class = "Annotation";
            annotationnode.page = node.regions[0].page_num;
            annotationnode.type = "area";
            annotationnode.line_no = line;
            annotationnode.col_no = col;
            if (annotationnode.uuid == undefined) {
                annotationnode.uuid = node.temp_id;
            }
            annotationnode.documentId = vm.pdfSrc;
            annotationnode.x = annotationnode.x1;
            annotationnode.y = annotationnode.y1;
            annotationnode.width = annotationnode.x2;
            annotationnode.height = annotationnode.y2;
            setrectColor("transparent");
            disableDrawRect("area");
            setHeilight(annotationnode.uuid);
            vm.resetDeletedElement();

            handleannotationrightclick(annotationnode, node);
        }
    }
    vm.editCoordinates = function (node) {
        vm.labelEditAnnotation = false;
//        $scope.updannotation = {};
//        $scope.updatewithnewannotationNode = false;
        let p = document.getElementById("pdf-annotate-edit-overlay");
        if (p) {
            p.remove();
        }
        if(node.node_type=='field'){
                if(node.value.regions==undefined || node.value.regions.length==0){
                         enableDrawRect("area");
                         setrectColor("transparent");
                         vm.newCoordinatesForUpdateNodeFlag = angular.copy(true);
                         vm.newCoordinatesForUpdateNodeObj = node.value;
                }
                else{
                    node.is_edit_coordinates = true;
                    var annotationnode = node.value.regions[0];
                    annotationnode.class = "Annotation";
                    annotationnode.page = node.value.regions[0].page_num;
                    annotationnode.type = "area";
                    if (annotationnode.uuid == undefined) {
                        annotationnode.uuid = node.value.temp_id;
                    }
                    annotationnode.documentId = vm.pdfSrc;
                    annotationnode.x = annotationnode.x1;
                    annotationnode.y = annotationnode.y1;
                    annotationnode.width = annotationnode.x2;
                    annotationnode.height = annotationnode.y2;
                    setrectColor("transparent");
                    disableDrawRect("area");
                    setHeilight(annotationnode.uuid);
                    vm.resetDeletedElement();
                    handleannotationrightclick(annotationnode, node.value);
                }
        }else{
                if(node.regions==undefined || node.regions.length==0){
                     enableDrawRect("area");
                     setrectColor("transparent");
                     vm.newCoordinatesForUpdateNodeFlag = angular.copy(true);
                     vm.newCoordinatesForUpdateNodeObj = node;
        //             $scope.updatewithnewannotationNode = true;
        //             $scope.updannotation = node;
                }
                else{
                    node.is_edit_coordinates = true;
                    var annotationnode = node.regions[0];
                    annotationnode.class = "Annotation";
                    annotationnode.page = node.regions[0].page_num;
                    annotationnode.type = "area";
                    if (annotationnode.uuid == undefined) {
                        annotationnode.uuid = node.temp_id;
                    }
                    annotationnode.documentId = vm.pdfSrc;
                    annotationnode.x = annotationnode.x1;
                    annotationnode.y = annotationnode.y1;
                    annotationnode.width = annotationnode.x2;
                    annotationnode.height = annotationnode.y2;
                    setrectColor("transparent");
                    disableDrawRect("area");
                    setHeilight(annotationnode.uuid);
                    vm.resetDeletedElement();
                    handleannotationrightclick(annotationnode, node);
                }
        }
    };

   vm.editLabelCoordinates = function (node) {
        vm.labelEditAnnotation = true;
        vm.resetLabelDeletedElement();
        let p = document.getElementById("pdf-annotate-edit-overlay");
        if (p) {
            p.remove();
        }
        if(node.key.regions==undefined || node.key.regions.length==0){
             enableDrawRect("area");
             setrectColor("transparent");
             vm.newCoordinatesForUpdateNodeFlag = angular.copy(true);
             vm.newCoordinatesForUpdateNodeObj = node;
//             $scope.updatewithnewannotationNode = true;
//             $scope.updannotation = node;
        }
        else{
            node.is_edit_coordinates = true;
            var annotationnode = node.key.regions[0];
            annotationnode.class = "Annotation";
            annotationnode.page = node.key.regions[0].page_num;
            annotationnode.type = "area";
            if (annotationnode.uuid == undefined) {
                annotationnode.uuid = node.temp_id_key;
            }
            annotationnode.documentId = vm.pdfSrc;
            annotationnode.x = annotationnode.x1;
            annotationnode.y = annotationnode.y1;
            annotationnode.width = annotationnode.x2;
            annotationnode.height = annotationnode.y2;
            setrectColor("transparent");
            disableDrawRect("area");
            setHeilight(annotationnode.uuid);


            handleannotationrightclick(annotationnode, node);
        }
    };

    vm.updateNode = function (annotation, type, obj) {
        if(annotation.regions==undefined)
        annotation.regions=[];
        annotation.regions.push({});
        annotation.regions[0].x1 = annotation.x;
        annotation.regions[0].y1 = annotation.y;
        annotation.regions[0].x2 = annotation.x + annotation.width;
        annotation.regions[0].y2 = annotation.y + annotation.height;
        annotation.regions[0].page_num = annotation.page;


        //need to handle list of coordinate list annotations
        // for (var i = 0; i < node.regions.length; i++) {
        //     var page_num = node.regions[i].page_num
        //     if ($scope.selector[page_num].x1 != undefined) {
        //         node.regions[i].x1 = $scope.selector[page_num].x1;
        //         node.regions[i].y1 = $scope.selector[page_num].y1;
        //         node.regions[i].x2 = $scope.selector[page_num].x2;
        //         node.regions[i].y2 = $scope.selector[page_num].y2;
        //         node.changedField = true;
        //     }
        // }

        if (type == "table") {
            vm.updaterightsideObject(annotation, $scope.extractOutput);
            //vm.saveCell(vm.newcelldata.line_no, vm.newcelldata.col_no, annotation, annotation);
        }
        else {
            vm.updaterightsideObject(annotation, $scope.extractOutput);
            // for (var i = 0; i < $scope.extractOutput.length; i++) {
            //     if ($scope.extractOutput[i].section_id == annotation.section_id) {
            //         for (var j = 0; j < $scope.extractOutput[i].elements.length; j++) {
            //             if ($scope.extractOutput[i].elements[j].id == annotation.id) {
            //                 $scope.extractOutput[i].elements[j].regions[0].x1 = annotation.x;
            //                 $scope.extractOutput[i].elements[j].regions[0].y1 = annotation.y;
            //                 $scope.extractOutput[i].elements[j].regions[0].x2 = annotation.x + annotation.width;
            //                 $scope.extractOutput[i].elements[j].regions[0].y2 = annotation.y + annotation.height;
            //                 $scope.extractOutput[i].elements[j].regions[0].page_num = annotation.page;
            //             }
            //         }
            //     }
            // }

            //vm.sendFeedback(annotation, 'edit');
            $scope.updatewithnewannotationNode = false;
            vm.newCoordinatesForUpdateNodeFlag = false;
        }
    }

   vm.resetAllEvents = function(){

        $scope.updannotation = {};
        $scope.updatewithnewannotationNode = false;
        vm.newCoordinatesForUpdateNodeFlag = false;
        vm.newCoordinatesForUpdateNodeObj = {};
        vm.newElement = {};
        $scope.newNode = '';
        vm.newcell = false;
        $scope.croppingError = false;
        $scope.cropMsg = '';
        disableDrawRect("area");
   };

    vm.saveNewElement = function (node) {
        if (vm.newElement.node_type != 'table' && vm.newElement.node_type != 'list') {
            if(vm.newElement.regions==undefined){
                vm.newElement.regions = [];
            }

            node.children.unshift(vm.newElement);
            vm.updateDrawer("value", vm.newElement);
            $scope.rowHighlight = [];
            $scope.rowHighlight[vm.newElement.temp_id] = 'highlightClass';
            vm.newElement = {};
            $scope.newNode = '';
        }
        else if (vm.newElement.node_type == 'table') {
            for (var i=0; i<vm.newElement.cells_reconstructed.length; i++) {
                var size = Object.keys(vm.newElement.cells_reconstructed[i]).length;
                for (var j=0; j<size; j++) {
                    if(vm.newElement.cells_reconstructed[i][j].regions!=undefined){
                        vm.newElement.cells_reconstructed[i][j].coordinates_copy=vm.newElement.cells_reconstructed[i][j].regions;
                        vm.newElement.cells_reconstructed[i][j].original_text = vm.newElement.cells_reconstructed[i][j].text;
                    }
                }
            }
            node.children.unshift(vm.newElement);
            vm.newElement = {};
            $scope.newNode = '';
        }
        else if(vm.newElement.node_type == 'list'){

            for(var i=0;i<vm.newElement.children.length;i++){
                delete vm.newElement.children[i].is_changed;
                vm.updateDrawer("value", vm.newElement.children[i]);
            }
            node.children.unshift(vm.newElement);
            vm.newElement = {};
            $scope.newNode = '';
        }
        $scope.setOrderForSpecificTime();

    }



    vm.saveNewnode = function (node) {
        vm.saveNewElement(node);

    };

    vm.completeReview = function () {
        var text = $scope.recordData.properties.filename;
        var doc_id = $scope.currentDocId;
        vm.feedbackObj = [];
        $scope.extractOutputForFeedback = angular.copy($scope.extractOutput)
        vm.recursiveForFeedback($scope.extractOutputForFeedback);
        var temp = {}
        temp.root_id = $scope.root_id;
        temp.feedback = vm.feedbackObj;
        temp.doc_id = $scope.doc_id;
        ngDialog.open({
            template: 'confirmEntityBox',
            controller: ['$scope', '$state', function ($scope, $state) {
                $scope.activePopupText = 'Are you sure you want to complete the review for ' + "'" + text + "'" + ' ?';
                $scope.onConfirmActivation = function () {
                    ngDialog.close();
                    extractionService.completeFedBack({ 'data': temp, 'sess_id': vm.sess_id }).then(function (resp) {
                        if (resp.data.status == "success") {

                            $.UIkit.notify({
                                message: resp.data.msg,
                                status: 'success',
                                timeout: 3000,
                                pos: 'top-center'
                            });

                            if (vm.loginDataObj.role == "sv") {
                                $state.go("app.supervisorDocumentsList", { "id": $stateParams.queue });
                            }
                            else {
                                $state.go("app.agentDocumentsList", { "id": $stateParams.queue });
                            }
                        }
                        else {
                            $.UIkit.notify({
                                message: resp.data.msg,
                                status: 'danger',
                                timeout: 3000,
                                pos: 'top-center'
                            });
                        }
                    }, function (err) {
                        $.UIkit.notify({
                            message: "Internal server error",
                            status: 'warning',
                            timeout: 3000,
                            pos: 'top-center'
                        });
                    });

                };
            }]
        });
    };


    $scope.sample = { 'select': true };

    $scope.changeCheckBoX = function (node) {
       node.is_changed = true;
       // vm.sendFeedback(node, 'edit', 'omr');
    }
    $scope.changeRadio = function (index, obj, options, node) {
        for (var i = 0; i < options.length; i++) {
            if (i != index) {
                options[i].value.text = false;
            }
        }
        node.is_changed = true;
        //vm.sendFeedback(node, 'edit', 'omr');

    };

    $scope.goToCaseDashboard = function () {
        if ($scope.loginData.role == "sv") {
            $state.go("app.supervisorDocumentsList", { "id": $stateParams.queue });
        }
        else {
            $state.go("app.agentDocumentsList", { "id": $stateParams.queue });
        }
    };

    vm.stateChangeFunct = function (obj) {
        extractionService.saveChangedState({ 'data': obj, 'sess_id': vm.sess_id }).then(function (resp) {
            if (resp.data.status == "success") {
                $.UIkit.notify({
                    message: resp.data.msg,
                    status: 'success',
                    timeout: 3000,
                    pos: 'top-center'
                });
                if ($scope.loginData.role == "sv") {
                    $state.go("app.supervisorDocumentsList", { "id": $stateParams.queue });
                }
                else {
                    $state.go("app.agentDocumentsList", { "id": $stateParams.queue });
                }
            }
            else {
                $.UIkit.notify({
                    message: resp.data.msg,
                    status: 'danger',
                    timeout: 3000,
                    pos: 'top-center'
                });
            }
        }, function (err) {
            $.UIkit.notify({
                message: "Internal server error",
                status: 'warning',
                timeout: 3000,
                pos: 'top-center'
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
            ngDialog.open({ template: 'confirmEntityBox',
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

    /* Div horizontal scroll*/

    vm.jumpLeft = function (value, node) {
        event.preventDefault();
        var width = $('.test' + node.temp_id).width();
        if (value.columnStart > 1) {
            value.columnStart = value.columnStart - $scope.headersDisplayLength;
            value.columnEnd = value.columnStart + ($scope.headersDisplayLength - 1);
        }
        $('.content' + node.temp_id).animate({
            scrollLeft: "-=" + width
        }, "slow");
    }
    vm.jumpRight = function (value, node) {
        event.preventDefault();
        var width = $('.test' + node.temp_id).width();
        //console.log("width" + width)
        if (value.columnEnd < value.headings_copy.length) {
            value.columnStart = value.columnStart + $scope.headersDisplayLength;
            value.columnEnd = value.columnStart + ($scope.headersDisplayLength - 1);
            if (value.columnEnd > value.headings_copy.length) {
                value.columnEnd = value.headings_copy.length;
            }

        }
        $('.content' + node.temp_id).animate({
            scrollLeft: "+=" + width
        }, "slow");

    }






    $scope.targetValue = '';



    vm.pickDeep = function (collection, identity, propValue, thisArg) {
        var object;
        var picked = _.pick(collection, identity, thisArg);
        var collections = _.pick(collection, _.isObject, thisArg);
        _.each(collections, function (item, key, collection) {
            if (_.isArray(item)) {
                object = _.reduce(item, function (result, value) {
                    var picked = vm.pickDeep(value, identity, propValue, thisArg);
                    if (!_.isEmpty(picked)) {
                        if (value[identity[0]] == propValue) {
                            $scope.targetValue = value["text"];
                        }

                    }
                    return result;
                }, []);
            } else {
                object = vm.pickDeep(item, identity, propValue, thisArg);
            }
            if (!_.isEmpty(object)) {
                picked[key] = object;
            }

        });
        return collection;
    }


    vm.changedValue = function(node,type,value){
        if(type=='field'){
            if(value=='name'){
                if(node.original_label===node.key.name){
                   node.is_changed = false;
                }
                else{
                   node.is_changed = true;
                }
            }
            else if(value=='label'){
               if(node.original_label===node.key.text){
                   node.is_changed = false;
               }
               else{
                   node.is_changed = true;
               }
            }
            else{
                if(node.original_text===node.value.text){
                   node.is_changed = false;
                }
                else{
                   node.is_changed = true;
                }
            }
        }
        else if(type=='list'){
        }
        else{
            if(node.original_text===node.text){
                   node.is_changed = false;
            }
            else{
                   node.is_changed = true;
            }
        }
    };

    vm.getEXtractedValue = function (node, type, fullnode) {
        //$scope.obj =  vm.pickDeep($scope.deepCopyOfSectionsData, ["insight_id"],node.insight_id);

        if (type == 'field' || type == 'omr') {
            if(type == 'field'){
                if (node.key.name != undefined && node.key.name != '') {
                    if (node.original_label != undefined)
                        node.key.name = angular.copy(node.original_label);
                }
                else {
                    if (node.key.text != undefined && node.key.text != undefined) {
                        node.key.text = angular.copy(node.original_label);
                    }
                }
            }
            else if(type == 'omr'){
                if (node.text != undefined && node.text != undefined) {
                        node.text = angular.copy(node.original_label);
                        node.fields = angular.copy(node.groups_copy);
                }
            }
            if(type=='omr'){
                if(node.coordinates_copy!=undefined){
                    node.regions = angular.copy(node.coordinates_copy);
                    var index= -1;
                    for (var i = 0; i < $scope.annotations.length; i++) {
                        if ($scope.annotations[i].uuid == node.temp_id) {
                            if(node.regions.length>0){
                                $scope.annotations[i].x = node.regions[0].x1;
                                $scope.annotations[i].width = node.regions[0].x2 - node.regions[0].x1;
                                $scope.annotations[i].y = node.regions[0].y1;
                                $scope.annotations[i].height = node.regions[0].y2 - node.regions[0].y1;
                                $scope.MyStoreAdapter.editAnnotation(vm.pdfSrc,$scope.annotations[i].page,$scope.annotations[i]);
                                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.temp_id + "']");
                                var p = allrect[0]
                                p.setAttribute("x",$scope.annotations[i].x);
                                p.setAttribute("y",$scope.annotations[i].y);
                                p.setAttribute("width",$scope.annotations[i].width);
                                p.setAttribute("height",$scope.annotations[i].height);
                                break;
                            }else{
                                index = i;
                                $scope.annotations.splice(index, 1);
                                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.temp_id+ "']")
                                allrect[0].remove();
                                break;
                            }
                        }
                    }



                }
                node.fields = angular.copy(node.groups_copy);


            }

            if(node.label_coordinates_copy!=undefined){
                    node.key.regions = angular.copy(node.label_coordinates_copy);
                    var index= -1;
                    for (var i = 0; i < $scope.annotations.length; i++) {
                        if ($scope.annotations[i].uuid == node.temp_id_key) {
                            if(node.key.regions.length>0){
                                $scope.annotations[i].x = node.key.regions[0].x1;
                                $scope.annotations[i].width = node.key.regions[0].x2 - node.key.regions[0].x1;
                                $scope.annotations[i].y = node.key.regions[0].y1;
                                $scope.annotations[i].height = node.key.regions[0].y2 - node.key.regions[0].y1;
                                $scope.MyStoreAdapter.editAnnotation(vm.pdfSrc,$scope.annotations[i].page,$scope.annotations[i]);
                                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.temp_id_key + "']");
                                var p = allrect[0]
                                p.setAttribute("x",$scope.annotations[i].x);
                                p.setAttribute("y",$scope.annotations[i].y);
                                p.setAttribute("width",$scope.annotations[i].width);
                                p.setAttribute("height",$scope.annotations[i].height);
                                break;
                            }else{
                                index = i;
                                $scope.annotations.splice(index, 1);
                                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" +node.temp_id_key+ "']")
                                allrect[0].remove();
                                break;
                            }
                        }
                    }



            }

        }

        else {

                if (node.original_text != undefined){
                    if(type=='list' || type=='table'){
                        node.text = angular.copy(node.original_text);
                    }
                    else{
                       if(node.node_type=='field'){
                         node.value.text = angular.copy(node.original_text);
                       }
                       else{
                         node.text = angular.copy(node.original_text);
                       }
                    }
                    node.is_changed = false;
                }
                if(node.node_type=='field'){
                    if(node.value.coordinates_copy!=undefined){
                        node.value.regions = angular.copy(node.value.coordinates_copy);
                        var index= -1;
                        for (var i = 0; i < $scope.annotations.length; i++) {
                            if ($scope.annotations[i].uuid == node.value.temp_id) {
                                if(node.value.regions.length>0){
                                    $scope.annotations[i].x = node.value.regions[0].x1;
                                    $scope.annotations[i].width = node.value.regions[0].x2 - node.value.regions[0].x1;
                                    $scope.annotations[i].y = node.value.regions[0].y1;
                                    $scope.annotations[i].height = node.value.regions[0].y2 - node.value.regions[0].y1;
                                    $scope.MyStoreAdapter.editAnnotation(vm.pdfSrc,$scope.annotations[i].page,$scope.annotations[i]);
                                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.value.temp_id + "']");
                                    var p = allrect[0]
                                    p.setAttribute("x",$scope.annotations[i].x);
                                    p.setAttribute("y",$scope.annotations[i].y);
                                    p.setAttribute("width",$scope.annotations[i].width);
                                    p.setAttribute("height",$scope.annotations[i].height);
                                    break;
                                }else{
                                    index = i;
                                    $scope.annotations.splice(index, 1);
                                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.value.temp_id+ "']")
                                    allrect[0].remove();
                                    break;
                                }
                            }
                        }



                    }
                }else{
                    if(node.coordinates_copy!=undefined){
                        node.regions = angular.copy(node.coordinates_copy);
                        var index= -1;
                        for (var i = 0; i < $scope.annotations.length; i++) {
                            if ($scope.annotations[i].uuid == node.temp_id) {
                                if(node.regions.length>0){
                                    $scope.annotations[i].x = node.regions[0].x1;
                                    $scope.annotations[i].width = node.regions[0].x2 - node.regions[0].x1;
                                    $scope.annotations[i].y = node.regions[0].y1;
                                    $scope.annotations[i].height = node.regions[0].y2 - node.regions[0].y1;
                                    $scope.MyStoreAdapter.editAnnotation(vm.pdfSrc,$scope.annotations[i].page,$scope.annotations[i]);
                                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.temp_id + "']");
                                    var p = allrect[0]
                                    p.setAttribute("x",$scope.annotations[i].x);
                                    p.setAttribute("y",$scope.annotations[i].y);
                                    p.setAttribute("width",$scope.annotations[i].width);
                                    p.setAttribute("height",$scope.annotations[i].height);
                                    break;
                                }else{
                                    index = i;
                                    $scope.annotations.splice(index, 1);
                                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.temp_id+ "']")
                                    allrect[0].remove();
                                    break;
                                }
                            }
                        }



                    }
                }

        }

        if(type=='table'){
            fullnode.is_changed = true;
        }
    };

    vm.getHeader = function (header) {
        if (header.length > 0) {
            return 'headerColor';
        }
        return 'emptyHeader';

    }

    vm.getColoumn = function (column) {
        if (column == undefined) {
            return 'emptyHeader'
        }

    }

    vm.removeHeadersCalculation = function (node) {
        var originalHeadingLength = node.tables.headings.length - node.tables.headings_copy.length;
        for (var s = 0; s < originalHeadingLength; s++) {
            node.tables.headings.splice(node.tables.headings.length - 1, 1)
        }
    };

    vm.sendTableFeedBack = function (temp) {
        extractionService.saveFeedback({ 'data': temp, 'sess_id': vm.sess_id }).then(function (resp) {
            if (resp.data.status == "success") {

            }
            else {
                $.UIkit.notify({
                    message: resp.data.msg,
                    status: 'danger',
                    timeout: 3000,
                    pos: 'top-center'
                });
            }
        }, function (err) {
            $.UIkit.notify({
                message: "Internal server error",
                status: 'warning',
                timeout: 3000,
                pos: 'top-center'
            });
        });
    };

    vm.saveCell = function (pindex, index, data, node) {
        var obj = {
            "col_no": index,
            "line_no": pindex,
            "text": data.text,
            "coordinates": data.regions,
            "feedback_type": "edit",
            "insight_id": node.insight_id
        }
        var reqObj = {}
        reqObj.id = node.id;
        reqObj.doc_id = $scope.currentDocId;
        reqObj.request_type = "save_cell";
        reqObj.feedback = [];
        reqObj.feedback.push(obj);

        vm.sendTableFeedBack(reqObj);
    };

    vm.insertColumn = function (index, node, type, event) {
        var index = index;
        if (type == 'below')
            index = index + 1;
        var column_no = angular.copy(index);

        var originalHeadingLength = node.headings_reconstructed.length - node.headings_copy.length;
        for (var s = 0; s < originalHeadingLength; s++) {
            node.headings_reconstructed.splice(node.headings_reconstructed.length - 1, 1)
        }
        node.headings_reconstructed.splice(index, 0, ['']);
        vm.getTableheadersCalculation(node);
        for (var i = 0; i < node.cells_reconstructed.length; i++) {
            var copyObj = angular.copy(node.cells_reconstructed[i]);
            var size = Object.keys(node.cells_reconstructed[i]).length + 1;
            node.cells_reconstructed[i] = {};
            for (var j = 0; j < size; j++) {
                if (j >= index) {
                    if (j == index) {
                        node.cells_reconstructed[i][j] = { text: "", confidence: 100, temp_id: $scope.uniqueIdGenerator(), regions: [], id: $scope.uniqueIdGenerator(), new_cell: true };
                    }
                    else {
                        node.cells_reconstructed[i][j] = angular.copy(copyObj[j - 1])
                    }
                }
                else {
                    node.cells_reconstructed[i][j] = angular.copy(copyObj[j])
                }
            }
        }
        node.is_changed = true;






    }

    vm.deleteColumn = function (index, node, event) {
        var index = index;
        var originalHeadingLength = node.headings_reconstructed.length - node.headings_copy.length;
        for (var s = 0; s < originalHeadingLength; s++) {
           node.headings_reconstructed.splice(node.headings_reconstructed.length - 1, 1)
        }
        node.headings_reconstructed.splice(index, 1);
        vm.getTableheadersCalculation(node);
        for (var i = 0; i < node.cells_reconstructed.length; i++) {
            for (var j = 0; j < $scope.annotations.length; j++) {
                if (node.cells_reconstructed[i][index].temp_id == $scope.annotations[j].uuid) {
                    $scope.annotations.splice(j, 1);
                    var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + node.cells_reconstructed[i][index].temp_id + "']")
                    allrect[0].remove();
                    break;
                }
            }
        }
        for (var i = 0; i < node.cells_reconstructed.length; i++) {
            var copyObj = angular.copy(node.cells_reconstructed[i]);
            var size = Object.keys(node.cells_reconstructed[i]).length - 1;
            node.cells_reconstructed[i] = {};
            for (var j = 0; j < size; j++) {
                if (j >= index) {
                    node.cells_reconstructed[i][j] = angular.copy(copyObj[j + 1])
                }
                else {
                    node.cells_reconstructed[i][j] = angular.copy(copyObj[j])
                }
            }
        }
        node.is_changed = true;



    };

    vm.insertRow = function (index, node, type) {
        var index = index;
        if (type == 'below')
            index = index + 1;
        var row_no = angular.copy(index);
        var size = Object.keys(node.headings_copy).length;
        var obj = {};
        for (var i = 0; i < size; i++) {
            obj[i] = { text: "", confidence: 100, regions: [],  temp_id: $scope.uniqueIdGenerator(), id: $scope.uniqueIdGenerator(),  new_cell: true }
        }
        node.cells_reconstructed.splice(index, 0, obj);
        node.is_changed = true;


    };

    vm.tableValueChange = function(node){
        node.is_changed = true;
    };
    vm.omrValueChange = function(node){
        node.is_changed = true;
    };

    vm.updateColumnName = function (node, name, index) {
        if (node.insight_id != undefined) {
            var obj = {
                "col_no": index,
                "col_name": name,
                "feedback_type": "edit",
                "insight_id": node.insight_id
            }
            var reqObj = {}
            reqObj.id = node.id;
            reqObj.doc_id = $scope.currentDocId;
            reqObj.request_type = "save_col_name";
            reqObj.feedback = [];
            reqObj.feedback.push(obj);

            vm.sendTableFeedBack(reqObj);

        }
    };

    vm.deleteRow = function (index, node) {
        var size1 = Object.keys(node.cells_reconstructed[index]).length
        node.cells_reconstructed.splice(index, 1);
        node.is_changed = true;

    };

    vm.changeNewElement = function (type) {
        if(type=='field'){
            vm.elementObj('field');
        }else{
            vm.elementObj();
        }
        delete vm.newElement.regions;
        var index = 0;
        if(vm.newElement.label_id!=undefined){
            for (var i = 0; i < $scope.annotations.length; i++) {
                if ($scope.annotations[i].uuid == vm.newElement.label_id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                $scope.annotations.splice(index, 1);
                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + vm.newElement.label_id + "']")
                allrect[0].remove();
            }


        }
        var index = 0;
        if(vm.newElement.value_id!=undefined){
            for (var i = 0; i < $scope.annotations.length; i++) {
                if ($scope.annotations[i].uuid == vm.newElement.value_id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                $scope.annotations.splice(index, 1);
                var allrect = document.querySelectorAll("rect[data-pdf-annotate-id='" + vm.newElement.value_id + "']")
                allrect[0].remove();
            }


        }
        delete vm.newElement.label_id;
        delete vm.newElement.value_id;

        if(type == 'table') {
            vm.newElement.cells_reconstructed = []
            vm.newElement.headings_reconstructed = [];
            for (var i = 0; i < 3; i++) {
                vm.newElement.headings_reconstructed .push(['']);
            }
            vm.newElement.cells_reconstructed = [];
            vm.getTableheadersCalculation(vm.newElement);
            var size = Object.keys(vm.newElement.headings_copy).length;
            for (var j = 0; j < 3; j++) {
                var obj = {};
                for (var i = 0; i < size; i++) {
                    obj[i] = { text: "", confidence: 100, regions: [], original_text:'',coordinates_copy:[],  temp_id: $scope.uniqueIdGenerator(), id: $scope.uniqueIdGenerator(), new_cell: true }
                }

                vm.newElement.cells_reconstructed.push(obj);
            }
        }

        if(type=='list'){
            vm.newElement.children = [];
            var obj = {};
            obj.text = '';
            obj.regions = [];
            obj.coordinates_copy = [];
            obj.original_text = '';
            obj.temp_id = vm.newElement.temp_id+"_"+$scope.uniqueIdGenerator();
            obj.confidence = 100;
            vm.newElement.children.push(obj);

        }
    }

    vm.myFunction = function (event, id) {
        document.getElementsByClassName("myDropdown" + id)[0].classList.toggle("show");
        if (!event.target.matches('.dropbtn')) {

            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    vm.myFunctionRow = function (event, id) {
        document.getElementsByClassName("myDropdownRow" + id)[0].classList.toggle("show");
        if (!event.target.matches('.dropbtn')) {

            var dropdowns = document.getElementsByClassName("dropdown-content2");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
    vm.collapsed = {};
    $scope.chnageIcon =function(collapse,temp_id){
        vm.collapsed[temp_id] = !vm.collapsed[temp_id];
        console.log("collapse==>", vm.collapsed[temp_id]);
    };

    document.getElementById('content-wrapper').addEventListener('scroll', function (e) {
        $scope.current_page = Math.round(e.target.scrollTop / PAGE_HEIGHT) + 1;

//        if ($scope.current_page == 1) {
//
//           var disablePage = document.querySelectorAll("div[data-page-number='" + $scope.current_page + "']");
//           if(disablePage){
//               disablePage[0].style["border-color"] = "red";
//           }else{
//               disablePage[0].style["border-color"] = "transparent";
//           }
//        }
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

    });


}];