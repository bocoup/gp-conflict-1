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
      var min = Infinity;
      var ratemax = 0;
      var ratemin = Infinity;
      // transform stats into a hashmap.
      stats.forEach(function(country) {
        var s = statsdata[country.Destination] = {
          'Refugees_2011' : Util.zeroIfNan(country['2011_ref']),
          'Refugees_2012' : Util.zeroIfNan(country['2012_ref']),
          'Refugees_2013' : Util.zeroIfNan(country['2013_ref']),
          'Refugees_2014' : Util.zeroIfNan(country['2014_ref']),
          'Population': Util.zeroIfNan(country['2014_pop']),
          'Population_2011': Util.zeroIfNan(country['2011_pop']),
          'Population_2012': Util.zeroIfNan(country['2012_pop']),
          'Population_2013': Util.zeroIfNan(country['2013_pop']),
          'Population_2014': Util.zeroIfNan(country['2014_pop']),
          'Total': Util.zeroIfNan(country['total']),
          'Rate': Util.zeroIfNan(country['rate_avg']),
        };

        // update max & min & ratemax & ratemin
        max = Math.max(s['Refugees_2011'], s['Refugees_2012'],
          s['Refugees_2013'], s['Refugees_2014'], max);
        min = Math.min(s['Refugees_2011'], s['Refugees_2012'],
          s['Refugees_2013'], s['Refugees_2014'], min);
        ratemax = Math.max(s['Rate'], ratemax);
        ratemin = Math.min(s['Rate'], ratemin);

      });

      def.resolve({
        data: statsdata,
        data_max: max,
        data_min: min,
        rate_max: ratemax,
        rate_min: ratemin
      });
    });

    return def.promise;
  },

  getCountryCentroidFeatures: function() {
    var countrydata;

    var def = Promise.defer();

    // load map shape file
    d3.json('data/countries_centroids.geojson', function(error, centroids) {

      if (error) {
        def.reject(error);
      }

      def.resolve(centroids);
    });

    return def.promise;
  }
};