import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    crearNuevo() {
      var linea = this.store.createRecord('line', {
        autor: 'sin definir',
        titulo: "Sin título"
      });

      linea.save().then(() => {
        this.transitionToRoute('edit', linea);
      })
    }
  }
});
