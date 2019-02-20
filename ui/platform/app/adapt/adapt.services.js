(function() {
	'use strict';
    angular.module('console.adaptServices', [])
		.service('adaptServices', function($state,$q, $http,httpPayload) {

		    var _getModels = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/',
                    headers: httpPayload.getHeader()
                };
                /*var data ={"data": [{"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "name": "M1V4", "evaluation_dataset_name": "default", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "evaluation_dataset_id": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:12:00.561973"}, {"version_id": "69e91b16-ff59-4a63-bd14-5f8490492fd4", "is_active": true, "name": "M1V1", "evaluation_dataset_name": "default", "model_id": "09e80f9a-5951-4e58-9bd4-8b64d2a04770", "evaluation_dataset_id": "", "model_score": {"precision_samples": 0.9, "precision": 0.9, "f1_samples": 0.9473684210526316, "f1_weighted": 0.9473684210526316, "f1": 0.9473684210526316, "f1_macro": 0.9473684210526316, "accuracy": 0.9090909090909091, "recall_samples": 1.0, "adjusted_rand_score": 0.5338983050847458, "recall": 1.0, "f1_micro": 0.9473684210526316, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:18:38.894994"}], "status": "success"};
                deferred.resolve({
                    data: data
                });*/

                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };
            var _getModelVersions = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/details/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _getModelComponents = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/components/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _updateModelData = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/config/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _updateModelFlow = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/flowupdate/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _getDataSets = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/dataset/list/',
                    headers: httpPayload.getHeader()
                };
                /*var data ={"data": [{"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "name": "M1V4", "evaluation_dataset_name": "default", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "evaluation_dataset_id": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:12:00.561973"}, {"version_id": "69e91b16-ff59-4a63-bd14-5f8490492fd4", "is_active": true, "name": "M1V1", "evaluation_dataset_name": "default", "model_id": "09e80f9a-5951-4e58-9bd4-8b64d2a04770", "evaluation_dataset_id": "", "model_score": {"precision_samples": 0.9, "precision": 0.9, "f1_samples": 0.9473684210526316, "f1_weighted": 0.9473684210526316, "f1": 0.9473684210526316, "f1_macro": 0.9473684210526316, "accuracy": 0.9090909090909091, "recall_samples": 1.0, "adjusted_rand_score": 0.5338983050847458, "recall": 1.0, "f1_micro": 0.9473684210526316, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:18:38.894994"}], "status": "success"};
                deferred.resolve({
                    data: data
                });*/

                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _retrainModelData = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/retrain/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _testModelData = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/test/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _createModel = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/train/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _getModelTypes = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/type',
                    headers: httpPayload.getHeader()
                };
                /*var data ={"data": [{"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "name": "M1V4", "evaluation_dataset_name": "default", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "evaluation_dataset_id": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:12:00.561973"}, {"version_id": "69e91b16-ff59-4a63-bd14-5f8490492fd4", "is_active": true, "name": "M1V1", "evaluation_dataset_name": "default", "model_id": "09e80f9a-5951-4e58-9bd4-8b64d2a04770", "evaluation_dataset_id": "", "model_score": {"precision_samples": 0.9, "precision": 0.9, "f1_samples": 0.9473684210526316, "f1_weighted": 0.9473684210526316, "f1": 0.9473684210526316, "f1_macro": 0.9473684210526316, "accuracy": 0.9090909090909091, "recall_samples": 1.0, "adjusted_rand_score": 0.5338983050847458, "recall": 1.0, "f1_micro": 0.9473684210526316, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:18:38.894994"}], "status": "success"};
                deferred.resolve({
                    data: data
                });*/

                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _getDatasetTypes = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/dataset/type',
                    headers: httpPayload.getHeader()
                };
                /*var data ={"data": [{"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "name": "M1V4", "evaluation_dataset_name": "default", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "evaluation_dataset_id": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:12:00.561973"}, {"version_id": "69e91b16-ff59-4a63-bd14-5f8490492fd4", "is_active": true, "name": "M1V1", "evaluation_dataset_name": "default", "model_id": "09e80f9a-5951-4e58-9bd4-8b64d2a04770", "evaluation_dataset_id": "", "model_score": {"precision_samples": 0.9, "precision": 0.9, "f1_samples": 0.9473684210526316, "f1_weighted": 0.9473684210526316, "f1": 0.9473684210526316, "f1_macro": 0.9473684210526316, "accuracy": 0.9090909090909091, "recall_samples": 1.0, "adjusted_rand_score": 0.5338983050847458, "recall": 1.0, "f1_micro": 0.9473684210526316, "recall_macro": 1.0, "roc_auc": null}, "description": "", "algo_type": "classification", "display_name": "", "training_ts": "2018-03-26T12:18:38.894994"}], "status": "success"};
                deferred.resolve({
                    data: data
                });*/

                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _evaluateDataset = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/evaluate/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _getJupiterSession = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/session/get/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _updateModels = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/save/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _archiveDataset = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/dataset/archive/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _savesftpfiles = function(sess_id,data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/dataset/upload/',
                    headers:httpPayload.getHeader(),
                    data: data
                };
                /*var data ={"data": {"version_id": "c2d559aa-2d69-423d-9733-829a0b395db8", "is_active": true, "versions": [{"version_id": "56cb3b04-b794-42e7-8f67-a5c89da3cc35", "description": "", "training_ts": "2018-03-26T12:09:12.513764", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "09f87e8c-6382-44a1-b5f7-652c7ee6f742", "description": "", "training_ts": "2018-03-26T12:10:27.168804", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}, {"version_id": "62ab056f-f8e3-49dd-9d0c-74a6e4aeccd0", "description": "", "training_ts": "2018-03-26T12:11:37.607050", "display_name": "", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}}], "display_name": "", "evaluation_dataset_id": "", "model_id": "3a566034-23b4-42b2-b0ef-16ac90dc9f4e", "model_score": {"precision_samples": 1.0, "precision": 1.0, "f1_samples": 1.0, "f1_weighted": 1.0, "f1": 1.0, "f1_macro": 1.0, "accuracy": 1.0, "recall_samples": 1.0, "adjusted_rand_score": 1.0, "recall": 1.0, "f1_micro": 1.0, "recall_macro": 1.0, "roc_auc": null}, "name": "M1V4", "training_ts": "2018-03-26T12:12:00.561973", "evaluation_dataset_name": "default", "description": "", "algo_type": "classification", "version_scores": {"accuracy": [1.0, 1.0, 1.0], "precision": [1.0, 1.0, 1.0], "recall": [1.0, 1.0, 1.0]}, "total_versions": 3}, "status": "success"};
                deferred.resolve({
                    data: data
                });*/
                $http(req).success(function(data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function(data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var adaptServices = {

                getModels       : _getModels,
                getModelVersions :_getModelVersions,
                updateModelData: _updateModelData,
                updateModelFlow:_updateModelFlow,
                getDataSets:_getDataSets,
                retrainModelData:_retrainModelData,
                testModelData:_testModelData,
                createModel:_createModel,
                getModelTypes:_getModelTypes,
                getDatasetTypes:_getDatasetTypes,
                evaluateDataset:_evaluateDataset,
                getJupiterSession:_getJupiterSession,
                updateModels:_updateModels,
                archiveDataset:_archiveDataset,
                getModelComponents:_getModelComponents,
                savesftpfiles:_savesftpfiles
            };

            return adaptServices;
		});
})();