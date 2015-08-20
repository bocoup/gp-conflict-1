window.Data = {

  getCountryStats: function() {

    var statsdata = {};

    var def = Promise.defer();

    // load stats data
    d3.json('data/stats.json', function(error, stats) {

      if (error) {
        def.reject(error);
      }

      var max = 0;
      var min = 0;
      // transform stats into a hashmap.
      stats.forEach(function(country) {
        var s = statsdata[country.Destination] = {
          '2011' : Util.zeroIfNan(country['2011']),
          '2012' : Util.zeroIfNan(country['2012']),
          '2013' : Util.zeroIfNan(country['2013']),
          '2014' : Util.zeroIfNan(country['2014'])
        };

        s['Total'] = s['2011'] + s['2012'] + s['2013'] + s['2014'];

        // update max
        max = Math.max(s['2011'], s['2012'], s['2013'], s['2014'], max);
        // max = Math.max(s[year], max);
      });

      def.resolve({
        data: statsdata,
        data_max: max,
        data_min: min
      });
    });

    return def.promise;
  },

  getMapFeatures: function() {
    var countrydata;

    var def = Promise.defer();

    // load map shape file
    d3.json('data/world_map_topojson.json', function(error, topology) {

      if (error) {
        def.reject(error);
      }
      // cache geodata
      countrydata = topojson.feature(topology, topology.objects.countries)
        .features;

      def.resolve(countrydata);
    });

    return def.promise;
  }
};