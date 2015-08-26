module.exports = function(grunt) {

  grunt.config.set('uglify', {
    src: {
      files: {
        'build/app.js' : ['<%= src %>']
      }
    },
    deps: {
      files: {
        'build/deps.js' : ['<%= deps %>']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};