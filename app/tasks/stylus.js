module.exports = function(grunt) {

  grunt.config.set('stylus', {
    css: {
      files: {
        'build/styles.css' : ['src/css/*']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
};