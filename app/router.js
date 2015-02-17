import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('gallery');
  this.route('new');
  this.route('edit', {path: '/edit/:id'});
});

export default Router;
