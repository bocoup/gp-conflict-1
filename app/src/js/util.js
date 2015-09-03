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

/**
* d3, move node to front
*/
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};