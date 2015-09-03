// Preload images
var imageRegionPairs = {
  region: {
    image : 'images/Region.png',
    geoGet: 'getRegionGeo',
    geoProp: 'region'
  },

  syria: {
    image: 'images/Syria.png',
    geoGet: 'getSyriaGeo',
    geoProp: 'syria'
  }
};

Util.preloadImage(imageRegionPairs.region.image);
Util.preloadImage(imageRegionPairs.syria.image);
Util.preloadImage('images/WorldReference.png');