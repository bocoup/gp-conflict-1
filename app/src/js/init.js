// Preload images
window.imageRegionPairs = {
  region: {
    image : 'images/Region.png',
    geoGet: 'getRegionGeo',
    geoProp: 'region'
  },

  syria: {
    image: 'images/Syria.png',
    geoGet: 'getSyriaGeo',
    geoProp: 'syria'
  },

  settling: {
    image : 'images/Region.png',
    geoGet: 'getRegionGeo',
    geoProp: 'region'
  },

  worldRef: {
    image: 'images/WorldReference.png'
  }
};

Util.preloadImage(imageRegionPairs.region.image);
Util.preloadImage(imageRegionPairs.syria.image);
Util.preloadImage(imageRegionPairs.worldRef.image);