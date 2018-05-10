$(document).ready(function() {
	if(window.indexedDB) {
		database.open();
	}
	
	$('.hiddenDivs').hide();
	
	$('#addButton').click(addHiddenDiv);
});

function addHiddenDiv() {
	var text = { value: "", firstValue: "", secondValue: "" };
	database.putObject(DB_OBJECT_STORE_TEST, text, finishAddHiddenDiv);
}

function finishAddHiddenDiv(text) {
	var hiddenElement = $('#hiddenAddMe');
	
	var copy = $(hiddenElement).clone().show();
	
	$(copy)[0].id = text.id;
	
	$(copy).find('.accordion').accordion({
	  heightStyle: "content",
	  collapsible: true
	});
	
	$(copy).find('.firstValue').on("keyup", function(event) {
		updateText($(event.target));
	});
	
	$(copy).find('.secondValue').on("keyup", function(event) {
		updateText($(event.target));
	});

	$(copy).appendTo('#holdingDiv');
}

function updateText(target) {
	var container = $(target).closest('.hiddenDivs');
	
	var output = $(container).find('.textOutput');
	var text1 = $(container).find('.firstValue');
	var text2 = $(container).find('.secondValue');
	
	var text = {
		value: $(text1)[0].value + " : " + $(text2)[0].value,
		firstValue: $(text1)[0].value,
		secondValue: $(text2)[0].value, 
		id: $(container)[0].id
	};
	
	database.putObject(DB_OBJECT_STORE_TEST, text, function() {});
	
	$(output)[0].innerText = text.value;
}