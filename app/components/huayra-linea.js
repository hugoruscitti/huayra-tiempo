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
        var data = [];
        var self = this;

        function drawVisualization() {
            var options = {
              width: "100%",
              height: "100%",
              enableKeys: true,
              axisOnTop: false,
              autoResize: true,
              align: 'left',
              zoomMin: 1000 * 60 * 60 * 24,
              showCurrentTime: false,
              locale: 'es'
            };

            timeline = new links.Timeline(document.getElementById('timeline'), options);

            timeline.draw(data);
            self.timeline = timeline;

            window.onresize = function() {
              if (self.timeline !== undefined)
                self.timeline.redraw();
            };

            function onSelect() {
              var row = undefined;
              var sel = timeline.getSelection();

              if (sel.length) {
                if (sel[0].row != undefined) {
                  var row = sel[0].row;
                }
              }

              if (row !== undefined) {
                var item = timeline.getItem(row);
                self.send('editarEvento', {row: row, item: item});
              }

            }

            links.events.addListener(self.timeline, 'select', onSelect);

            window.timeline = self.timeline;
            window.data = data;
        }

        drawVisualization();

  }.on('didInsertElement'),

  focus: function() {
  },

  actions: {

    crearEvento: function() {
      this.set('model', {fecha: '01/01/2012',
                         titulo: 'Evento',
                         edicion: false,
                         clases: [
                          {id: 1, text:"default"},
                          {id: 2, text:"naranja"},
                          {id: 3, text:"verde"},
                          {id: 4, text:"rojo"},
                         ]
                      });

      this.set('modal', Em.View.views['evento-form']);
      this.get('modal').toggleVisibility(this, {focus: true});
    },
    editarEvento: function(item) {
      alert(item);
    },
    guardarEventoForm: function(modal, event) {
      var model = this.get('model');
      var clase = "default";

      if (model.clase)
        clase = model.clase.text;

      var nuevoEvento = {
        'start': new Date(model.fecha),
        'content': model.titulo,
        'className': clase
      };

      timeline.addItem(nuevoEvento);
      this.send('zoomReset');
      this.send('zoomOut');
    },
    cancelarEventoForm: function() {
    },

    zoomOut: function() {
      this.timeline.zoom(-0.3);
      this.timeline.trigger("rangechange");
      this.timeline.trigger("rangechanged");
    },
    zoomReset: function() {
      this.timeline.setVisibleChartRangeAuto();
    },
    zoomIn: function() {
      this.timeline.zoom(0.3);
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
