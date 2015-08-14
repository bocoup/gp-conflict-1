module.exports = function(grunt) {

  grunt.config.set('jshint', {
    build: {
      options: {
        jshintrc: '.jshintrc',
      },
      src: ['Gruntfile.js', 'tasks/**/*.js'],
    },
    src: {
      options: {
        jshintrc: 'src/js/.jshintrc',
      },
      src: ['src/js/*.js'],
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

};