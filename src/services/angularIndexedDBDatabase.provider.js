(function(){
    'use strict';

    angular.module('angular-indexedDB').provider('angularIndexedDBDatabase', angularIndexedDBDatabase);

    function angularIndexedDBDatabase(){
        var self = this;
        self._databaseName = 'test';
        self._updateSchema = null;
        self._version = 1;
        
        self.setDatabaseName = setDatabaseName;
        self.setUpdateSchema = setUpdateSchema;
        self.setVersion = setVersion;

        self.getDatabaseName = getDatabaseName;
        self.getUpdateSchema = getUpdateSchema;
        self.getVersion = getVersion;
        
        self.$get = ['$window', '$q', get];

        function get($window, $q){
            return getDB($window, $q);
        }

        function getDatabaseName(){
            return self._databaseName;
        }

        function getUpdateSchema(){
            return self._updateSchema;
        }

        function getVersion(){
            return self._version;
        }

        function setDatabaseName(databaseName){
            self._databaseName = databaseName;
            return self;
        }

        function setUpdateSchema(updateSchema){
            self._updateSchema = updateSchema;
            return self;
        }

        function setVersion(version){
            self._version = version;
            return self;
        }

        function getDB($window, $q){
            var db = null;

            return function(){
                var deferred = $q.defer();

                if(db === null){
                    openDatabase($window, $q)
                        .then(function(database){
                            db = database;
                            deferred.resolve(db);
                        }).catch(function(error){
                            deferred.reject(error);
                        });
                }
                else{
                    deferred.resolve(db);
                }

                return deferred.promise;
            }
        };

        function openDatabase($window, $q){
            var deferred = $q.defer();
            var request = $window.indexedDB.open(self.getDatabaseName(), self.getVersion());

            request.onupgradeneeded = function(event){
                self.getUpdateSchema()(event.target.result);
            }

            request.onsuccess = function(event){
                deferred.resolve(event.target.result);
            }

            request.onerror = function(event){
                deferred.reject(event);
            }

            return deferred.promise;
        }
    };
})();