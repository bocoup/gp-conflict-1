module.exports = function(grunt) {

  grunt.config.set('stylus', {
    options: {
      "include css": true,
      "compress" :false
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
        'build/settling.css' : ['src/css/settling.styl'],
        'build/burden.css': ['src/css/burden.styl'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
};