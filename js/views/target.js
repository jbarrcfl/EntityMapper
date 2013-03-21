define([
  'jquery',
  'underscore',
  'backbone',
  'views/targetEntities',
  'text!templates/targetUI.html',
  'views/entityTypeDropdown',
  'views/entitySystemDropdown'
], function($, _, Backbone, TargetEntityView, targetUITemplate,EntityTypeDropdown,EntitySystemDropdown) {

	var TargetUIView = Backbone.View.extend({
		tagName:'div',
		template: _.template(targetUITemplate),
		initialize: function(){
			this.targetEntityView = new TargetEntityView();
			this.sysDD            = new EntitySystemDropdown();
			this.etDD             = new EntityTypeDropdown();
		},
		render: function(){

			this.$el.html(''); // Clear source view 
			this.$el.html(this.template());
			
			this.$el.append(this.targetEntityView.render().el);
			
			// render systemdd
			this.$el.find('#targetSystem').append(this.sysDD.render().el);
			// render EntityType Dropdown
			this.$el.find('#targetEntityType').append(this.etDD.render().el);
			return this;
		},
		events: {
      		'click .target-search': 'searchEntities'
    	},
    	searchEntities: function(){
    		console.log("TargetUIView, searchEntities");
    		this.targetEntityView.searchEntities();
    		//$(this.el).trigger('searchEntities');
    	}

	});

	return TargetUIView;
});