import DS from 'ember-data';

export default DS.Model.extend({
  titulo: DS.attr(),
  datos_json: DS.attr(),
  autor: DS.attr()
});
