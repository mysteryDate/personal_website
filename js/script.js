"use strict";

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log(isMobile);

$(document).ready(function(){

	var NUM_HIGHLIGHTS = 15;
	// Lets openFrameworks this shiz
	function setup() {

		var $selected = $("#mainNavigation .selected");
		var selectedWidth = $selected.width();
		var textHeight = $selected.height();

		$("#mainNavigation").css('height', textHeight);
		$("#mainNavigation div").each(function(i, elem) {
			var w = $(this).width();
			$(this).css("left", "calc(-"+w/2+"px + "+(i*33+17)+"%)");
		});

		// Create underlining
		for (var i = 0; i < NUM_HIGHLIGHTS; i++) {
			$('#underline').append("<div class='highlight'></div>");
		};
		$("#underline .highlight").each(function(i, elem) {
			$(this).css({
				backgroundColor: "hsl("+i*360/NUM_HIGHLIGHTS+", 100%, 50%)",
				// opacity: 1/NUM_HIGHLIGHTS
			});
		});

		// $("body").css('width', $(window).width());
		// window.setTimeout(function(){update()}, 500);
	}

	function update() {
		// HACK AWAY!
		var $selected = $("#mainNavigation .selected");
		var selectedWidth = $selected.width();

		$.each( $("#underline .highlight"), function(i, elem) {
			$(this).delay(i*500/NUM_HIGHLIGHTS).velocity({
				width: selectedWidth + 4,
				left: $selected.position().left - 2
			}, 
			1000,
			[250,15]);
		});
	}

	// Handlers!
	$("#mainNavigation div").on('click', function(e){
		$("#mainNavigation .selected").removeClass("selected");
		$('.section').css('display', 'none');
		$(this).addClass("selected");
		var textid = '#' + $(this).children('h2').html().toLowerCase();
		$(textid).css('display', 'block')
		update();
	});
	// $("#mainNavigation").on('mousemove', function(e){
	// 	$("#underline .highlight").first()
	// 		.css("left", e.offsetX);
	// });
	$("#mainNavigation div").on('mouseenter', function(e){
		var self = this;
		$("#underline .highlight").first()
			.css("left", $(self).position().left - 2);
	});

	// window.onresize = function(e){
	// 	setup();
	// });

	setup();
});