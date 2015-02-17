import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('linea');
  },
  actions: {
    borrar: function(registro) {
      registro.destroyRecord();
    }
  }
});
