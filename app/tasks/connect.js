module.exports = function(grunt) {

  grunt.config.set('connect', {
    dev: {
      options: {
        port: 8001,
        hostname: '*',
        base: ['build'],
        livereload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
};