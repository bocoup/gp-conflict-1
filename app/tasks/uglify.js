module.exports = function(grunt) {

  grunt.config.set('uglify', {
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
        'build/region.js' : ['src/js/region.js'],
        'build/settling.js' : ['src/js/settling.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};