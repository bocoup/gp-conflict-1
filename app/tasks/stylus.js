module.exports = function(grunt) {

  grunt.config.set('stylus', {
    options: {
      "include css": true
    },
    css: {
      files: {
        'build/styles.css' : ['nib', 'src/css/styles.styl']
      },
    },
    individual: {
      files: {
        'build/syria.css' : ['src/css/syria.styl'],
        'build/region.css' : ['src/css/region.styl'],
        'build/settling.css' : ['src/css/settling.styl']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
};