module.exports = function(grunt) {

  grunt.config.set('jst', {
    templates: {
      options: {
        processName: function(filepath) {
          // convert: "src/js/templates/tempname.html" to
          //          "tempname"
          var parts = filepath.split("/");
          return parts[parts.length-1].split(".")[0];
        }
      },
      files: {
        "tmp/templates.js" : ["src/templates/**/*.html"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jst');
};