const DB_NAME = "TestDatabaseName";
const DB_VERSION = 1;
const DB_KEYPATH_FIELD = "id";
const DB_OBJECT_STORE_TEST = "test_object_store";

var database = (function() {
	'use strict';
	
	var database = null;
	
	var _DatabaseModule = {};
	
	_DatabaseModule.open = function() {
		console.log("IndexedDB - Opening database '" + DB_NAME + "' ...");
	
		var openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
		
		openRequest.onupgradeneeded = function(event) {
			console.log("IndexedDB - Upgrading database '" + DB_NAME + "' from current version " + event.oldVersion + " to " + event.newVersion);
			
			var thisDB = event.target.result;
			
			switch(event.oldVersion) {
				case 0:
					console.log("IndexedDB - Upgrading version 0 ...");
					
					// Create the TEST object store
					var testObjectStore = thisDB.createObjectStore(DB_OBJECT_STORE_TEST, { keyPath: DB_KEYPATH_FIELD, autoIncrement: true });
					// Can also give other index
					//testObjectStore.createIndex("field", "field", { unique:false });
					
				default:
					break;
			}
			
			console.log("IndexedDB - Upgrade Complete");
		};
		
		openRequest.onsuccess = function(event) {
			console.log("IndexedDB - Successfully opened database");
			
			database = event.target.result;
			
			database.onerror = function(event) {
				alert("IndexedDB error: " + event.target.error.code);
				console.error("IndexedDB error", event.target.error);
			};
			
			database.onabort = function(event) {
				console.error("IndexedDB abort", event.target.error);
			}
			
			database.onclose = function(event) {
				console.error("IndexedDB unexpectedly closed", event.target.error);
			}
		};
		
		openRequest.onerror = function(event) {
			console.error("IndexedDB open error", event.target.error);
		};
	};
	
	_DatabaseModule.close = function() {
		console.log("IndexedDB - Closing database '" + DB_NAME + "'"); 
		database.close();
	};
	
	_DatabaseModule.putObject = function(objectStoreName, object) {
		console.log("IndexedDB - Put object into '" + objectStoreName + "' ...");
		
		var transaction = database.transaction(objectStoreName, "readwrite");
		
		transaction.oncomplete = function(event) {
			console.log("IndexedDB - Transaction completed for " + objectStoreName);
		};
		
		transaction.onerror = function(event) {
			console.error("IndexedDB - Failed to create Transaction for " + objectStoreName, event.target.result);
		};
		
		var objectStore = transaction.objectStore(objectStoreName);
		
		var request = objectStore.put(object);
		
		request.onsuccess = function(event) {
			object.id = event.target.result;
			console.log("IndexedDB - Succesfully put object id: " + object.id + " into objectStore: " + objectStoreName);
		};
		
		request.onerror = function(event) {
			console.error("IndexedDB - Failed to add object to " + objectStoreName, event.target.error);
		};
	};
	
	_DatabaseModule.deleteKey = function(objectStoreName, objectKey) {
		console.log("IndexedDB - Delete objectKey: " + objectKey + " from '" + objectStoreName + "' ...");
		
		var transaction = database.transaction(objectStoreName, "readwrite");
		
		transaction.oncomplete = function(event) {
			console.log("IndexedDB - Transaction completed for " + objectStoreName);
		};
		
		transaction.onerror = function(event) {
			console.error("IndexedDB - Failed to create Transaction for " + objectStoreName, event.target.result);
		};
		
		var objectStore = transaction.objectStore(objectStoreName);
		
		var request = objectStore.delete(objectKey);
		
		request.onsuccess = function(event) {
			console.log("IndexedDB - Deleted objectKey " + objectKey + " from " + objectStoreName);
		};
		
		request.onerror = function(event) {
			console.error("IndexedDB - Failed to add object to " + objectStoreName);
		};
	};
	
	_DatabaseModule.deleteObject = function(objectStoreName, object) {
		if(object.id) {
			_DatabaseModule.deleteKey(objectStoreName, object.id);
		} else {
			console.warn("IndexedDB - Could not delete, did not have DB_KEYPATH_FIELD set on object");
		}
	};
	
	return _DatabaseModule;
}());
