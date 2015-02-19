import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('linea', params.id);
  },

  actions: {
    cambiarTitulo: function() {
      this.set('modal', Em.View.views['titulo-form']);
      this.get('modal').toggleVisibility(this, {focus: true});
    },
    guardar: function(modal, event) {
    },
    cancelar: function() {
    },

  },

  focus: function() {
  }

});
