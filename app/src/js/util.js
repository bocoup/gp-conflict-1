(function() {


    window.Util = {
    /**
    * Preloads images
    */
    preloadImage: function(url) {
      var img = new Image();
      img.src = url;
    },

    /**
    * returns a 0 for a given value if it is NaN, otherwise
    * returns the number.
    * @param n number
    * @returns number
    */
    zeroIfNan: function(n) {
      return isNaN(n) ? 0 : +n;
    },

    tipsyIt : function(fn) {
      return function(d) {
        $(this).tipsy({
          html: true,
          gravity: 'e',
          title: function() { return fn(d); }
        });
      };
    }
  };

  var callbacks = [];

  /**
  * Adds a callback to be executed as part of a group
  * @param callback Function
  * @param context object to execute the callback in teh context of
  * @param args Array with potential arguments to pass to the callback
  */
  Util.addOnInViewCallback = function(callback, context, args) {
    callbacks.push([callback, context, args]);
  };

  /**
  * Calls all avaiable callbacks
  */
  Util.callInViewCallbacks = function() {
    callbacks.forEach(function(tripple) {
      tripple[0].call(tripple[1], tripple[2]);
    });
  };

  /**
  * d3, move node to front
  */
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
  };
}());