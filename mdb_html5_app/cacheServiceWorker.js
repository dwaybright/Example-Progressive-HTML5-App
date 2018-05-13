var CACHE_NAME = 'cacheV1';

var CACHE_URLS = [
    '/cached_basic_indexedDB/index.html',
    '/cached_basic_indexedDB/js/',
    '/cached_basic_indexedDB/js/app.js',
    '/cached_basic_indexedDB/js/dbModule.js',
    '/cached_basic_indexedDB/js/polyfillNumber.js',
    '/cached_basic_indexedDB/js/jquery-3.3.1.min.js',
    '/cached_basic_indexedDB/js/jquery-ui-1.12.1.min.js',
    '/cached_basic_indexedDB/css/',
    '/cached_basic_indexedDB/css/jquery-ui.min.css',
    '/cached_basic_indexedDB/css/jquery-ui.structure.min.css',
    '/cached_basic_indexedDB/css/jquery-ui.theme.min.css',
    '/cached_basic_indexedDB/css/local.css',
    '/cached_basic_indexedDB/css/images/notonline.png',
    '/cached_basic_indexedDB/css/images/ui-bg_glass_25_cb842e_1x400.png',
    '/cached_basic_indexedDB/css/images/ui-bg_glass_70_ede4d4_1x400.png',
    '/cached_basic_indexedDB/css/images/ui-bg_glass_100_f5f0e5_1x400.png',
    '/cached_basic_indexedDB/css/images/ui-bg_highlight-hard_65_fee4bd_1x100.png',
    '/cached_basic_indexedDB/css/images/ui-bg_highlight-hard_75_f5f5b5_1x100.png',
    '/cached_basic_indexedDB/css/images/ui-bg_highlight-hard_100_f4f0ec_1x100.png',
    '/cached_basic_indexedDB/css/images/ui-bg_inset-soft_100_f4f0ec_1x100.png',
    '/cached_basic_indexedDB/css/images/ui-icons_c47a23_256x240.png',
    '/cached_basic_indexedDB/css/images/ui-icons_cb672b_256x240.png',
    '/cached_basic_indexedDB/css/images/ui-icons_f35f07_256x240.png',
    '/cached_basic_indexedDB/css/images/ui-icons_f08000_256x240.png',
    '/cached_basic_indexedDB/css/images/ui-icons_ff7519_256x240.png',
    '/cached_basic_indexedDB/css/images/ui-icons_ffffff_256x240.png'
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