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
		el: '#target',
		initialize: function(){
			_.bindAll(this,'render');
			this.render();
		},
		//sourceView : new SourceEntityView(),
		render: function(){
			
			var self = this;
			self.$el.html(''); // Clear source view 
			self.$el.append(targetUITemplate);
			
			// render systemdd
			this.sysDD = new EntitySystemDropdown({el:'#targetSystem'});
			//this.sysDD.render();
			// render EntityType Dropdown
			this.etDD = new EntityTypeDropdown({el:'#targetEntityType'});
			//this.etDD.render();

			this.targetView = new TargetEntityView();
			self.targetView.render();
		},
		events: {
      		'click #retTargetButton': 'searchEntities'
    	},
    	searchEntities: function(){
    		console.log("TargetUIView, searchEntities");
    		this.targetView.searchEntities();
    	}

	});

	return TargetUIView;
});