module.exports = function(grunt) {

  grunt.config.set('stylus', {
    css: {
      options: {
        "include css": true
      },
      files: {
        'build/styles.css' : ['src/css/*.styl']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
};