module.exports = function(grunt) {

  grunt.config.set('stylus', {
    options: {
      "include css": true
    },
    css: {
      files: {
        'build/styles.css' : ['src/css/styles.styl']
      },
    },
    individual: {
      files: {
        'build/syria.css' : ['src/css/syria.styl'],
        'build/region.css' : ['src/css/region.styl']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
};