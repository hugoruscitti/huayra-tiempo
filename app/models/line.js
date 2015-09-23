import DS from 'ember-data';

export default DS.Model.extend({
  titulo: DS.attr('string'),
  datosJson: DS.attr('string'),
  autor: DS.attr('string')
});
