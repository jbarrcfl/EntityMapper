define([
  'jquery',
  'underscore',
  'backbone',
  'collections/entityTypeDropdown',
  'text!templates/dropdown.html'
], function($, _, Backbone, etCollection, dropdownTemplate){

	var EntityTypeDropdown = Backbone.View.extend({
			
			tagName: 'select',
			model: etCollection,
			template :_.template(dropdownTemplate),
			initialize: function(){
				
				this.model = new etCollection();
				var self = this;
				
				this.model.fetch({
					success: function(){
						console.log("Success Fetch System");
						self.model.add({id:-1,value:'Select One'});
						self.render();
					}
				});
			},
			render: function(){
				var self = this;
				_.each(self.model.toArray(), function(entity, i){
					//console.log(entity.toJSON());
					var aVal = self.template(entity.toJSON());
					self.$el.append(aVal);
				});

				return this;
			}
		});
	return EntityTypeDropdown;
});