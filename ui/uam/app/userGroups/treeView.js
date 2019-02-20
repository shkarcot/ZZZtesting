(function (angular, undefined) {
	var module = angular.module('AxelSoft', []);

	module.value('treeViewDefaults', {
		foldersProperty: 'subGroups',
		id: 'id',
		filesProperty: 'files',
		displayProperty: 'name',
		collapsible: true
	});
	
	module.directive('treeView', ['$q', 'treeViewDefaults', function ($q, treeViewDefaults) {
		return {
			restrict: 'A',
			scope: {
				treeView: '=treeView',
				treeViewOptions: '=treeViewOptions'
			},
			replace: true,
			template:
				'<div class="tree">' +
					'<div tree-view-node="treeView" class="groups-treeView">' +
					'</div>' +
				'</div>',
			controller: ['$scope', function ($scope) {
				var self = this,
					selectedNode,
					parentScopeObj,
					selectedFile;

				var options = angular.extend({}, treeViewDefaults, $scope.treeViewOptions);

				self.selectNode = function (node, breadcrumbs,parentScopeObj) {
					if (selectedFile) {
						selectedFile = undefined;
					}
					selectedNode = node;

					if (typeof options.onNodeSelect === "function") {
						options.onNodeSelect(node, breadcrumbs,selectedNode, parentScopeObj);
					}
				};

				self.selectFile = function (file, breadcrumbs) {
					if (selectedNode) {
						selectedNode = undefined;
					}
					selectedFile = file;

					if (typeof options.onNodeSelect === "function") {
						options.onNodeSelect(file, breadcrumbs);
					}
				};
				
				self.isSelected = function (node) {
				   // console.log("selectedNode==>", selectedNode);
					return node === selectedNode || node === selectedFile;
				};

				/*
				self.addNode = function (event, name, parent) {
					if (typeof options.onAddNode === "function") {
						options.onAddNode(event, name, parent);
					}
				};
				self.removeNode = function (node, index, parent) {
					if (typeof options.onRemoveNode === "function") {
						options.onRemoveNode(node, index, parent);
					}
				};
				
				self.renameNode = function (event, node, name) {
					if (typeof options.onRenameNode === "function") {
						return options.onRenameNode(event, node, name);
					}
					return true;
				};
				*/
				self.getOptions = function () {
					return options;
				};
			}]
		};
	}]);

	module.directive('treeViewNode', ['$q', '$compile', function ($q, $compile) {
		return {
			restrict: 'A',
			require: '^treeView',
			link: function (scope, element, attrs, controller) {

				var options = controller.getOptions(),
					foldersProperty = options.foldersProperty,
					filesProperty = options.filesProperty,
					displayProperty = options.displayProperty,
					groupId = options.id,
					collapsible = options.collapsible;
				//var isEditing = false;

				scope.expanded = collapsible == false;
				//scope.newNodeName = '';
				//scope.addErrorMessage = '';
				//scope.editName = '';
				//scope.editErrorMessage = '';

				scope.getFolderIconClass = function () {
				    console.log("scope.expanded==>", scope.expanded);
				    console.log("scope.hasChildren==>",scope.hasChildren());
                    if(scope.hasChildren())
                        return 'fa fa-minus-square-o';
                    else
                        return 'fa fa-plus-square-o';

					//return 'fa ' + (scope.expanded && scope.hasChildren() ? 'fa-minus-square-o' : 'fa-plus-square-o');

				};
				
				scope.getFileIconClass = typeof options.mapIcon === 'function' 
					? options.mapIcon
					: function (file) {
						return 'icon-file';
					};
				
				scope.hasChildren = function () {
					var node = scope.node;
					return Boolean(node && (node[foldersProperty] && node[foldersProperty].length) || (node[filesProperty] && node[filesProperty].length));
				};

				scope.selectNode = function (event) {
					event.preventDefault();
					//if (isEditing) return;

					if (collapsible) {
						toggleExpanded();
					}

					var breadcrumbs = [];
					var nodeScope = scope;

					while (nodeScope.node) {
						breadcrumbs.push(nodeScope.node[displayProperty]);
						nodeScope = nodeScope.$parent;
						parentScopeObj=nodeScope.$parent.selectedUserGroup;
					}
					console.log("parentScopeObj==>", parentScopeObj);
					controller.selectNode(scope.node, breadcrumbs.reverse(), parentScopeObj);
				};

				scope.selectFile = function (file, event) {
					event.preventDefault();
					//if (isEditing) return;

					var breadcrumbs = [file[displayProperty]];
					var nodeScope = scope;
					while (nodeScope.node) {
						breadcrumbs.push(nodeScope.node[displayProperty]);
						nodeScope = nodeScope.$parent;
					}
					controller.selectFile(file, breadcrumbs.reverse());
				};
				
				scope.isSelected = function (node) {
					return controller.isSelected(node);
				};

				/*
				scope.addNode = function () {
					var addEvent = {
						commit: function (error) {
							if (error) {
								scope.addErrorMessage = error;
							}
							else {
								scope.newNodeName = '';
								scope.addErrorMessage = '';
							}
						}
					};

					controller.addNode(addEvent, scope.newNodeName, scope.node);
				};
				
				scope.isEditing = function () {
					return isEditing;
				};

				scope.canRemove = function () {
					return !(scope.hasChildren());
				};
				
				scope.remove = function (event, index) {
					event.stopPropagation();
					controller.removeNode(scope.node, index, scope.$parent.node);
				};

				scope.edit = function (event) {
				    isEditing = true;
				    controller.editingScope = scope;
					//expanded = false;
					scope.editName = scope.node[displayProperty];
					event.stopPropagation();
				};

				scope.canEdit = function () {
				    return !controller.editingScope || scope == controller.editingScope;
				};

				scope.canAdd = function () {
				    return !isEditing && scope.canEdit();
				};

				scope.rename = function (event) {
					event.stopPropagation();

					var renameEvent = {
						commit: function (error) {
							if (error) {
								scope.editErrorMessage = error;
							}
							else {
								scope.cancelEdit();
							}
						}
					};

					controller.renameNode(renameEvent, scope.node, scope.editName);
				};

				scope.cancelEdit = function (event) {
					if (event) {
						event.stopPropagation();
					}

					isEditing = false;
					scope.editName = '';
					scope.editErrorMessage = '';
					controller.editingScope = undefined;
				};
				*/

				function toggleExpanded() {
					//if (!scope.hasChildren()) return;
					scope.expanded = !scope.expanded;
				}

				function render() {

				    var parentIndex=null;
				    if(attrs.treeViewNode=='treeView'){
                        parentIndex=attrs.treeViewNode;
                        var template =
						    '<div id="{$ $index $}" data-uid="{$ node.' + groupId + ' $}" class="tree-folder section" ng-class="{ selected: isSelected(node) }" ng-repeat="node in ' + attrs.treeViewNode + '.' + foldersProperty + '">' +

							'<a href="#" id="{$ $index $}" name="'+parentIndex+'" class="tree-folder-header inline" ng-click="selectNode($event)" ng-class="{ selected: isSelected(node) }">' +
								'<i class="fa " aria-hidden="true" ng-class="getFolderIconClass()"></i>' +
								'<span class="tree-folder-name" id="{$ node.' + groupId + ' $}">{$ node.' + displayProperty + ' $}</span> ' +
							'</a>' +
							'<div class="tree-folder-content"'+ (collapsible ? ' ng-show="expanded"' : '') + '>' +
								'<div tree-view-node="node">' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<a href="#" class="tree-item" ng-repeat="file in ' + attrs.treeViewNode + '.' + filesProperty + '" ng-click="selectFile(file, $event)" ng-class="{ selected: isSelected(file) }">' +
							'<span class="tree-item-name"><i ng-class="getFileIconClass(file)"></i> {$ file.' + displayProperty + ' $}</span>' +
						'</a>';
				    }else{
					var template =
						    '<div id="{$ $index $}" data-uid="{$ node.' + groupId + ' $}" class="tree-folder" ng-class="{ selected: isSelected(node) }" ng-repeat="node in ' + attrs.treeViewNode + '.' + foldersProperty + '">' +

							'<a href="#" id="{$ $index $}" class="tree-folder-header inline" ng-click="selectNode($event)" ng-class="{ selected: isSelected(node) }">' +
								'<i class="fa " aria-hidden="true" ng-class="getFolderIconClass()"></i>' +
								'<span class="tree-folder-name" id="{$ node.' + groupId + ' $}">{$ node.' + displayProperty + ' $}</span> ' +
							'</a>' +
							'<div class="tree-folder-content"'+ (collapsible ? ' ng-show="expanded"' : '') + '>' +
								'<div tree-view-node="node">' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<a href="#" class="tree-item" ng-repeat="file in ' + attrs.treeViewNode + '.' + filesProperty + '" ng-click="selectFile(file, $event)" ng-class="{ selected: isSelected(file) }">' +
							'<span class="tree-item-name"><i ng-class="getFileIconClass(file)"></i> {$ file.' + displayProperty + ' $}</span>' +
						'</a>';

						}

					//Rendering template.
					element.html('').append($compile(template)(scope));
				}

				render();
			}
		};
	}]);
})(angular);