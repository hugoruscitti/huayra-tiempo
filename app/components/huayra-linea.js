import Ember from 'ember';

export default Ember.Component.extend({
  iniciar: function() {
        var timeline;
        var data;

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
                //'editable': true
            };

            // Instantiate our table object.
            timeline = new links.Timeline(document.getElementById('timeline'), options);

            // Draw our table with the data we created locally.
            timeline.draw(data);
        }

        drawVisualization();


  }.on('didInsertElement')
});
