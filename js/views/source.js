define([
  'jquery',
  'underscore',
  'backbone',
  'views/sourceEntities',
  'text!templates/sourceUI.html',
  'views/entityTypeDropdown',
  'views/entitySystemDropdown'
], function($, _, Backbone, SourceEntityView, sourceUITemplate,EntityTypeDropdown,EntitySystemDropdown) {

	var SourceUIView = Backbone.View.extend({
		tagName:'div',
		template: _.template(sourceUITemplate),
		initialize: function(){
			this.sourceEntityView = new SourceEntityView();
			this.sysDD            = new EntitySystemDropdown();
			this.etDD             = new EntityTypeDropdown();
		},
		render: function(){

			this.$el.html(''); // Clear source view 
			this.$el.html(this.template());

			this.$el.append(this.sourceEntityView.render().el);

			// render systemdd
			this.$el.find('#sourceSystem').append(this.sysDD.render().el);
			// render EntityType Dropdown
			this.$el.find('#sourceEntityType').append(this.etDD.render().el);
			return this;
		},
		events: {
      		'click .source-search': 'searchEntities'
    	},
    	createConnections:function(){
    		this.sourceEntityView.createConnections();
    	},
    	searchEntities: function(){
    		console.log("SourceUIView, searchEntities");
    		this.sourceEntityView.searchEntities();
    		this.trigger('searchEntities');
    	}

	});

	return SourceUIView;
});