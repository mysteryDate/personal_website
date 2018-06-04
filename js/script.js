"use strict";

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log(isMobile);

// Portfolio item class
function PortfolioItem() {
  this.id = 0;
  this.priority = 0;
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
    for (var i = 0; i < NUM_HIGHLIGHTS + 1; i++) {
      $('#underline').append("<div class='highlight'></div>");
    };
    $("#underline .highlight").each(function(i, elem) {
      $(this).css({
        backgroundColor: "hsl("+(i - 1)*360/NUM_HIGHLIGHTS+", 100%, 50%)"
      });
      if (i === 0) {
        $(this).css({
          backgroundColor: "white",
          opacity: "1"
        });
      }
    });

    var top_priority = 0;
    // Setup portfolio section
    for (var entry in portfolio_data) {
      if (portfolio_data.hasOwnProperty(entry)) {
        if (portfolio_data[entry].priority > top_priority) {
          top_priority = portfolio_data[entry].priority;
        };
      };
    };

    function add_portfolio_entries(priority) {
      for (var entry in portfolio_data) {
        if (portfolio_data.hasOwnProperty(entry)) {
          if (portfolio_data[entry].priority == priority ) {
            $('#'+portfolio_data[entry].category).append("<div class='portfolioEntry' portfolio_data-key="+entry+"></div>");
            $('#'+portfolio_data[entry].category+' .portfolioEntry').last()
              .append("<img src='bin/portfolio_thumbnails/"+portfolio_data[entry].thumbnail+"' class='portfolio'></img>"+
                "<div class='dummy'></div>"
                +"<p>"+portfolio_data[entry].title);
          };
        };
      };
    };

    while (top_priority >= 0) {
      add_portfolio_entries(top_priority);
      top_priority--;
    }

    add_handlers();

    window.onresize();

    $("#portfolio").ready(function(){
      $(".startHidden").velocity({opacity: 1});
      $('#gifLogo').attr('src', "bin/logo.gif");
      window.setTimeout(function(){
        change_section($("#mainNavigation div.selected"));
        $('#footer').css('opacity', 1);
      }, 1000);
    });
  }

  function change_section(newSection) {
    $('.section.selected').velocity('fadeOut').removeClass("selected");
    $("#mainNavigation .selected").removeClass("selected");
    $(newSection).addClass("selected");
    var textid = '#' + $(newSection).children('h2').html().toLowerCase();
    mixpanel.track(textid);
    $(textid).addClass('selected').velocity('fadeIn');

    $("#mainScreen").css('display', 'none');
    $("*").off(".mainScreen");

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
    mixpanel.track(project.name);
    var $mainScreen = $("#mainScreen");
    var $iframe = $("#mainScreen iframe");
    if($mainScreen.css('display') == "none") { // Create the screen
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();

      $iframe.css({
        width: windowWidth*0.75,
        height: windowWidth*0.75*9/16
      });
      $("#closeSwitch").css("backgroundPositionX", 0);
      if( $iframe.attr("src") != project.embed ) {
        $mainScreen.children(":not(#closeSwitch)").css({opacity: 0});
      }
      $("#line").velocity('scroll');
      $mainScreen.velocity("slideDown", {
        complete: function() {
         set_iframe();
        }
      });
    }
    else {
      var underline = $("#underline")
      $("#line").velocity('scroll', {
        complete: function() {
          set_iframe();
        }
      });
    }

    // See if it's actually changed
    function set_iframe() {
      if( $iframe.attr("src") != project.embed ) {
        $mainScreen.children(":not(#closeSwitch)").velocity({opacity: 0},{
          complete: function() {
            $iframe.attr('src', project.embed);
            $("#mainScreen p").html(
              "<a href="+project.link+"><strong>"+project.title+"</strong></a><br>"+project.description
            );
          }
        });
      };
    };

    $iframe.one('load.mainScreen', function(e) {
      $(this).ready(function(){
        $iframe.delay(100).velocity({opacity: 1});
        $iframe.siblings().delay(600).velocity({opacity: 1});
      });
    });

    $("#closeSwitch").one('click.mainScreen', function(e) {
      $(this).css('backgroundPositionX', "-40px");
      $mainScreen.velocity("slideUp");
      $("*").off(".mainScreen");
    });
  }

  function add_handlers(){

    // Handlers!
    $("#mainNavigation div").on('click', function(e){
      change_section(this);
    });

    $("#mainNavigation div").on('mouseenter', function(e){
      $("#underline .highlight").first()
        .css("left", $(this).position().left - 2).bind(this);
      $($("#underline .highlight")[1])
        .css("left", $(this).position().left - 2).bind(this);
    });

    var fade_duration = 1000;
    $('.portfolioEntry img').on({
      mouseenter: function(e){
        $(this).siblings('p').velocity({
          backgroundColorAlpha: 0.8
        }, {duration: fade_duration});
      },
      mouseleave: function(e) {
        $(this).siblings('p').velocity({
          backgroundColorAlpha: 0.2
        }, {duration: fade_duration});
      },
      click: function(e) {
        var section = $(this).parent();
        var data = portfolio_data[section.attr('portfolio_data-key')];
        mixpanel.track(data.name);
        if (isMobile || !isMobile) { // TODO I kinda like this behaviour better in general
          var gl = document.getElementById("goLink");
          if (gl) {
            gl.remove();
          }
          section.append("<a target='_blank' id='goLink' href="+data.link+"></a>");
          document.getElementById("goLink").click();
        } else {
          set_main_screen(data);
        }
      }
    });
  }

  window.onresize = function(e) {
    if($(window).width() > 1300) {
      $(".panel div.portfolioEntry").css('width', '33%');
    }
    else if($(window).width() > 1000) {
      $(".panel div.portfolioEntry").css('width', '49%');
    }
    else {
      $(".panel div.portfolioEntry").css('width', '100%');
    }
  }
});
