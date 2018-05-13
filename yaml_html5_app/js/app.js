$(document).ready(function () {
    if ('Promise' in window &&
        'serviceWorker' in navigator &&
        'caches' in window) {

        navigator.serviceWorker.register('/yaml_html5_app/cacheServiceWorker.js', {
            scope: '/yaml_html5_app/'
        }).then(function (reg) {
            if (reg.installing) {
                console.debug('Cache Service Worker - Installing');
            } else if (reg.waiting) {
                console.debug('Cache Service Worker - Installed');
            } else if (reg.active) {
                console.debug('Cache Service Worker - Active');
            }
        }).catch(function (error) {
            console.error('Cache Service Worker - Registration failed with ', error);
        });
    } else {
        alert("You will be unable to run in Offline mode.");
    }

    if (window.indexedDB) {
        database.open(databaseReady);
    }

    // Hide hidden DIVs
    //$('.hiddenDivs').hide();

    // Wire up remaining event handlers
    $('#addButton').on("click", addNewCopyOfHiddenDiv);
});

function databaseReady() {
    // Pull stored values in database
    database.getAllObjects(DB_OBJECT_STORE_TEST, addSavedCopiesOfHiddenDivs);
}

function addNewCopyOfHiddenDiv(event) {
    var text = {
        value: " : ",
        firstValue: "",
        secondValue: ""
    };

    database.putObject(DB_OBJECT_STORE_TEST, text, AddObjectToDOM);
}

function addSavedCopiesOfHiddenDivs(savedObjects) {
    for (var i = 0; i < savedObjects.length; i++) {
        AddObjectToDOM(savedObjects[i]);
    }
}

function AddObjectToDOM(text) {
    var hiddenElement = $('#hiddenAddMe');

    var copy = $(hiddenElement).clone();

    $(copy).removeClass("hiddenDivs");

    $(copy)[0].id = text.id;

    var accordion = $(copy).find('.accordion');
    $(accordion).accordion({
        heightStyle: "content",
        collapsible: true
    });

    $(copy).find('.deleteButton').on("click", deleteInfoBox);

    var firstValueField = $(copy).find('.firstValue');
    $(firstValueField).on("keyup", updateText);
    $(firstValueField)[0].value = text.firstValue;

    var secondValueField = $(copy).find('.secondValue');
    $(secondValueField).on("keyup", updateText);
    $(secondValueField)[0].value = text.secondValue;

    var textOutputField = $(copy).find('.textOutput');
    $(textOutputField)[0].innerText = text.value;

    $(copy).appendTo('#holdingDiv');
}

function updateText(event) {
    var target = event.target;

    // Find references to all variable fields
    var container = $(target).closest('.entryPanel');
    var output = $(container).find('.textOutput');
    var text1 = $(container).find('.firstValue');
    var text2 = $(container).find('.secondValue');

    var text = {
        value: $(text1)[0].value + " : " + $(text2)[0].value,
        firstValue: $(text1)[0].value,
        secondValue: $(text2)[0].value,
        id: $(container)[0].id
    };

    // no callback function needed, since "text" already has an ID set
    database.putObject(DB_OBJECT_STORE_TEST, text);

    $(output)[0].innerText = text.value;
}

function deleteInfoBox(event) {
    var container = $(event.currentTarget).closest('.entryPanel');

    // delete from database
    database.deleteKey(DB_OBJECT_STORE_TEST, $(container)[0].id);

    // remove from DOM
    $(container).detach();
}