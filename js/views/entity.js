define([
  'jquery',
  'underscore',
  'backbone',
  'models/entityItem',
  'text!templates/entity.html'
], function($, _, Backbone, EntityItem, entityTemplate){

	var EntityView = Backbone.View.extend({
			model: new EntityItem(),
			tagName: 'div class="grid_6 alpha"',
			events: {
				'connectionMade':'addConnection'
			},
			addConnection: function(inform){
				console.log('addConnection EntityView',inform);
			},
			connMade: function(e,info){
				if(info.connection.scope !== "database")
				{
					//console.log('Connection Made:',this,e,info);
					var connToMake = info.source.attr('data-jsplumbid') == this.model.id ? info.target.attr('data-jsplumbid'):info.source.attr('data-jsplumbid');
					//console.log('connToMake:',connToMake);
					this.model.attributes.connections.push(connToMake);
					var xhr = this.model.save({} , {
				    	error: function(model, response) {
				        console.log(xhr);   
				        }         
				    });
					//this.trigger('connectionMade',info);
				}
				else
				{ //console.log('loaded database connection');
				}
			},
			initialize: function(){

				_.bindAll(this,'connMade');

				_.templateSettings.variable = "rc";
				this.template = _.template(entityTemplate);
				this.$el.on('epConnected',this.connMade);
			},
			render: function(){
				//console.log('EntityView, Render:',this.model);
				this.$el.html(this.template(this.model.toJSON()));
				//this.$el.bind('epConnected',this.connMade,this);
				return this; 
			}
		});
	return EntityView;
});