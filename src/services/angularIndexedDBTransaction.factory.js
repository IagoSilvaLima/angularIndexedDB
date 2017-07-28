(function(){
    'use strict';

    angular.module('angular-indexedDB').factory('angularIndexedDBTransaction', angularIndexedDBTransaction);

    angularIndexedDBTransaction.$inject = ['angularIndexedDBDatabase', '$q'];

    function angularIndexedDBTransaction(angularIndexedDBDatabase, $q){
        return getTransaction;

        function getTransaction(table, mode){
            var mode = mode || 'readonly';
            var deferred = $q.defer();

            angularIndexedDBDatabase()
                .then(function(database){
                    deferred.resolve(database.transaction(table, mode));
                }).catch(function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    };
})();