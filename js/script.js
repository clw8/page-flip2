
(function() {

	//User can change these variables
	var PAGE_WIDTH = 400;
	var PAGE_HEIGHT = 400;


	var CANVAS_PADDING = 60;

	var CENTER_COVER = true;

	var PAGE_CORNER_RADIUS = 4;



	//Do not change code below this comment
	var page = 0;

	var canvas = document.getElementById( "pageflip-canvas" );
	var context = canvas.getContext( "2d" );

	var CenteredFrontCover = CENTER_COVER;
	var CenteredBackCover = false;

	var movingDiv = document.getElementById( "moving-div" );

	var mouse = { x: 0, y: 0 };

	var flips = [];
	var activeFlip = {};

	var book = document.getElementById( "book" );
	var BOOK_HEIGHT = PAGE_HEIGHT;
	var BOOK_WIDTH = PAGE_WIDTH * 2;
	book.style.width = BOOK_WIDTH  + "px";
	book.style.height = BOOK_HEIGHT  + "px";


	// List of all the page elements in the DOM
	var softCover = Array.prototype.slice.call(book.getElementsByClassName( "soft-cover" ));
	var softBackCover = Array.prototype.slice.call(book.getElementsByClassName( "soft-back-cover" ));
	var hardCover = Array.prototype.slice.call(book.getElementsByClassName( "hard-cover" ));
	var covers = softCover.concat(hardCover);
	var backCovers = softBackCover;
	var oddPages = Array.prototype.slice.call(book.querySelectorAll( ".soft-back-cover, .odd-page" ));
	var evenPages = Array.prototype.slice.call(book.querySelectorAll( ".soft-cover, .even-page" ));

	var emptyDiv = document.createElement("div");
	var emptyNestedDiv = document.createElement("div");

//getting the plugin to work with front and back covers
	if(softBackCover.length > 0){

	}
	else{
		emptyNestedDiv.appendChild(emptyDiv);
		oddPages.push(emptyDiv);
	}

if(backCovers.length > 0){
	backCovers[0].style.width = "0px";
	backCovers[0].style.height = PAGE_HEIGHT + "px";
	backCovers[0].parentElement.style.width = PAGE_WIDTH + "px";
	backCovers[0].parentElement.style.height = PAGE_HEIGHT + "px";
}


	// Organize the style of our pages and create the flip definitions
	for( var i = 0, len = evenPages.length; i < len; i++ ) {
		evenPages[i].style.zIndex = len - i;
		evenPages[i].style.width = PAGE_WIDTH + "px";
		evenPages[i].style.height = PAGE_HEIGHT + "px";
		evenPages[i].parentElement.style.width = PAGE_WIDTH + "px";
		evenPages[i].parentElement.style.height = PAGE_HEIGHT + "px";
		evenPages[i].parentElement.style.left = (CENTER_COVER==true && covers.length > 0) ? PAGE_WIDTH/2 + "px" : BOOK_WIDTH/2  + "px";
		evenPages[i].parentElement.style.borderTopRightRadius =  PAGE_CORNER_RADIUS + "px" ;
		evenPages[i].parentElement.style.borderBottomRightRadius =  PAGE_CORNER_RADIUS + "px" ;

		var o = Math.min(i, (oddPages.length - 1));
		oddPages[o].style.height = PAGE_HEIGHT + "px";
		oddPages[o].parentElement.style.width = PAGE_WIDTH + "px";
		oddPages[o].parentElement.style.height = PAGE_HEIGHT + "px";
		oddPages[o].parentElement.style.left =  (CENTER_COVER==true && covers.length > 0) ? PAGE_WIDTH/2 + "px" : BOOK_WIDTH  + "px";
		oddPages[o].parentElement.style.borderTopLeftRadius =  PAGE_CORNER_RADIUS + "px" ;
		oddPages[o].parentElement.style.borderBottomLeftRadius =  PAGE_CORNER_RADIUS + "px" ;


		var cover, coverActive, j;
		// Setup for soft cover
		if(softCover.length > 0){
			j = i;
			cover = softCover[0];

			oddPages[o].style.width = "0px";
			oddPages[0].style.width = "0px";
		}

		//setup for no cover
		else{
			//+1 due to opening page on the left
			j = i + 1;
			//accounting for undefined error when var j calls undefined object in oddPages array
			if(i + 1 > oddPages.length - 1 ){
				j = oddPages.length -1;
			}
			oddPages[o].style.zIndex = len - o + 1;
			oddPages[o].style.width = "0px";
			if( o == 0 ){
				oddPages[0].style.width = PAGE_WIDTH + "px";
			}
		}


				flips.push( {
			// Current progress of the flip (left -1 to right +1)
			progress: 1,
			// The target value towards which progress is always moving
			target: 1,
			// The page DOM element related to this flip
			page: evenPages[i],

			oddpage: oddPages[j],

			dragging: false,

			dragFromRight: false,

			dragFromLeft: false

		} );
	}


console.log(flips);
	// Resize the canvas to match the book size
	canvas.width = BOOK_WIDTH + ( CANVAS_PADDING * 2 );
	canvas.height = BOOK_HEIGHT + ( CANVAS_PADDING * 2);

	// Offset the canvas so that it's padding is evenly spread around the book
	canvas.style.top = -CANVAS_PADDING + "px";
	canvas.style.left = (CENTER_COVER==true && covers.length > 0) ? -CANVAS_PADDING - PAGE_WIDTH/2 + "px" : -CANVAS_PADDING + "px";



	// Render the page flip 100 times a second
	setInterval( render, 1000 / 100 );

	document.addEventListener( "mousemove", mouseMoveHandler, false );
	document.addEventListener( "mousedown", mouseDownHandler, false );
	document.addEventListener( "mouseup", mouseUpHandler, false );







	function mouseMoveHandler( event ) {
		// Offset mouse position so that the top of the book spine is 0,0
		mouse.x = event.clientX - book.offsetLeft - ( BOOK_WIDTH / 2 );
		mouse.y = event.clientY - book.offsetTop;
	}


	function mouseDownHandler( event ) {
		console.log(page)
		console.log(CenteredFrontCover + "FRONT COVER")
		// Make sure the mouse pointer is inside of the book
		if (Math.abs(mouse.x) < PAGE_WIDTH) {
			//scenario for if CENTER_COVER variable is true
			if ( CenteredFrontCover==true && -PAGE_WIDTH/2< mouse.x < PAGE_WIDTH/2){
				if (page == 0){
					flips[page].dragging = true;
					flips[page].dragFromRight = true;
				}
			}
			else if ( CenteredBackCover==true && -PAGE_WIDTH/2< mouse.x < PAGE_WIDTH/2){
				if (page == flips.length){
					flips[page - 1].dragging = true;
					flips[page - 1].dragFromLeft = true;
				}
			}
			//scenario for if CENTER_COVER variable is false
			else {
					if ( mouse.x < 0 && page - 1 >= 0 ) {
						// We are on the left side, drag the previous page
						flips[page - 1].dragging = true;
						flips[page - 1].dragFromLeft = true;
					}
					else if ( mouse.x > 0 ) {
							if(backCovers.length < 1 && page + 1 < flips.length){
							flips[page].dragging = true;
							flips[page].dragFromRight = true;
							}
							else if ( backCovers.length > 0 && page < flips.length) {
								flips[page].dragging = true;
								flips[page].dragFromRight = true;
							}
					}
		}

	}
	// Prevents the text selection
		event.preventDefault();
	}

	function mouseUpHandler( event ) {
		for( var i = 0; i < flips.length; i++ ) {
			console.log(flips)

			// If this flip was being dragged, animate to its destination
			if( flips[i].dragging ) {

				//if mouse is on left side and page has been dragged to the right
					if( mouse.x < 0 && flips[i].dragFromRight == true ) {
							flips[i].target = -1;
							page = Math.min( page + 1, flips.length );

							if(CENTER_COVER == true){
								if(CenteredFrontCover == true && covers.length > 0 && page > 0){
									returnPagesToPosition(changeCenteredFrontVar);
								}
								if(CenteredBackCover == false && backCovers.length>0 && page == flips.length){
										centerAllPages(changeCenteredBackVar, -CANVAS_PADDING+PAGE_WIDTH/2);
								}
							}
					}
					//if mouse is on left side but page hasn't been dragged
					else if( mouse.x < 0 ) {
							flips[i].target = -1;
					}
					//if mouse is on right side and page has been dragged to the left
					else if (mouse.x >=0 && flips[i].dragFromLeft == true ){
							flips[i].target = 1;
							page = Math.max( page - 1, 0 );

								if(CENTER_COVER == true){
									if(CenteredFrontCover == false && covers.length > 0 && page == 0){
									centerAllPages(changeCenteredFrontVar, -CANVAS_PADDING-PAGE_WIDTH/2);
									}
									if(CenteredBackCover == true && backCovers.length> 0 && backCovers.length > 0 && page < flips.length ){
										returnPagesToPosition(changeCenteredBackVar);
									}
								}
					}
					//if mouse is on right side, but page hasn't been dragged
					else if( mouse.x >= 0 ) {
							flips[i].target = 1;
					}
			}
			console.log("page changed to" + page)
			flips[i].dragging = false;
			flips[i].dragFromRight = false;
			flips[i].dragFromLeft = false;

		}
		function returnPagesToPosition(callback){


			//return all pages to original positions
			setTimeout(function(){
				TweenLite.to(canvas, 0.6, {left: -CANVAS_PADDING, onComplete: callback});

				for( var j = 0; j < evenPages.length; j++ ) {
				TweenLite.to(evenPages[j].parentElement, 0.61, {left: BOOK_WIDTH/2});
				}

				for( var k = 0; k < oddPages.length; k++ ) {
					//left: 1 to eliminate gap upon animation
				TweenLite.to(oddPages[k].parentElement, 0.6, {left: 1});
				}
			}, 260)

		}

		function centerAllPages(callback, canvasleft){
			setTimeout(function(){
				TweenLite.to(canvas, 1, {left: canvasleft, onComplete: callback});

				for( var j = 0; j < evenPages.length; j++ ) {
				TweenLite.to(evenPages[j].parentElement, 0.61, {left: PAGE_WIDTH/2});
				}

				for( var k = 0; k < oddPages.length; k++ ) {
					//left: 1 to eliminate gap upon animation
				TweenLite.to(oddPages[k].parentElement, 0.6, {left: PAGE_WIDTH/2});
				}
			}, 260)
		}

		function changeCenteredFrontVar(){
			CenteredFrontCover = !CenteredFrontCover;
		}

		function changeCenteredBackVar(){
			CenteredBackCover = !CenteredBackCover;
		}


	}





	function render() {

		// Reset all pixels in the canvas
		context.clearRect( 0, 0, canvas.width, canvas.height );

		for( var i = 0, len = flips.length; i < len; i++ ) {
			var flip = flips[i];

			if( flip.dragging ) {
				if(CenteredFrontCover == true){
					flip.target = Math.max( Math.min( mouse.x / PAGE_WIDTH + 0.5, 1 ), -1 );
				}
				else if(CenteredBackCover == true){
					flip.target = Math.max( Math.min( mouse.x / PAGE_WIDTH - 0.5, 1 ), -1 );
				}
				else{
					flip.target = Math.max( Math.min( mouse.x / PAGE_WIDTH, 1 ), -1 );
				}
			}

			// Ease progress towards the target value
			flip.progress += ( flip.target - flip.progress ) * 0.2;

			// If the flip is being dragged or is somewhere in the middle of the book, render it
			if( flip.dragging || Math.abs( flip.progress ) < 0.999 ) {
				drawFlip( flip );
			}

		}

	}

	function drawFlip( flip ) {




		// Strength of the fold is strongest in the middle of the book
		var strength = 1 - Math.abs( flip.progress );
		var strengthEdit = Math.max((1 - Math.abs ( flip.progress - 0.5)), 0);
		// Width of the folded paper
		var foldWidth = ( PAGE_WIDTH * 0.5 ) * ( 1 - flip.progress );

		// X position of the folded paper
		var foldX = PAGE_WIDTH * flip.progress + foldWidth;
		// How far the page should outdent vertically due to perspective
		var verticalOutdent = 1 * strength;

		// The maximum width of the left and right side shadows
		var paperShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( 1 - flip.progress, 0.5 ), 0 );
		var rightShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );
		var leftShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );

		var foldDiagonalX = foldX - foldWidth + (foldWidth * strengthEdit * Math.max(strength*0.55, 0.5) );
		var foldWidthDiagonal = foldWidth - (foldX -foldDiagonalX);

		if(CenteredFrontCover == true){
			flip.oddpage.parentElement.style.left = PAGE_WIDTH/2 + foldX - foldWidth  + "px";
		}
		else if(CenteredBackCover == true){
			flip.page.parentElement.style.left = PAGE_WIDTH/2 + PAGE_WIDTH + "px";
			flip.oddpage.parentElement.style.left = PAGE_WIDTH/2 + PAGE_WIDTH + foldX - foldWidth + "px";

		}
		else {
			flip.oddpage.parentElement.style.left = PAGE_WIDTH  + foldX - foldWidth + "px";
		}

		// Change page element width to match the x position of the fold
		flip.page.style.width = Math.max(foldX, 0) + "px";



		var skewDeg = -Math.atan2(foldWidthDiagonal, PAGE_HEIGHT);

		flip.oddpage.style.transform = "matrix(1, 0, " + skewDeg + ", 1, 0, 0)";
		flip.oddpage.style.clip = "rect(0px, " + (foldWidth) +  "px," + PAGE_HEIGHT + "px, 0px)";
		flip.oddpage.style.width = Math.min(foldWidth + (foldX *0.3), PAGE_WIDTH) + "px";
		flip.oddpage.style.left = (foldWidth - (foldX - foldDiagonalX))/2 + "px";

		flip.oddpage.parentElement.style.width = foldWidth + "px";

		// POTENTIAL FLAW
		if( Math.abs( flip.progress ) < 0.999){
		flip.oddpage.parentElement.style.zIndex = 99;}



		context.save();
		context.translate( CANVAS_PADDING + ( BOOK_WIDTH / 2 ), CANVAS_PADDING );


		// Draw a sharp shadow on the left side of the page
		context.strokeStyle = 'rgba(0,0,0,'+(0.025 * strength)+')';
		context.lineWidth = 15 * strength;
		context.beginPath();
		context.moveTo(foldDiagonalX-(context.lineWidth)/2, -verticalOutdent * 0.5);
		context.lineTo(PAGE_WIDTH * flip.progress - (context.lineWidth)/2, PAGE_HEIGHT + (verticalOutdent * 0.5));
		context.stroke();

		// Right side drop shadow
		var rightShadowGradient = context.createLinearGradient(foldX, 0, foldX + rightShadowWidth, 0);
		rightShadowGradient.addColorStop(0, 'rgba(0,0,0,'+(strength*0.25)+')');
		rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.0)');

		context.fillStyle = rightShadowGradient;
		context.beginPath();
		context.moveTo(foldX, 0);
		context.lineTo(foldX + rightShadowWidth, 0);
		context.lineTo(foldX + rightShadowWidth, PAGE_HEIGHT);
		context.lineTo(foldX, PAGE_HEIGHT);
		context.fill();


		// Left side drop shadow
		var leftShadowGradient = context.createLinearGradient(foldDiagonalX - leftShadowWidth, 0, foldDiagonalX, 0);
		leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0.0)');
		leftShadowGradient.addColorStop(1, 'rgba(0,0,0,'+(strength*0.4)+')');

		context.fillStyle = leftShadowGradient;
		context.beginPath();
		context.moveTo(foldDiagonalX - leftShadowWidth, 0);
		context.lineTo(foldDiagonalX, 0);
		context.lineTo(PAGE_WIDTH * flip.progress, PAGE_HEIGHT);
		context.lineTo(PAGE_WIDTH * flip.progress - leftShadowWidth, PAGE_HEIGHT);
		context.fill();


		// Gradient applied to the folded paper (highlights & shadows)
		var foldGradient = context.createLinearGradient(foldX - paperShadowWidth, 0, foldX, 0);
		foldGradient.addColorStop(0, 'rgba(0,0,0,0)');
		foldGradient.addColorStop(0.35, 'rgba(0,0,0,0)');
		foldGradient.addColorStop(0.73, 'rgba(0,0,0,' + Math.max((strength * 0.2), 0.04) + ')');
		foldGradient.addColorStop(0.9, 'rgba(0,0,0,' + Math.max((strength * 0.3), 0.08) + ')');
		foldGradient.addColorStop(1.0, 'rgba(0,0,0,' + Math.max((strength * 0.45), 0.12) + ')');

		context.fillStyle = foldGradient;



		context.strokeStyle = 'rgba(0,0,0,'+((strength*0.2) + 0.25) +')';
		context.lineWidth = 0.5;

		// Draw the folded piece of paper
		context.beginPath();
		context.moveTo(foldX, 0);
		context.lineTo(foldX, PAGE_HEIGHT);
		context.quadraticCurveTo(foldX, PAGE_HEIGHT + (verticalOutdent * 2), foldX - foldWidth, PAGE_HEIGHT + verticalOutdent);
		context.lineTo(foldDiagonalX, -verticalOutdent);
		context.quadraticCurveTo(foldX, -verticalOutdent * 2, foldX, 0);

		context.fill();
		context.stroke();


		context.restore();
	}

})();
