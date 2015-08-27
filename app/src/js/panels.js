(function() {
  var panels = [
    {
      template : "panel1",
      center: "Syria",
      nextCaption : "Who's responding? &raquo;",
      enter: Promise.method(function() {

      }),
      exit: Promise.method(function() {

      }),
    },
    {
      template : "panel2",
      center: "SyriaRegion",
      nextCaption: "Who is most affected? &raquo;",
      enter: Promise.method(function() {

      }),

      exit: Promise.method(function() {

      }),
    },
    {
      template : "panel3",
      center: "Europe",
      nextCaption: "Global impact &raquo;",
      enter: Promise.method(function() {

      }),

      exit: Promise.method(function() {

      }),
    },
    {
      template : "panel4",
      center: "US",
      nextCaption: "Start over &raquo;",
      enter: Promise.method(function() {

      }),

      exit: Promise.method(function() {

      }),
    },
  ];

  var P = window.PanelManager = function(mapWrapper, data) {
    var self = this;

    this.data = data;
    this.mapWrapper = mapWrapper;
    this.map = this.mapWrapper.map;

    this.callout = $('.callout');
    this.content = this.callout.find('.content');
    this.control = this.callout.find('.controls a');

    this.currentPanel = 0;

    this.control.click(function() {
      if (++self.currentPanel >= panels.length) {
        self.currentPanel = 0;
      }

      self.goTo(self.currentPanel);
    });
  };

  P.prototype.goTo = function(idx) {
    var self = this;

    if (idx >= panels.length) {
      throw new Error("panel " + idx + " doesn't exist." );
    }

    // stop current panel
    var exitPanel = panels[this.currentPanel].exit();

    // enter new panel
    exitPanel.then(function() {

      var panel = panels[idx];

      // pan map
      this.mapWrapper.zoomTo(panel.center);

      // update callout content
      self.content.html(JST[panel.template]());

      // update callout control text
      self.control.html(panel.nextCaption);

      return panel.enter();
    });


  };


}());