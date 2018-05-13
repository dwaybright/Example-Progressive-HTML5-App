var CACHE_NAME = 'cacheV1';

var ROOT_PATH = '/foundation6_html5_app/';

var CACHE_URLS = [
    ROOT_PATH + 'index.html',

    ROOT_PATH + 'css/',
    ROOT_PATH + 'css/foundation.css',
    ROOT_PATH + 'css/style.css',

    ROOT_PATH + 'js/',
    ROOT_PATH + 'js/app.js',
    ROOT_PATH + 'js/dbModule.js',
    ROOT_PATH + 'js/jquery-3.3.1.min.js',
    ROOT_PATH + 'js/sizzle.min.js',
    ROOT_PATH + 'js/sizzle.min.map',

    ROOT_PATH + 'js/foundation/',
    ROOT_PATH + 'js/foundation/foundation.js',
    ROOT_PATH + 'js/foundation/what-input.js',

    ROOT_PATH + 'js/polyfill/',
    ROOT_PATH + 'js/polyfill/Number.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.debug("Adding all '" + CACHE_NAME + "' files to cache.");

            return cache.addAll(CACHE_URLS);
        }).catch(function (error) {
            console.warn("Cache Service Worker - Install failed with ", error);
            console.warn("If this is related to ServiceWorker update, will need to close browser and reopen.");
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.debug("Fetching " + event.request.url.toString() + " ...");

    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response !== undefined) {
                console.debug("Fetched " + event.request.url.toString() + " from cache");

                return response;
            } else {
                return fetch(event.request).then(function (response) {
                    console.debug("Fetched " + event.request.url.toString() + " from web");

                    let responseClone = response.clone();

                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseClone);
                    });

                    return response;
                }).catch(function (error) {
                    console.error("Failed to fetch " + event.request.url.toString() + " from web", error);

                    return caches.match('/css/images/notonline.png');
                });
            }
        })
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);

                    console.debug("Removed cache version '" + key + "'");
                }
            }));
        }).catch(function (error) {
            console.error("Cache Service Worker - Activate failed with ", error);
        })
    );
});