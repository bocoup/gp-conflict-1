module.exports = function(grunt) {

  grunt.config.set('clean', {
    build: {
      src: ["build"]
    },
    tmp: {
      src: ["tmp"]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};