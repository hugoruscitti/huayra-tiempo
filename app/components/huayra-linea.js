import Ember from 'ember';

export default Ember.Component.extend({
  timeline: null,

  iniciar: function() {
        var timeline;
        var data;
        var self = this;

        // Called when the page is loaded
        function drawVisualization() {
            // Create and populate a data table.
            data = [
                {
                    'start': new Date(2012,7,19),
                    'content': 'default'
                },
                {
                    'start': new Date(2012,7,23),
                    'content': 'green',
                    'className': 'green'
                },
                {
                    'start': new Date(2012,7,29),
                    'content': 'red',
                    'className': 'red'
                },
                {
                    'start': new Date(2012,7,27),
                    'end': new Date(2012,8,1),
                    'content': 'orange',
                    'className': 'orange'
                },
                {
                    'start': new Date(2012,8,2),
                    'content': 'magenta',
                    'className': 'magenta'
                }
            ];

            // specify options
            var options = {
              width: "100%",
              height: "400px",
              //editable: true,   // enable dragging and editing events
              enableKeys: true,
              axisOnTop: false,
              //showNavigation: true,
              //showButtonNew: true,
            };

            // Instantiate our table object.
            timeline = new links.Timeline(document.getElementById('timeline'), options);

            // Draw our table with the data we created locally.
            timeline.draw(data);
            self.timeline = timeline;

        }

        drawVisualization();

  }.on('didInsertElement'),

  actions: {
    zoomOut: function() {
      this.timeline.zoom(-0.5);
      this.timeline.trigger("rangechange");
      this.timeline.trigger("rangechanged");
    },
    zoomReset: function() {
      this.timeline.setVisibleChartRangeAuto();
    },
    zoomIn: function() {
      this.timeline.zoom(0.5);
      this.timeline.trigger("rangechange");
      this.timeline.trigger("rangechanged");
    },
  }
});
