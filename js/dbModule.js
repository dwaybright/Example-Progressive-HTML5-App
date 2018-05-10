const DB_NAME = "TestDatabaseName";
const DB_VERSION = 1;
const DB_KEYPATH_FIELD = "id";
const DB_OBJECT_STORE_TEST = "test_object_store";

var database = (function () {
	'use strict';

	var database = null;

	var _DatabaseModule = {};

	/**
	 * Opens the IndexedDB database with name DB_NAME
	 */
	_DatabaseModule.open = function () {
		console.log("IndexedDB - Opening database '" + DB_NAME + "' ...");

		var openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

		openRequest.onupgradeneeded = function (event) {
			console.log("IndexedDB - Upgrading database '" + DB_NAME + "' from current version " + event.oldVersion + " to " + event.newVersion);

			var thisDB = event.target.result;

			switch (event.oldVersion) {
				case 0:
					console.log("IndexedDB - Upgrading version 0 ...");

					// Create the TEST object store
					var testObjectStore = thisDB.createObjectStore(DB_OBJECT_STORE_TEST, {
						keyPath: DB_KEYPATH_FIELD,
						autoIncrement: true
					});
					// Can also give other index
					//testObjectStore.createIndex("field", "field", { unique:false });

				default:
					break;
			}

			console.log("IndexedDB - Upgrade Complete");
		};

		openRequest.onsuccess = function (event) {
			console.log("IndexedDB - Successfully opened database");

			database = event.target.result;

			database.onerror = function (event) {
				alert("IndexedDB error: " + event.target.error.code);
				console.error("IndexedDB error", event.target.error);
			};

			database.onabort = function (event) {
				console.error("IndexedDB abort", event.target.error);
			}

			database.onclose = function (event) {
				console.error("IndexedDB unexpectedly closed", event.target.error);
			}
		};

		openRequest.onerror = function (event) {
			console.error("IndexedDB open error", event.target.error);
		};
	};

	/**
	 * Closes the IndexedDB database with name DB_NAME
	 */
	_DatabaseModule.close = function () {
		console.log("IndexedDB - Closing database '" + DB_NAME + "'");
		database.close();
	};

	/**
	 * Retrieves all objects from an IndexedDB Object Store
	 * 
	 * @param {string} objectStoreName 
	 * @callback callback 
	 */
	_DatabaseModule.getAllObjects = function (objectStoreName, callback) {
		console.log("IndexedDB - Get all objects from '" + objectStoreName + "' ...");

		// Create transaction to perform operation on Object Store
		var transaction = database.transaction(objectStoreName, "readonly");

		transaction.oncomplete = function (event) {
			console.debug("IndexedDB - Transaction completed for " + objectStoreName);
		};

		transaction.onerror = function (event) {
			console.error("IndexedDB - Failed to create Transaction for " + objectStoreName, event.target.result);
		};

		// Open the Object Store
		var objectStore = transaction.objectStore(objectStoreName);

		// Use a cursor to build collect all objects
		var request = objectStore.openCursor();
		var objectStoreObjects = [];

		request.onsuccess = function (event) {
			var cursor = event.target.result;

			if (cursor) {
				objectStoreObjects.push(cursor.value);

				cursor.continue();
			} else {
				console.log("IndexedDB - Succesfully retrieved " + objectStoreObjects.length + " objects from objectStore: " + objectStoreName);

				callback(objectStoreObjects);
			}
		};

		request.onerror = function (event) {
			console.error("IndexedDB - Failed to retrieve all objects from " + objectStoreName, event.target.error);
		};
	}

	/**
	 * Gets an object from given Object Store by looking for its DB_KEYPATH_FIELD value. 
	 * 
	 * @param {string} objectStoreName 
	 * @param {Object} object 
	 * @callback callback - Returns object saved to IndexedDB with DB_KEYPATH_FIELD set
	 */
	_DatabaseModule.getObjectFromKey = function (objectStoreName, objectKey, callback) {
		console.log("IndexedDB - Get object from '" + objectStoreName + "' with key:" + objectKey + " ...");

		// Create transaction to perform operation on Object Store
		var transaction = database.transaction(objectStoreName, "readonly");

		transaction.oncomplete = function (event) {
			console.debug("IndexedDB - Transaction completed for " + objectStoreName);
		};

		transaction.onerror = function (event) {
			console.error("IndexedDB - Failed to create Transaction for " + objectStoreName, event.target.result);
		};

		// Open the Object Store
		var objectStore = transaction.objectStore(objectStoreName);

		// Ensure the key is a number
		if (!Number.isInteger(objectKey)) {
			objectKey = Number.parseInt(objectKey);
		}

		// Request GET from IndexedDB Object Store
		var request = objectStore.get(objectKey);

		request.onsuccess = function (event) {
			callback(event.target.result);
			console.log("IndexedDB - Succesfully retrieved object id: " + objectKey + " from objectStore: " + objectStoreName);
		};

		request.onerror = function (event) {
			console.error("IndexedDB - Failed to retrieve object from " + objectStoreName, event.target.error);
		};
	}

	/**
	 * Puts an object into given Object Store, tagging field DB_KEYPATH_FIELD with issued ID number. 
	 * 
	 * @param {string} objectStoreName 
	 * @param {Object} object 
	 * @callback callback - Returns object saved to IndexedDB with DB_KEYPATH_FIELD set
	 */
	_DatabaseModule.putObject = function (objectStoreName, object, callback) {
		console.log("IndexedDB - Put object into '" + objectStoreName + "' ...");

		// Create transaction to perform operation on Object Store
		var transaction = database.transaction(objectStoreName, "readwrite");

		transaction.oncomplete = function (event) {
			console.debug("IndexedDB - Transaction completed for " + objectStoreName);
		};

		transaction.onerror = function (event) {
			console.error("IndexedDB - Failed to create Transaction for " + objectStoreName, event.target.result);
		};

		// Open the Object Store
		var objectStore = transaction.objectStore(objectStoreName);

		// Clean the DB_KEYPATH_FIELD to be a number
		if (object[DB_KEYPATH_FIELD] && !Number.isInteger(object[DB_KEYPATH_FIELD])) {
			object[DB_KEYPATH_FIELD] = Number.parseInt(object[DB_KEYPATH_FIELD]);
		}

		// Request PUT to IndexedDB Object Store
		var request = objectStore.put(object);

		request.onsuccess = function (event) {
			object.id = event.target.result;
			callback(object);
			console.log("IndexedDB - Succesfully put object id: " + object.id + " into objectStore: " + objectStoreName);
		};

		request.onerror = function (event) {
			console.error("IndexedDB - Failed to add object to " + objectStoreName, event.target.error);
		};
	};

	/**
	 * Removes an object with key {objectKey} from Object Store.
	 * 
	 * @param {string} objectStoreName 
	 * @param {number} objectKey 
	 */
	_DatabaseModule.deleteKey = function (objectStoreName, objectKey) {
		console.log("IndexedDB - Delete objectKey: " + objectKey + " from '" + objectStoreName + "' ...");

		// Ensure the key is a number
		if (!Number.isInteger(objectKey)) {
			objectKey = Number.parseInt(objectKey);
		}

		var transaction = database.transaction(objectStoreName, "readwrite");

		transaction.oncomplete = function (event) {
			console.debug("IndexedDB - Transaction completed for " + objectStoreName);
		};

		transaction.onerror = function (event) {
			console.error("IndexedDB - Failed to create Transaction for " + objectStoreName, event.target.result);
		};

		// Open the Object Store
		var objectStore = transaction.objectStore(objectStoreName);

		// Request DELETE to IndexedDB Object Store
		var request = objectStore.delete(objectKey);

		request.onsuccess = function (event) {
			console.log("IndexedDB - Deleted objectKey " + objectKey + " from " + objectStoreName);
		};

		request.onerror = function (event) {
			console.error("IndexedDB - Failed to add object to " + objectStoreName);
		};
	};

	/**
	 * Removes an object from Object Store.  Must have key field DB_KEYPATH_FIELD defined.
	 * 
	 * @param {string} objectStoreName 
	 * @param {Object} object 
	 */
	_DatabaseModule.deleteObject = function (objectStoreName, object) {
		if (object.id) {
			_DatabaseModule.deleteKey(objectStoreName, object.id);
		} else {
			console.error("IndexedDB - Could not delete, did not have DB_KEYPATH_FIELD set on object");
		}
	};

	return _DatabaseModule;
}());