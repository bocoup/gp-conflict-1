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
      src: ["*.html"],
      dest: "build"
    },
    images: {
      expand: true,
      cwd: "src/images",
      src: ["*"],
      dest: "build/images"
    },
    fonts: {
      expand: true,
      cwd: "src/css/fonts",
      src: ["*"],
      dest: "build/fonts"
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};