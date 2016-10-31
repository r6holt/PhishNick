/*
Position designates where the main login section is
0: center
1: left sidebar showing, main section slid right
-1: right sidebar showing, main section slid left
*/

var position = 0;
var bodyFastButton = null;
(function() {
  /** 
   * From: http://code.this.com/mobile/articles/fast_buttons.html
   * Also see: http://stackoverflow.com/questions/6300136/trying-to-implement-googles-fast-button 
   */
   
  /** For IE8 and earlier compatibility: https://developer.mozilla.org/en/DOM/element.addEventListener */
  function addListener(el, type, listener, useCapture) {
      el.addEventListener(type, listener, useCapture);
      return { 
        destroy: function() { el.removeEventListener(type, listener, useCapture); } 
      };
    
  }
  
  var isTouch = "ontouchstart" in window;

  /* Construct the FastButton with a reference to the element and click handler. */
  this.FastButton = function(element, handler, useCapture) {
    // collect functions to call to cleanup events 
    this.events = [];
    this.touchEvents = [];
    this.element = element;
    this.handler = handler;
    this.useCapture = useCapture;
    if (isTouch) 
      this.events.push(addListener(element, 'touchstart', this, this.useCapture));    
    this.events.push(addListener(element, 'click', this, this.useCapture));
  };
  
  /* Remove event handling when no longer needed for this button */
  this.FastButton.prototype.destroy = function() {
    for (i = this.events.length - 1; i >= 0; i -= 1)
      this.events[i].destroy();    
    this.events = this.touchEvents = this.element = this.handler = this.fastButton = null;
  };
  
  /* acts as an event dispatcher */
  this.FastButton.prototype.handleEvent = function(event) {
    switch (event.type) {
      case 'touchstart': this.onTouchStart(event); break;
      case 'touchmove': this.onTouchMove(event); break;
      case 'touchend': this.onClick(event); break;
      case 'click': this.onClick(event); break;
    }
  };
  
  /* Save a reference to the touchstart coordinate and start listening to touchmove and
   touchend events. Calling stopPropagation guarantees that other behaviors don’t get a
   chance to handle the same click event. This is executed at the beginning of touch. */
  this.FastButton.prototype.onTouchStart = function(event) {
    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true);
    this.touchEvents.push(addListener(this.element, 'touchend', this, this.useCapture));
    this.touchEvents.push(addListener(document.body, 'touchmove', this, this.useCapture));
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  };
  
  /* When /if touchmove event is invoked, check if the user has dragged past the threshold of 10px. */
  this.FastButton.prototype.onTouchMove = function(event) {
    if (Math.abs(event.touches[0].clientX - this.startX) > 10 || Math.abs(event.touches[0].clientY - this.startY) > 10) {
      this.reset(); //if he did, then cancel the touch event
    }
  };
  
  /* Invoke the actual click handler and prevent ghost clicks if this was a touchend event. */
  this.FastButton.prototype.onClick = function(event) {
    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true);
    event.preventDefault();
    this.reset();
    // Use .call to call the method so that we have the correct "this": https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/call
    var result = this.handler.call(this.element, event);
        
    return result;
  };
  
  this.FastButton.prototype.reset = function() {
    for (i = this.touchEvents.length - 1; i >= 0; i -= 1) 
      this.touchEvents[i].destroy();    
    this.touchEvents = [];
  };
  
  })(this);

new FastButton(document.getElementById("leftSidebarOpen"), function(){

	if (position == 0){
		openSidebar();
	}
	else{
		closeSidebar();
	}
});


function closeSidebar(){
	document.getElementById("bodyContainer").className = "";
	position = 0;
	if (self.bodyFastButton != null){
		self.bodyFastButton.destroy();
	}
		
}

function openSidebar(){
	document.getElementById("bodyContainer").className = "slideRight";
	position = 1;
	this.bodyFastButton = new FastButton(document.getElementById("bodyContainer"), function(){
		closeSidebar();
	});
}