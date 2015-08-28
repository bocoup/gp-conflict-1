module.exports = function(grunt) {

  grunt.config.set('copy', {
    data: {
      expand: true,
      cwd: "src/data/",
      src: ["*.json", "*.geojson"],
      dest: "build/data"
    },
    html: {
      expand: true,
      cwd: "src/pages",
      src: ["index.html"],
      dest: "build"
    },
    images: {
      expand: true,
      cwd: "bower_components/mapbox.js/images",
      src: ["*"],
      dest: "build/images"
    },
    screenshots: {
      expand: true,
      cwd: "../screenshots",
      src: ["*"],
      dest: "build/screenshots"
    },
    fonts: {
      expand: true,
      cwd: "src/css/fonts",
      src: ["*.otf"],
      dest: "build/fonts"
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
};