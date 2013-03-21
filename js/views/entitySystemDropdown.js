define([
  'jquery',
  'underscore',
  'backbone',
  'collections/entitySystemDropdown',
  'text!templates/dropdown.html'
], function($, _, Backbone, esCollection, dropdownTemplate){

	var EntitySystemDropdown = Backbone.View.extend({
			
			tagName: 'select',
			model: esCollection,
			template :_.template(dropdownTemplate),
			initialize: function(){

				this.model = new esCollection();
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
	return EntitySystemDropdown;
});