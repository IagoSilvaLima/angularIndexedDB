(function(){
    'use strict';

    angular.module('angular-indexedDB').service('angularIndexedDBCrud', angularIndexedDBCrud);

    angularIndexedDBCrud.$inject= ['angularIndexedDBTransaction', '$q'];

    function angularIndexedDBCrud(angularIndexedDBTransaction, $q){
        var self = this;

        self.get = get;
        self.insert = insert;
        self.list = list;
        self.remove = remove;

        function get(table, id){
            var deferred = $q.defer();

            angularIndexedDBTransaction(table)
                .then(function(transaction){
                    var request = transaction.objectStore(table).get(id);

                    request.onsuccess = function(event){
                            deferred.resolve(event.target.result);
                    }

                    request.onerror = function(error){
                        deferred.reject(error);
                    }

                }).catch(function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function insert(table, data){
            var deferred = $q.defer();

            angularIndexedDBTransaction(table, 'readwrite')
                .then(function(transaction){
                    var request = transaction.objectStore(table).add(data);

                    request.onsuccess = function(){
                        deferred.resolve();
                    }

                    request.onerror = function(error){
                        deferred.reject(error);
                    }
                }).catch(function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function remove(table, id){
            var deferred = $q.defer();

            angularIndexedDBTransaction(table, 'readwrite')
                .then(function(transaction){
                    var request = transaction.objectStore(table).delete(id);

                    request.onsuccess = function(){
                        deferred.resolve();
                    }

                    request.onerror = function(error){
                        deferred.reject(error);
                    }
                }).catch(function(error){
                    deferred.reject(error);
                })

            return deferred.promise;
        }

        function list(table){
            var deferred = $q.defer();

            angularIndexedDBTransaction(table)
                .then(function(transaction){
                    var request = transaction.objectStore(table).openCursor();
                    var data = [];

                    request.onsuccess = function(event){
                        var cursor = event.target.result;

                        if(cursor){
                            data.push(cursor.value);
                            cursor.continue();
                        }else{
                            deferred.resolve(data);
                        }
                    }


                    request.onerror = function(error){
                        deferred.reject(error);
                    }
                }).catch(function(error){
                    deferred.reject(error);
                })

            return deferred.promise;
        }

    }
})();