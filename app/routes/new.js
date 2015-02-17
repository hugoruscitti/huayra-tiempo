import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var titulo = prompt("¿Cual sera el titulo de la linea de tiempo?");

    if (titulo === null)
      return this.transitionTo('index');

    if (!titulo)
      titulo = "Sin título";

    var linea = this.store.createRecord('linea', {
      autor: 'yo',
      titulo: titulo,
    });

    linea.save();
    this.transitionTo('edit', linea);

    return linea;
  }
});
