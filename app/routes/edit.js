import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('linea', params.id);
  },

  actions: {
    regresar: function() {
      this.transitionTo('index');
    }
  }

});
