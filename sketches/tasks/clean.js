module.exports = function(grunt) {

  grunt.config.set('clean', {
    build: {
      src: ["build"]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};