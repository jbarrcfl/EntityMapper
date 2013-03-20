define([
  'jquery',
  'underscore',
  'backbone',
  'collections/entitySystemDropdown',
  'text!templates/dropdown.html'
], function($, _, Backbone, esCollection, dropdownTemplate){

	var EntitySystemDropdown = Backbone.View.extend({
			collection: esCollection,
			el: '',
			initialize: function(){
				_.templateSettings.variable = "rc";
				this.template = _.template(dropdownTemplate);
				this.collection = new esCollection();
				var self = this;

				this.collection.fetch({
					success: function(){
						console.log("Success Fetch System");
						self.collection.add({id:-1,value:'Select One'});
						self.render();
					}
				});
			},
			render: function(){
				var self = this;
				_.each(self.collection.models, function(entity, i){
					self.$el.append(self.template(entity.toJSON()));
				});

				return this;
			}
		});
	return EntitySystemDropdown;
});