define([
  'jquery',
  'underscore',
  'backbone',
  'collections/entityConnections'
], function($, _, Backbone, EntityConnections){

	var EntityItem = Backbone.Model.extend({
		url : 'http://localhost:8081/entityitem',
		defaults: function (){
			return {
				id: -1,
				name: 'Default',
				connections: new EntityConnections(),

			};
		}
	});

	return EntityItem;
});