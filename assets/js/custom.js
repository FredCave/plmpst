var Page = {

	enData: [], 

	heData: [],

	arData: [], 

	firstTime: true, 

	currentLang: "en",

	currentEdit: 0, 

	currentIframe: "#background_two", 

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

		});

		$("#he_link").on("click", function(){
	
			self.switchLang("he");
			$(this).addClass("selected").siblings().removeClass("selected");

		});

		$("#ar_link").on("click", function(){

			self.switchLang("ar");
			$(this).addClass("selected").siblings().removeClass("selected");
	
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

		    url: "https://" + lang + ".wikipedia.org/w/api.php?action=query&format=json&prop=revisions&list=&titles=" + title + "&rvlimit=max",
    		dataType: 'jsonp',
		    headers: { 
		    	'Api-User-Agent': 'Palimpsest/1.1 (https://palimpsest.void.xxx/; fredcave@hotmail.com)' 
		    },
		    success: function(data) {
								
		    	var response = data.query.pages[Object.keys(data.query.pages)[0]];

		    	console.log( 97, response );

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

	initialLoad: function () {

		console.log("Page.initialLoad");

		// GET LATEST REVISION (ENGLISH)
		this.getEdit();

		// FADE IN IFRAMES WRAPPER
		setTimeout( function(){
			// FADE OUT ANIMATION
			$("#loading").animate({
				opacity : 0
			}, 1500, function (){
				$("#loading").hide();
			});

			$("#iframes_wrapper").css("opacity","1");
						
		}, 1000 );

	}, 

	getEdit: function () {

		console.log("Page.getEdit");

		var edit,
			title,
			currentArray,
			jump = 30;

		if ( this.currentLang === "en" ) {
			currentArray = this.enData;
			title = "Jerusalem";
		} else if ( this.currentLang === "he" ) {
			currentArray = this.heData;
			title = "ירושלים";
		} else if ( this.currentLang === "ar" ) {
			currentArray = this.arData;
			title = "القدس";
		}

		var edit = currentArray[ this.currentEdit ], 
			url = "https://" + this.currentLang + ".wikipedia.org/w/index.php?title=" + title + "&oldid=" + edit.revid;

		console.log( 155, edit.revid, edit.timestamp, url );
		this.showInfo( edit );
		this.loadIframe( url );

		// INCREMENENT
		this.currentEdit = this.currentEdit + jump;
		if ( this.currentEdit >= currentArray.length ) {
			this.currentEdit = 0;
		}

	},

	showInfo: function ( edit ) {

		console.log("Page.showInfo");

		console.log( 108, edit.timestamp );

		var dateArray = edit.timestamp.split("-"),
			day = dateArray[2].split("T")[0], 
			month = this.months[ dateArray[1] - 1 ],
			year = dateArray[0];

		// ANIMATION TAKES 1 SEC
		// var interval;
		// interval = setInterval( function(){

		// 	$("#top_bar_info .day").text( Math.floor( Math.random() * 31 ) );
		// 	$("#top_bar_info .year").text( Math.floor( ( Math.random() * 18 ) + 2000 ) );

		// }, 200 );

		setTimeout( function (){
			// console.log( 180, "Stop animation." );

			// SHOW REAL INFO
			$("#top_bar_info .day").text( day );
			$("#top_bar_info .month").text( month );
			$("#top_bar_info .year").text( year );

			// clearInterval( interval );
		}, 5000 );

	}, 

	loadIframe: function ( url ) {

		console.log("Page.loadIframe");

		var self = this;

		// LOAD IFRAME
		$(this.currentIframe).attr( "src", url );
		console.log(225,"Source added.");

		console.log( 227, this.currentIframe );

		setTimeout( function(){
			$("#wrapper").css("opacity","0.5");
			console.log(229,"Fade in..");
			$(self.currentIframe).css("opacity","1").siblings().css("opacity","0");
		}, 1000 );

		setTimeout( function(){

			// TOGGLE TO NEXT IFRAME
			if ( this.currentIframe === "#background_one" ) {
				this.currentIframe = "#background_two";
			} else {
				this.currentIframe = "#background_one";
			}

			self.getEdit();
			
		}, 5000 );

	}, 

	switchLang: function ( lang ) {

		console.log("Page.switchLang", lang);

		if ( lang === "en" ) {
			$("#text-en").show().siblings().not("#text_footer").hide();
		} else if ( lang === "he" ) {
			$("#text-he").show().siblings().not("#text_footer").hide();
		} else if (  lang === "ar" ) {
			$("#text-ar").show().siblings().not("#text_footer").hide();
		}

	}, 

	showText: function () {

		console.log("Page.showText");

		$("#down_arrow").fadeOut();

		setTimeout( function(){

			$("html,body").css("overflow-y","auto");

			$("#text_wrapper").css({
				"margin-top" : "18.5vh"
			});

		}, 500 );

	}, 

}

$(document).on("ready", function(){

	$("html,body").animate({
		scrollTop : 0
	}, 100 );

	Page.init();

});