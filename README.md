# Example-Progressive-HTML5-App

Example projects that use Progressive HTML5 Web application design.  I've tried to NOT use bleeding edge features, so most of these techniques should work in older browsers.

## Basic IndexedDB Example

This project uses IndexedDB to store/retrieve persistent client data.

### Requirements

* Chrome v38+
* Firefox v37+
* Edge v12+
* IE 11

* IndexedDB - https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

### How to run

Can open index.html with Chrome/Firefox.


## Cached Basic IndexedDB Example

This project uses a Service Worker (which itself uses Promises and Cache) to cache the website.  Upgrading requires the browser to be closed and reopened.

### Requirements

* Chrome v46+
* Firefox v44+
* Edge v17+

* Service Worker - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
* Promises - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
* Caches - https://developer.mozilla.org/en-US/docs/Web/API/Cache
* IndexedDB - https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

### How to run

On Windows, you can use Cygwin with Python installed.  

* Open cygwin window with root of project folder as working directory.  Run:  python -m SimpleHTTPServer 8001
* Access the site by browsing to:  http://127.0.0.1:8001/cached_basic_indexedDB/index.html


## Resources

I heavily leaned on the following resources while putting these together:

* https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
* https://github.com/mdn/sw-test/
