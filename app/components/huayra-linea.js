import Ember from 'ember';


if (typeof links === 'undefined') {
    links = {};
    links.locales = {};
} else if (typeof links.locales === 'undefined') {
    links.locales = {};
}

// Spanish ===================================================
links.locales['es'] = {
    'MONTHS': ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    'MONTHS_SHORT': ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    'DAYS': ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    'DAYS_SHORT': ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    'ZOOM_IN': "Aumentar zoom",
    'ZOOM_OUT': "Disminuir zoom",
    'MOVE_LEFT': "Mover izquierda",
    'MOVE_RIGHT': "Mover derecha",
    'NEW': "Nuevo",
    'CREATE_NEW_EVENT': "Crear nuevo evento"
};

links.locales['es_ES'] = links.locales['es'];






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
                    'end': new Date(2012,9,19),
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
              height: "100%",
              //editable: true,   // enable dragging and editing events
              enableKeys: true,
              axisOnTop: false,
              autoResize: true,
              align: 'left',
              //showNavigation: true,
              //showButtonNew: true,
              locale: 'es'
            };

            // Instantiate our table object.
            timeline = new links.Timeline(document.getElementById('timeline'), options);

            // Draw our table with the data we created locally.
            timeline.draw(data);
            self.timeline = timeline;

            function onRangeChanged(properties) {
              //console.log(properties.start + ' ---- ' + properties.end);
            }

            links.events.addListener(self.timeline, 'rangechanged', onRangeChanged);

            window.onresize = function() {
              if (self.timeline !== undefined)
                self.timeline.redraw();
            };

            function onSelect() {
              var row = [];
              var sel = timeline.getSelection();
              if (sel.length) {
                if (sel[0].row != undefined) {
                  var row = sel[0].row;
                }
              }

              // row será el numero de item en la lista 'data'
              console.log(row);

              // luego de cambiar cosas, se puede llamar a:
              timeline.changeItem(row, {content: "hugo"})
              // donde 5 es el valor 'row', y lo demás con las propiedades que se quieren
              // re-definir.


            }

            links.events.addListener(self.timeline, 'select', onSelect);

            window.timeline = self.timeline;
            window.data = data;
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
    capture: function() {

      $("#saveInput").change(function(evt) {
        var nombre_archivo = $(this).val();

        html2canvas($('#timeline'), {
          onrendered: function(canvas) {
            var data = canvas.toDataURL()
            var base64Data = data.replace(/^data:image\/png;base64,/, "");

            require("fs").writeFile(nombre_archivo, base64Data, 'base64', function(err) {
              if (err) {
                alert("Error " + err);
              }

            });
          }
        });

        $(this).val('');
      });

      $("#saveInput").trigger('click');

    }
  }
});
