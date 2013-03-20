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
		el: '#source',
		initialize: function(){
			_.bindAll(this,'render');
			this.render();
		},
		//sourceView : new SourceEntityView(),
		render: function(){
			
			var self = this;
			self.$el.html(''); // Clear source view 
			self.$el.append(sourceUITemplate);
			
			// render systemdd
			this.sysDD = new EntitySystemDropdown({el:'#sourceSystem'});
			//this.sysDD.render();
			// render EntityType Dropdown
			this.etDD = new EntityTypeDropdown({el:'#sourceEntityType'});
			//this.etDD.render();

			this.sourceView = new SourceEntityView();
			self.sourceView.render();
		},
		events: {
      		'click .source-search': 'searchEntities'
    	},
    	searchEntities: function(){
    		console.log("SourceUIView, searchEntities");
    		this.sourceView.searchEntities();
    	}

	});

	return SourceUIView;
});