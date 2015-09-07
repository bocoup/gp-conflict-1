var path = window.path || null;

var bindInView = function(args) {
  $('body').on('inview', function(e) {
    Util.callInViewCallbacks();
  });
};


Map.makeRaster('#map',
    imageRegionPairs.syria.image,
    imageRegionPairs.syria.geoProp,
    imageRegionPairs.syria.geoGet)
  .then(Map.makeRegions)
  .then(Map.makeLabels)
  .then(Map.makeCities)
  .then(bindInView);