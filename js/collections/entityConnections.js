define([
  'jquery',
  'underscore',
  'backbone',
  'models/entityConnection'
], function($, _, Backbone,EntityConnection){
	
	var EntityConnections = Backbone.Collection.extend({
		url : 'http://localhost:8081/entityconnection',
		model: EntityConnection
	});

	return EntityConnections;
});