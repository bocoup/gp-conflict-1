module.exports = function(grunt) {

  grunt.config.set('copy', {
    data: {
      expand: true,
      cwd: "src/data/",
      src: ["*.json"],
      dest: "build/data"
    },
    html: {
      expand: true,
      cwd: "src/pages",
      src: ["index.html"],
      dest: "build"
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};