"use strict";

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log(isMobile);

// Portfolio item class
function PortfolioItem() {
	this.id = 0;
	this.name = "";
	this.category = "";
	this.thumbnail = "";
	this.embed = "";
	this.link = "";
	this.title = "";
	this.description = "";
}

$(document).ready(function(){

	// Read in JSON
	var json_data;
	var portfolio_data = {}; //HACK
	$.getJSON("bin/portfolio.json", function(json) {
		json_data = json;
		for (var i = 0; i < json_data.length; i++) {
			var name = json_data[i].name;
			portfolio_data[name] = json_data[i];
		};
		setup();
	});

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

		// Setup portfolio section
		for (var entry in portfolio_data) {
			if (portfolio_data.hasOwnProperty(entry)) {
				$('#'+portfolio_data[entry].category).append("<div class='portfolioEntry' portfolio_data-key="+entry+"></div>");
				$('#'+portfolio_data[entry].category+' .portfolioEntry').last().append("<img src='bin/portfolio_thumbnails/"+portfolio_data[entry].thumbnail+"'><img>");
			};
		};

		add_handlers();
		// $("body").css('width', $(window).width());
		window.setTimeout(function(){change_section()}, 500);
	}

	function change_section() {
		// HACK AWAY!

		// $("#mainScreen").empty();

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

	function set_main_screen(project) {
		var $mainScreen = $("#mainScreen");
		var $iframe = $("#mainScreen iframe");
		if($mainScreen.css('display') == "none") { // Create the screen
			var windowWidth = $(window).width();
			$iframe.css({
				width: windowWidth*0.6,
				height: windowWidth*0.6*9/16
			});
			$mainScreen.velocity("slideDown");
		}
		switch_main_screen(project);

		$iframe.on('load.mainScreen', function(e) {
			$(this).delay(100).velocity({opacity: 1});
			$(this).siblings().delay(600).velocity({opacity: 1});
		});

		$("#closeSwitch").on('click.mainScreen', function(e) {
			$(this).css('backgroundPositionX', '-40px');
			$mainScreen.velocity("slideUp");
			$("*").off(".mainScreen");
		});

		function switch_main_screen (new_project) {
			$mainScreen.children().velocity({opacity: 0});
			$iframe.attr('src', new_project.embed);
			$("#mainScreen p").html("<strong>"+project.title+"</strong><br>"+project.description);
		}
	}

	function add_handlers(){

		// Handlers!
		$("#mainNavigation div").on('click', function(e){
			$("#mainNavigation .selected").removeClass("selected");
			$('.section').css('display', 'none');
			$(this).addClass("selected");
			var textid = '#' + $(this).children('h2').html().toLowerCase();
			$(textid).css('display', 'block')
			change_section();
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

		$('.portfolioEntry').on({
			mouseenter: function(e){
				$(this).velocity({
					opacity: 0.5});
			},
			mouseleave: function(e) {
				$(this).velocity({
					opacity: 1});
			},
			click: function(e) {
				var key = $(this).attr('portfolio_data-key');
				set_main_screen(portfolio_data[key]);
			}
		});

		// window.onresize = function(e){
		// 	setup();
		// });

	}

});