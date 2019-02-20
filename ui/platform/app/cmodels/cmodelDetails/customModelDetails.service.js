(function() {
	'use strict';
    angular.module('console.customModelDetailsService', [])
		.service('customModelDetailsService', function($state,$q, $http,httpPayload) {

            var _getModelVersions = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/details/',
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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

            var _getEvaluateResults = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/evaluationdetails/',
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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

            var _getPreviousRuns = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/previousrundetails/',
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader()
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader()
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                    headers:httpPayload.getHeader(),
                    data: data.data
                };

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
                var _retrainModelDataSam = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                   url: 'http://localhost:18097/train/',
                    headers: {'sess_token': data.sess_id},
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
        var _launchesModel = function() {

                var deferred = $q.defer();
                var req = {
                    method: 'get',
                    url: 'http://localhost:18097/launches/',
                    //url: 'http://localhost:18099/launches/',
                    headers: {'Content-Type':'application/json'}
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
             var _gettrainlogdtl = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/gettrainlogdtl/',
                    headers: {'Content-Type':'application/json'},
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
             var _lModelgetdatasets = function(data) {
                var deferred = $q.defer();

                var req = {
                    method: 'POST',
                   url: 'http://localhost:18097/getdatasets/',
                    headers: {'Content-Type':'application/json'},
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
             var _lModelExisting = function(data) {
                  var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/gettrainlog/',
                    headers: {'Content-Type':'application/json'},
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
             var _deployMode = function(data) {
                  var deferred = $q.defer();
                  console.log(data);
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/deploy/',
                    headers: {'Content-Type':'application/json'},
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
             var _gerenateMode = function(data) {
                  var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/generate/',
                    headers: {'Content-Type':'application/json'},
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
            var _stopModel = function(data) {
                  var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/stop/',
                    headers: {'Content-Type':'application/json'},
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
            var _saveDataset = function(data) {
                  var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/saveds/',
                    headers: {'Content-Type':'application/json'},
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
                var _vgetdeployedmodels = function(data) {
                  var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/getdeployedmodels/',
                    headers: {'Content-Type':'application/json'},
                    data: data
                };


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
             var _performgetdeployedmodels = function(data) {
                  var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/getallmodels/',
                    headers: {'Content-Type':'application/json'},
                    data: data
                };


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

             var _setmodelactive = function(data) {
                  var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18097/setmodelactive/',
                    headers: {'Content-Type':'application/json'},
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
//setmodelactive/

            var modelDetailsService = {
                getModelVersions       : _getModelVersions,
                updateModelData        : _updateModelData,
                getDatasetTypes        : _getDatasetTypes,
                getModelComponents     : _getModelComponents,
                getDataSets            : _getDataSets,
                testModelData          : _testModelData,
                retrainModelData       : _retrainModelData,
                getEvaluateResults     : _getEvaluateResults,
                getPreviousRuns        : _getPreviousRuns,
                evaluateDataset        : _evaluateDataset,
                updateModelFlow        : _updateModelFlow,
                getJupiterSession      : _getJupiterSession,
                updateModels           : _updateModels,
                launchesModel:_launchesModel,
                lModelgetdatasets:_lModelgetdatasets,
                gettrainlogdtl:_gettrainlogdtl,
                lModelExisting:_lModelExisting,
                deployMode:_deployMode,
                gerenateMode:_gerenateMode,
                stopModel:_stopModel,
                saveDataset:_saveDataset,
                vgetdeployedmodels:_vgetdeployedmodels,
                setmodelactive:_setmodelactive,
                performgetdeployedmodels:_performgetdeployedmodels,
                retrainModelDataSam:_retrainModelDataSam
            };

            return modelDetailsService;
		});
})();