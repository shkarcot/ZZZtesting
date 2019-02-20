/*! angular-csv-import - v0.0.14 - 2015-02-10
* Copyright (c) 2015 ; Licensed  */
(function() {
'use strict';

var csvImport = angular.module('console.ngCsvImport', []);

csvImport.directive('ngCsvImport', function($rootScope) {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope:{
			content:'=',
			header: '=',
			headerVisible: '=',
			separator: '=',
			result: '=',
			confirmAction: '&'
		},
		template: '<input class="buttonUpload" type="file" id="file" style="opacity: 0;position: absolute;top:0;width:100%;left:0px;padding:5px 0px;cursor:pointer"/>',
		link: function(scope, element, attrs) {
		    attrs.parsetojson="";

			element.on('keyup', function(e){
				if ( scope.content != null ) {
					var content = {
						csv: scope.content,
						header: scope.header,
						separator: e.target.value
					};
					scope.result = csvToJSON(content);
					scope.$apply();
				}
			});

			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();

				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						var content = {
							csv: onLoadEvent.target.result.replace(/\r\n|\r/g,'\n'),
							header: scope.header,
							separator: scope.separator
						};

						scope.content = content.csv;
						scope.result = csvToJSON(content);
						scope.confirmAction();
					});
				};
				if ( (onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null) )  {
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
					$rootScope.$broadcast('scanner-started',onChangeEvent.target.files[0]);
				} else {
					if ( scope.content != null ) {
						var content = {
							csv: scope.content,
							header: !scope.header,
							separator: scope.separator
						};
						scope.result = csvToJSON(content);
					}
				}
			});

			var csvToJSON = function(content) {
				var lines=content.csv.split('\n');
				var result = [];
				var start = 0;
				var columnCount = lines[0].split(content.separator).length;
//        if(scope.result.subData == undefined){
//           scope.result = {};
//           scope.result.data = [];
//           scope.result.subData = [];
//        }
				var headers = [];
				if (content.header) {
					headers=lines[0].split(content.separator);
					start = 1;
				}



            scope.result.subData.push(content.csv);
						//result.push(obj);

				return JSON.stringify(content.csv);
			};
		}
	};
});
})();