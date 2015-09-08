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

  turkey: {
    image : 'images/Turkey.png',
    geoGet: 'getTurkeyGeo',
    geoProp: 'turkey'
  },

  lebanon: {
    image : 'images/Lebanon.png',
    geoGet: 'getLebanonGeo',
    geoProp: 'lebanon'
  },

  germany: {
    image : 'images/Germany.png',
    geoGet: 'getGermanyGeo',
    geoProp: 'germany'
  },

  worldRef: {
    image: 'images/WorldReference.png'
  }
};

Util.preloadImage(imageRegionPairs.region.image);
Util.preloadImage(imageRegionPairs.syria.image);
Util.preloadImage(imageRegionPairs.worldRef.image);
// Util.preloadImage(imageRegionPairs.turkey.image);
// Util.preloadImage(imageRegionPairs.lebanon.image);