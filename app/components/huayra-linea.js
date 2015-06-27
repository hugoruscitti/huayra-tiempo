import Ember from 'ember';
var fs = require('fs');

var {$} = Ember;

if (typeof links === 'undefined') {
    links = {locales: {}};
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
  needs: 'edit',

  iniciar: function() {
        var timeline;
        var data = [];
        var self = this;

        var model = this.get('lineaModel');
        var datos = model.get('datos_json');

        if (datos) {
          data = JSON.parse(datos);

          for (var i=0; i<data.length; i++) {
            data[i].start = new Date(data[i].start);
          }
        } else {
          console.log("el archivo vacio");
        }


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
              locale: 'es',
            };

            timeline = new links.Timeline(document.getElementById('timeline'), options);

            timeline.draw(data);
            self.timeline = timeline;

            window.onresize = function() {
              if (self.timeline !== undefined) {
                self.timeline.redraw();
              }
            };

            var parent_handler = timeline.onMouseUp;
            var parent_handler_md = timeline.onMouseDown;


            timeline.onMouseDown = function(event) {
              timeline.setSelection([]);
              parent_handler_md.call(timeline, event);
            };


            timeline.onMouseUp = function(event) {
              parent_handler.call(timeline, event);
              var selection = timeline.getSelection();

              if (selection.length > 0) {
                var row;

                if (selection.length) {
                  if (selection[0].row !== undefined) {
                    row = selection[0].row;
                  }
                }

                if (row !== undefined) {
                  var item = timeline.getItem(row);
                  self.send('editarEvento', {row: row, item: item});
                }

              }
            };

            timeline.onDblClick = function(event) {
              var params = this.eventParams;
              var options = this.options;
              var dom = this.dom;

              event = event || window.event;

              // get mouse position
              params.mouseX = links.Timeline.getPageX(event);
              params.mouseY = links.Timeline.getPageY(event);
              var x = params.mouseX - links.Timeline.getAbsoluteLeft(dom.content);

              // create a new event at the current mouse position
              var xstart = this.screenToTime(x);
              if (options.snapEvents) {
                  this.step.snap(xstart);
              }

              self.send('crearEvento', xstart);

              /*
              this.addItem({
                  'start': xstart,
                  'content': "ASDASDASD",
                  'group': this.getGroupName(group)
              }, preventRender);
              */

              params.itemIndex = (this.items.length - 1);
              this.selectItem(params.itemIndex);

              this.applyAdd = true;

              this.trigger('add');

              if (this.applyAdd) {
                  this.render({animate: false});
                  this.selectItem(params.itemIndex);
              }
              else {
                  this.deleteItem(params.itemIndex);
              }

            };

            /*
            function onSelect() {
              var row = undefined;
              var sel = timeline.getSelection();
              console.log(sel);

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
            */


            //links.events.addListener(self.timeline, 'select', onSelect);

            this.set('timeline', self.timeline);
            window.data = data;
        }

        drawVisualization();

  }.on('didInsertElement'),

  focus: function() {
  },

  actions: {

    cambiarTitulo() {
      this.set('modal', Ember.View.views['titulo-form']);
      this.get('modal').toggleVisibility(this, {focus: true});
    },

    guardar() {
    },

    cancelar() {
    },

    crearEvento: function(fecha) {
      fecha = fecha || new Date();

      this.set('model', {fecha: fecha,
                         titulo: 'Evento',
                         edicion: false,
                         clases: [
                          {id: 1, text:"default"},
                          {id: 2, text:"naranja"},
                          {id: 3, text:"verde"},
                          {id: 4, text:"rojo"},
                         ]
                      });

      this.set('modal', Ember.View.views['evento-form']);
      this.get('modal').toggleVisibility(this, {focus: true});
    },
    editarEvento: function(data) {
      this.set('model', {fecha: data.item.start,
                         titulo: data.item.content,
                         row: data.row,
                         edicion: true,
                         clases: [
                            {id: 1, text:"default"},
                            {id: 2, text:"naranja"},
                            {id: 3, text:"verde"},
                            {id: 4, text:"rojo"},
                          ],
                          clase: {id: 1, text: data.item.className},
                        });

      this.set('modal', Ember.View.views['evento-form']);
      this.get('modal').toggleVisibility(this, {focus: true});
    },

    guardarEventoForm: function() {
      var model = this.get('model');
      var clase = "default";

      if (model.clase) {
        clase = model.clase.text;
      }

      if (model.edicion) {
        var row = model.row;

        var eventoModificado = {
          'start': new Date(model.fecha),
          'content': model.titulo,
          'className': clase,
          'editable': false,
        };

        this.get('timeline').changeItem(row, eventoModificado);

      } else {
        var nuevoEvento = {
          'start': new Date(model.fecha),
          'content': model.titulo,
          'className': clase,
          'editable': false,
        };

        this.get('timeline').addItem(nuevoEvento);
        this.get('timeline').setSelection([]);
      }

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
      $("#saveInput").change(function() {
        var nombre_archivo = $(this).val();

        html2canvas($('#timeline'), {
          onrendered: function(canvas) {
            var data = canvas.toDataURL();
            var base64Data = data.replace(/^data:image\/png;base64,/, "");

            fs.writeFile(nombre_archivo, base64Data, 'base64', function(err) {
              if (err) {
                if (err.path !== "") {
                  alert("Error " + err);
                }
              }

            });
          }
        });

        $(this).val('');
      });

      $("#saveInput").trigger('click');
    },

    guardarYRegresar: function() {
      var record = this.get('lineaModel');
      record.set('datos_json', JSON.stringify(this.timeline.data));
      record.save();
      this.sendAction('regresar');
    }
  }
});
