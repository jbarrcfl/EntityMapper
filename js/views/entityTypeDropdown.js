define([
  'jquery',
  'underscore',
  'backbone',
  'collections/entityTypeDropdown',
  'text!templates/dropdown.html'
], function($, _, Backbone, etCollection, dropdownTemplate){

	var EntityTypeDropdown = Backbone.View.extend({
			collection: etCollection,
			el: '',
			initialize: function(){
				_.templateSettings.variable = "rc";
				this.template = _.template(dropdownTemplate);
				
				this.collection = new etCollection();

				var self = this;
				this.collection.fetch({
					success: function(){
						console.log("Success Fetch Entity Types");
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
	return EntityTypeDropdown;
});