var path = window.path || null;

Map.makeRaster('#map',
    imageRegionPairs.syria.image,
    imageRegionPairs.syria.geoProp,
    imageRegionPairs.syria.geoGet)
  .then(Map.makeRegions)
  .then(Map.makeLabels)
  .then(Map.makeCities);