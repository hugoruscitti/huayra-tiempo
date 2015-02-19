import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var titulo = "Sin título";

    var linea = this.store.createRecord('linea', {
      autor: 'sin definir',
      titulo: titulo,
    });

    linea.save();
    this.transitionTo('edit', linea);

    return linea;
  }
});
