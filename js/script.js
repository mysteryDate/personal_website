"use strict";

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log(isMobile);

$(document).ready(function(){

	// Lets openFrameworks this shiz
	function setup() {
		// Create underlining
		for (var i = 0; i < 5; i++) {
			$('#underline').append("<div class='highlight'></div>");
		};

		var $selected = $("#mainNavigation .selected");
		var selectedWidth = $selected.width();
		var textHeight = $selected.height();

		$("#mainNavigation").css('height', textHeight);
		$("#mainNavigation div").each(function(i, elem) {
			var w = $(this).width();
			$(this).css("left", "calc(-"+w/2+"px + "+(i*33+17)+"%)");
		});


	}

	function update() {
		// HACK AWAY!
		var $selected = $("#mainNavigation .selected");
		var selectedWidth = $selected.width();

		$.each( $("#underline .highlight"), function(i, elem) {
			$(this).delay(i*100).velocity({
				width: selectedWidth + 4,
				left: $selected.position().left - 2
			}, {duration: 1000});
		});
	}

	$("#mainNavigation div").on('click', function(e){
		$("#mainNavigation .selected").removeClass("selected");
		$(this).addClass("selected");
		update();
	});

	setup();
	update();
});