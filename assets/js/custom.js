var Page = {

	enData: [], 

	heData: [],

	arData: [], 

	firstTime: true, 

	framesVisible: false, 

	currentLang: "en",

	currentEdit: 0, 

	textRevealed: false, 

	currentToLoad: 2,

	currentToShow: 0,  

	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], 

	init: function () {

		console.log("Page.init");

		this.bindEvents();

		this.loadingAnim();

	},

	bindEvents: function () {

		console.log("Page.bindEvents");

		var self = this;

		$("#en_link").on("click", function(){

			self.switchLang("en");
			$(this).addClass("selected").siblings().removeClass("selected");

			if ( !self.textRevealed ) {
				self.showText();
			}

		});

		$("#he_link").on("click", function(){
	
			self.switchLang("he");
			$(this).addClass("selected").siblings().removeClass("selected");

			if ( !self.textRevealed ) {
				self.showText();
			}

		});

		$("#ar_link").on("click", function(){

			self.switchLang("ar");
			$(this).addClass("selected").siblings().removeClass("selected");

			if ( !self.textRevealed ) {
				self.showText();
			}
	
		});

		$("#down_arrow img").on("click", function(){
	
			self.showText();

		});

	},

	loadingAnim: function () {

		console.log("Page.loadingAnim");

		var self = this;

		// FADE IN PAGE
		$("body").css("background-color","white");

		setTimeout ( function(){
	
			// LOAD ARTICLE DATA
			// OTHER LANGUAGES LOADED AFTER AJAX RESPONSE
			self.loadLangData( "en", "Jerusalem" );

		}, 500 );

	},

	loadLangData: function ( lang, title ) {

		console.log("Page.loadLangData", lang, title);

		var self = this;

		$.ajax({

		    url: "https://" + lang + ".wikipedia.org/w/api.php?action=query&format=json&prop=revisions&list=&titles=" + title + "&rvlimit=500",
    		dataType: 'jsonp',
		    headers: { 
		    	'Api-User-Agent': 'Palimpsest/1.1 (https://palimpsest.void.xxx/; fredcave@hotmail.com)' 
		    },
		    success: function(data) {
								
		    	var response = data.query.pages[Object.keys(data.query.pages)[0]];

		    	console.log( 118, response );

		    	// STORE IN ARRAY
		    	if ( lang === "en" ) { 
		    		self.enData = response.revisions;
		    	} else if (  lang === "he" ) {
					self.heData = response.revisions;
		    	} else if ( lang === "ar") {
					self.arData = response.revisions;
		    	}

		    	// IF HEBREW ARRAY IS EMPTY
		    	if ( !self.heData.length ) {
					self.loadLangData( "he", "ירושלים" );
		    	// IF ARABIC ARRAY IS EMPTY
		    	} else if ( !self.arData.length  ) {
					self.loadLangData( "ar", "القدس" );		    		
		    	}

		    	// ONCE DATA IS LOADED 
		    	if ( self.firstTime ) {
		    		self.initialLoad();
		    		self.firstTime = false;
		    	}

		    }

		});

	}, 

	initialLoad: function ( ) {

		console.log("Page.initialLoad");

		// LOAD IFRAMES ONE AND TWO (BUFFER)
		var self = this, 
			i = 0;
		while ( i < 2 ) {
			// console.log( 150, this.getSrc() );
			var response = this.getSrc();
			$("#wrapper_" + this.currentLang + " iframe").eq(i).attr({
				"src" 		: response[0],
				"data-date" : response[1]
			});
			i++;
		}

		this.interval = "";

		// FADE IN IFRAMES WRAPPER
		_.defer( function(){
			self.interval = setInterval( function(){
				self.frameLoop();
			}, 3000 );	
		});

		setTimeout( function(){
			// LOAD HEBREW INITIAL FRAMES
			i = 0;
			while ( i < 2 ) {
				// console.log( 150, this.getSrc() );
				var response = self.getSrc("he");
				$("#wrapper_he iframe").eq(i).attr({
					"src" 		: response[0],
					"data-date" : response[1]
				});
				i++;
			}		

			setTimeout( function(){
				// LOAD ARABIC INITIAL FRAMES
				i = 0;
				while ( i < 2 ) {
					// console.log( 150, this.getSrc() );
					var response = self.getSrc("ar");
					$("#wrapper_ar iframe").eq(i).attr({
						"src" 		: response[0],
						"data-date" : response[1]
					});
					i++;
				}	

			}, 1000 );

		}, 1000 );

	}, 

	getSrc: function ( _lang ) {

		console.log("Page.getSrc");

		var edit,
			title,
			currentArray,
			jump = 30,
			lang = _lang || this.currentLang;

		if ( lang === "en" ) {
			currentArray = this.enData;
			title = "Jerusalem";
		} else if ( lang === "he" ) {
			currentArray = this.heData;
			title = "ירושלים";
		} else if ( lang === "ar" ) {
			currentArray = this.arData;
			title = "القدس";
		}

		var edit = currentArray[ this.currentEdit ], 
			url = "https://" + lang + ".wikipedia.org/w/index.php?title=" + title + "&oldid=" + edit.revid;

		// INCREMENENT
		this.currentEdit = this.currentEdit + jump;
		if ( this.currentEdit >= currentArray.length ) {
			this.currentEdit = 0;
		}

		var dateArray = edit.timestamp.split("-"),
			day = dateArray[2].split("T")[0], 
			month = this.months[ dateArray[1] - 1 ],
			year = dateArray[0],
			date = day + "-" + month + "-" + year;

		var data = [ url, date ];

		return data;

	},

	frameLoop: function ( _lang ) {

		console.log("Page.frameLoop");

		var self = this, 
			lang = _lang || this.currentLang;

		// LOAD NEXT IFRAME
		var data = this.getSrc( lang );
		$("#wrapper_" + lang + " iframe").eq( this.currentToLoad ).off("load");
		$("#wrapper_" + lang + " iframe").eq( this.currentToLoad ).attr({
			"src" 		: data[0],
			"data-date" : data[1]
		});

		if ( !this.framesVisible ) {
			$("#global_iframe_wrapper").css("opacity","1");
			$("#wrapper").css("opacity","0.5");
			$("#loading").css("opacity","0");
			setTimeout( function(){
				$("#loading").hide();
			}, 2000 );
			this.framesVisible = true;
		}

		$("#wrapper_" + lang + " iframe").eq( this.currentToShow ).css("opacity","1").nextAll().css("opacity","0");

		this.currentToShow++;
		if ( this.currentToShow >= 3 ) {
			this.currentToShow = 0;
		}
		this.currentToLoad++;
		if ( this.currentToLoad >= 3 ) {
			this.currentToLoad = 0;
		}

		_.defer( function(){
			self.showInfo( $("#wrapper_" + lang + " iframe").eq( self.currentToShow - 1 ).attr("data-date") );
		});

	},

	showInfo: function ( date ) {

		console.log("Page.showInfo", date);

		var self = this, 
			index = 1,
			dates = date.split("-"),
			day = dates[0],
			month = dates[1],
			year = dates[2];

		var interval = setInterval( function(){

			$("#top_bar_info .month").text( self.months[ index ] );
			index++;

		}, 100 );
			
		setTimeout( function(){

			// SHOW REAL INFO
			$("#top_bar_info .day").prop('number', 1).animateNumber({ number: day });
			$("#top_bar_info .month").text( month );
			$("#top_bar_info .year").prop('number', 2000).animateNumber({ number: year });

			clearInterval( interval );

		}, 500 );

	}, 

	switchLang: function ( lang ) {

		console.log("Page.switchLang", lang);

		var self = this;

		if ( lang !== this.currentLang ) {

			if ( lang === "en" ) {
				$("#text-en").show().siblings(".text").hide();
			} else if ( lang === "he" ) {
				$("#text-he").show().siblings(".text").hide();
			} else if (  lang === "ar" ) {
				$("#text-ar").show().siblings(".text").hide();
			}

			// RESET VALUES
			this.currentLang = lang;
			this.currentToLoad = 2;
			this.currentToShow = 0;
			this.currentEdit = 0;
			
			$("#wrapper_" + lang).show().siblings(".iframes_wrapper").hide();

			this.frameLoop( lang ); 

		}

	}, 

	showText: function () {

		console.log("Page.showText");

		$("#down_arrow").fadeOut();

		setTimeout( function(){

			$("body").css({
				"overflow-y" 	: "scroll",  
				"height"		: "auto"
			});

			$("#wrapper").css({
				"overflow-y"	: "auto"
			});

			_.defer( function(){
				$("#text_wrapper").css({
					"margin-top" 	: "18.5vh"
				});
			});

			$("#loading").css("opacity","0");
			setTimeout( function(){
				$("#loading").hide();
			}, 2000 );

		}, 500 );

		this.textRevealed = true;

	}, 

}

$(document).on("ready", function(){

	$("html,body").animate({
		scrollTop : 0
	}, 100 );

	Page.init();

});