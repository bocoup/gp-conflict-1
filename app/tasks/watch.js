module.exports = function(grunt) {

  grunt.config.set('watch', {
    options: {
      livereload: true
    },
    src: {
      files: ['src/js/*.js'],
      tasks: ['jshint:src', 'concat:src', 'concat:individual']
    },
    build: {
      files: ['tasks/*.js', 'Gruntfile.js'],
      tasks: ['jshint:build']
    },
    css : {
      files : ['src/css/*'],
      tasks: ['stylus']
    },
    data : {
      files: ['src/data/*.json'],
      tasks: ['copy:data']
    },
    html: {
      files: ['src/pages/*.html'],
      tasks: ['copy:html']
    },
    images: {
      files: ['src/images/*'],
      tasks: ['copy:images']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};