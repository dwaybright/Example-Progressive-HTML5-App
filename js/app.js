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
	
	var value1 = $(text1)[0].value;
	var value2 = $(text2)[0].value;
	var val = value1 + " : " + value2;
	
	var text = {
		value: val,
		firstValue: value1,
		secondValue: value2, 
		id: parseInt($(container)[0].id, 10) 
	};
	
	database.putObject(DB_OBJECT_STORE_TEST, text, function() {});
	
	$(output)[0].innerText = text.value;
}