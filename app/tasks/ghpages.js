module.exports = function(grunt) {

  grunt.config.set('gh-pages', {
    options: {
      base: 'build'
    },
    main: {
      src: ['**']
    }
  });

  grunt.loadNpmTasks('grunt-gh-pages');
};

