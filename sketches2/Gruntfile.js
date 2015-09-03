module.exports = function(grunt) {
  // Project configuration.


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    deps: [
      'bower_components/d3/d3.js',
      'bower_components/topojson/topojson.js',
      'bower_components/bluebird/js/browser/bluebird.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/tipsy/src/javascripts/jquery.tipsy.js'
    ],
    src: [
      'src/js/util.js',
      'src/js/map.js',
      'src/js/data.js',
      'src/js/init.js',
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
  // - build templates
  // - concatinate src files & deps files (separatly)
  // - copy data and html page
  // - build css
  grunt.registerTask('build',
    ['jshint', 'concat', 'copy', 'stylus']);

  // build production source
  // - same as build source, but with uglify instead of concat.
  grunt.registerTask('prod',
    ['jshint', 'uglify', 'copy', 'stylus']);

  grunt.registerTask('prodtest',
    ['prod', 'connect', 'watch']);

  grunt.registerTask('default', ['dev']);
};