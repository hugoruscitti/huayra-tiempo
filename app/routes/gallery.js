import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.find('line');
  },

  actions: {
    borrar(model) {
      this.store.deleteRecord(model);
    }
  }
});
