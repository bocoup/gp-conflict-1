module.exports = function(grunt) {
  // Project configuration.

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    deps: [
      'bower_components/d3/d3.js',
      'bower_components/topojson/topojson.js',
      'bower_components/d3-geo-projection/d3.geo.projection.js',
      'bower_components/bluebird/js/browser/bluebird.js'
    ],
    src: [
      'src/js/util.js',
      'src/js/data.js',
      'src/js/app.js',
    ]
  });

  // Load Grunt plugins.
  grunt.loadTasks('tasks');

  // dev task:
  // - start local server
  // - build source
  // - start local server
  // - watch files for changes
  grunt.registerTask('dev',
    ['clean', 'build', 'connect', 'watch']);

  // build source:
  // - check source linting
  // - concatinate src files & deps files (separatly)
  // - copy data and html page
  // - build css
  grunt.registerTask('build',
    ['jshint', 'concat', 'copy', 'stylus']);

  // build production source
  // - same as build source, but with uglify instead of concat.
  grunt.registerTask('prod',
    ['jshint', 'uglify', 'copy', 'stylus']);

  grunt.registerTask('default', ['dev']);
};