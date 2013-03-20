define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
	var EntityConnection = Backbone.Model.extend({
		url : 'http://localhost:8081/entityconnection',
		defaults: function (){
			return {
				id: -1,
				sourceId: 0,
				targetId: 0
			}
		}
	});

	return EntityConnection;
});