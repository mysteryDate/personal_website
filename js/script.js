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
	var portfolio_data;
	$.getJSON("bin/portfolio.json", function(json) {
		portfolio_data = json;
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
		for (var i = 0; i < portfolio_data.length; i++) {
			$('#'+portfolio_data[i].category).append("<div class='portfolioEntry' portfolio_data-id="+portfolio_data[i].id+"></div>");
			$('#'+portfolio_data[i].category+' .portfolioEntry').last().append("<img src='bin/portfolio_thumbnails/"+portfolio_data[i].thumbnail+"'><img>");
		};

		add_handlers();
		// $("body").css('width', $(window).width());
		window.setTimeout(function(){change_section()}, 500);
	}

	function change_section() {
		// HACK AWAY!

		$("#mainScreen").empty();

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

	function set_main_screen(project){
		$("#mainScreen").empty().append("<iframe src="+project.embed+" frameborder='0' allowfullscreen>></iframe><p class='description'></p>");
		var iframeWidth = $('#mainScreen iframe').width();
		$("#mainScreen iframe").css('height', iframeWidth*9/16);
		$("#mainScreen p").append("<strong>"+project.title+"</strong><br>"+project.description);
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
				var data_id = $(this).attr('portfolio_data-id');
				var project;
				for (var i = 0; i < portfolio_data.length; i++) {
					if( portfolio_data[i].id == data_id ) {
						project = portfolio_data[i]; 
					}
				};
				set_main_screen(project);
			}
		});

		// window.onresize = function(e){
		// 	setup();
		// });

	}

});