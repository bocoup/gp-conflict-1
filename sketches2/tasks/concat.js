module.exports = function(grunt) {

  grunt.config.set('concat', {
    deps: {
      files: {
        'build/deps.js' : ['<%= deps %>']
      }
    },
    src: {
      files: {
        'build/app.js' : ['<%= src %>']
      }
    },
    individual: {
      files: {
        'build/syria.js' : ['src/js/syria.js'],
        'build/region.js' : ['src/js/region.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};