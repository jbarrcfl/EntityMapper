define([
  'jquery',
  'underscore',
  'backbone',
  'models/entityItem',
], function($, _, Backbone, EntityItem){
	var Entities = Backbone.Collection.extend({
			url : function(){ 
				console.log('Entities url',JSON.stringify(this.query['query'])); 
				return this.query['query'] === undefined ? 'http://localhost:8081/entityitem':'http://localhost:8081/entityitem?query='+JSON.stringify(this.query['query']); },
			model: EntityItem,
			query: {},
			SourceEntities: function(){
				return this.filter(function(ent){
					return ent.get('isSource') == true;
				});
			},
			TargetEntities: function(){
				return this.filter(function(ent){
					return ent.get('isSource') != true;
				});
			}
		});
	return Entities;
});