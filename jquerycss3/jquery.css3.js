﻿/*
  jquery.css3.js - copyright 2004-2010, GuCong
  http://jquerycss3.googlecode.com/
  http://www.gnu.org/licenses/gpl.html
*/
( function($, win, doc, undefined) {
var b = {};
/*@cc_on @if (@_jscript)
	b.msie = b.version = doc.documentMode || (doc.compatMode == "CSS1Compat" ? "XMLHttpRequest" in window ? 7 : 6 : 5);
	b.cssPre = "ms";
@else @*/
	if ( win.opera ) {
		b.opera = b.version = opera.version();
		b.cssPre = "O";
	} else if ( win.WebKitPoint ) {
		try{
			b.version = navigator.appVersion.match(/webkit\/([\d\.]+)/i)[1];
		}catch(ex){}
		b.webkit = b.version || true;
		b.cssPre = "webkit";
		b.chrome = !!win.chrome;
		b.safari = /^apple\s+/i.test(navigator.vendor);
		try{
			b.maxthon = external.max_version;
		}catch(ex){}
	} else if ( win.netscape && navigator.product == "Gecko" ) {
		b.mozilla = b.gecko = b.version = navigator.buildID || true;
		b.cssPre = "Moz";
	} else {
		b.khtml = true;
		b.cssPre = "Khtml";
	}
/*@end @*/

//替换jQuery原生的$.browser对象
$.browser = b;


try {
	//建立统一的navigator.language对象
	navigator.language = (navigator.language || navigator.userLanguage).replace(/-[a-z]{2}/, function(str ) {
		return str.toUpperCase();
	});
}catch(e){}

if ( $.browser.msie < 10 ) {
	var scr = $(doc.scripts).last(), path =  scr.attr("src").replace(/.\w+$/, function(str){
		return ".ie" + str;
	});
	if ( !win.PIE ) {
		$("<script>").attr("src", path.replace(/[\w.]+$/, function(str){
			return "PIE.js";
		})).insertBefore(scr);
	}
	scr.attr("src", path);
}
if ( $.browser.webkit ) {
	//统一webkit专有CSS属性名
	var style = win.getComputedStyle( doc.documentElement, null );
	for ( var i = 0; i <= style.length; i++ ) {
		if ( style[i].indexOf( "-webkit-" ) == 0 ) {
			$.cssProps[$.camelCase(style[i].slice(8))] = $.camelCase(style[i]);
		}
	}

	//检测是否支持linear-gradient
	if( !$('<div style="background: -webkit-linear-gradient(top , #000, #fff);background: linear-gradient(top , #000, #fff)"></div>').css( "background" ) ){
		$.cssHooks.backgroundImage = {
			get: function( elem ) {
				var v = elem.style.backgroundImage.match( /gradient\(linear,\s*(\d+)\%\s*(\d+)\%,\s*(\d+)\%\s*(\d+)\%,\s*from\((.+)\),\s*to\((.+)\)\s*\)/ );
				if ( v ) {
					var g = new Array();
					if (v[2] < v[4]) {
						g.push("top")
					} else if (v[2] > v[4]) {
						g.push("bottom")
					} else if (v[1] < v[2]) {
						g.push("left")
					} else if (v[1] > v[2]) {
						g.push("right")
					}
					g.push( v[5], v[6] );
					return  "linear-gradient(" + g.join(", ") + ")";
				}
			},
	
			set: function( elem, value ) {
				if ( /linear-gradient/g.test( value ) ) {
					var pos, color = value.match( /#[0-9a-f]+|rgba?\([\d\,\s\%\.]+\)/ig );
					if ( value.indexOf("left") >= 0 ) {
						pos = "left center, right center";
					} else if (value.indexOf("right") >= 0 ) {
						pos = "right center, left center ";
					} else if (value.indexOf("bottom") >= 0 ) {
						pos = "center bottom, center top";
					} else {
						pos = "center top, center bottom";
					}
					return "-webkit-gradient(linear, " + pos + ", from("+color[0]+"), to("+color[1]+"))";
				}
				return value;
			}
		};
		$.cssHooks.background = {
			set: function( elem, value ) {
				value = $.cssHooks.backgroundImage.set( elem, value );
				return value;
			}
		}
	}

} else {
	//统一各浏览器私有CSS属性名
	var style = doc.createElement("div").style;
	var cssPre = $.browser.cssPre, index = cssPre.length;
	for ( var name in style ) {
		var n = name.substr( index, 1 ).toLowerCase() + name.slice( index + 1 );
		if ( !(n in style) && name.indexOf( cssPre ) == 0 ) {
			$.cssProps[ n ] = name;
		}
	}
}

if( !$.cssHooks.backgroundImage ){
	//统一css属性backgroundImage的私有值前缀
	var cssPre = "-" + $.browser.cssPre.toLowerCase() + "-";
	$.cssHooks.backgroundImage = {
		get: function( elem ) {
			try{
				return win.getComputedStyle( elem, null ).backgroundImage.replace( new RegExp(cssPre), "" );
			} catch( ex ) {}
		},
	
		set: function( elem, value ) {
			return $.trim(value).replace( /(\w+-)+gradient\(/i, function(str){
					return cssPre + str;
				});
		}
	};
	
	$.cssHooks.background = {
		set: function( elem, value ) {
			return $.cssHooks.backgroundImage.set( elem, value );
		}
	}
}

} ) ( jQuery, window, document );
