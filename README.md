
# Page Flip 2
In short, this is an attempt to create a good booklet plugin that isn't dependent on JQuery (e.g. turn.js), and one that I actually want to use.

The plugin uses the code found at https://www.html5rocks.com/en/tutorials/casestudies/20things_pageflip/ as a starting point. The base code had a few bugs and didn't have an option for covers or for displaying both pages, so these were implemented.

Within the code, the user may play around with the variables. Please note that if you use the CENTER_COVER variable, then you will have to include Greensock's TweenLite and CSSPlugin as a dependency (see example-index.html to get the appropriate CDN script tags located in the head)

The user variables are as follows: 
- CENTER_COVER : triggers animations to center the booklet when the front or back cover is closed
- PAGE_CORNER_RADIUS : gives a border radius to the pages
- PAGE_WIDTH : the width of one of the pages
- PAGE_HEIGHT : the height of one of the pages
- CANVAS_PADDING : padding between the pages and the HTML canvas

Setup:
![Example Image](http://url/to/img.png)
