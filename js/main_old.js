require(["jquery-1.9.1.min","underscore-min","backbone-min"], function(){
	self = this;
	$(function(){
	//Model Definitions 
		
		var EntityConnection = Backbone.Model.extend({
			url : 'http://localhost:8081/entityconnection',
			defaults: function (){
				return {
					id: -1,
					sourceId: 0,
					targetId: 0
				}
			}
		});

		var EntityConnections = Backbone.Collection.extend({
			url : 'http://localhost:8081/entityconnection',
			model: EntityConnection
		});

		var EntityItem = Backbone.Model.extend({
			url : 'http://localhost:8081/entityitem',
			defaults: function (){
				return {
					id: -1,
					name: 'Default',
					isSource: true,
					connections:new EntityConnections(),

				};
			}
		});

		//Single model to pull entities
		var Entities = Backbone.Collection.extend({
			url : 'http://localhost:8081/entityitem',
			model: EntityItem,
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

		/*var SourceEntities = Backbone.Collection.extend({
			model: EntityItem
		});

		var TargetEntities = Backbone.Collection.extend({
			model: EntityItem
		});

		var _sourceEntities = new SourceEntities();
		var _targetEntities = new TargetEntities();
		*/
		var _allEntities = new Entities();
		

		//<!-- Views -->
		var EntityView = Backbone.View.extend({
			model: new EntityItem(),
			tagName: 'div class="grid_6 alpha"',
			initialize: function(){
				_.templateSettings.variable = "rc";
				this.template = _.template($('#entity-template').html());
			},
			render: function(){
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			}
		});

		var SourceEntityView = Backbone.View.extend({
			model:_allEntities,
			el:$('#sourceentdiv1'), // Target Element to append the view to
			initialize: function(){
				this.model.on('add', this.render, this);
			}, 
			render: function(){
				var self = this;
				self.$el.html('');
				// Add Header Divs
				self.$el.append('<div id="sourceHeader_ID" class="grid_3 alpha">ID</div><div id="sourceHeader_Name"  class="grid_3 omega">Name</div>');
				//var data = this.model.SourceEntities();
				//console.log(data);
				_.each(this.model.SourceEntities(), function (entity, i){
					self.$el.append((new EntityView({model: entity})).render().$el);
				})
				return this;
			}
		});

		var TargetEntityView = Backbone.View.extend({
			model: _allEntities,
			//collection: Backbone.Collection.extend(),
			el:$('#targetentdiv1'), // Target Element to append the view to
			initialize: function(){
				this.model.on('add', this.render, this);
			}, 
			render: function(){
				var self = this;
				self.$el.html('');
				// Add Header Divs
				self.$el.append('<div id="targetHeader_ID" class="grid_3 alpha">ID</div><div id="targetHeader_Name"  class="grid_3 omega">Name</div>');
		
				_.each(this.model.TargetEntities(), function (entity, i){
					self.$el.append((new EntityView({model: entity})).render().$el);
				})
				return this;
			}
		});


		var _sourceView = new SourceEntityView();
		var _targetView = new TargetEntityView();
		
		var anEnt = new EntityItem({id: 1 ,name:"Test1",isSource:true});
		//console.log("Creating new anEnt:",anEnt);
		
		//var _entityTestView = new EntityView(anEnt);
		//$('#sourceentdiv1').append(_entityTestView.render().$el)
		//console.log();
		function renderSourceTargetViews(model,sV,tV)
		{
			console.log("renderSourceTargetViews");
			//sV.render(model.SourceEntities());
			tV.render(model.TargetEntities());
		}

		_allEntities.fetch({
			success:function(entities){
				_allEntities.add(anEnt);
				_allEntities.add({id:2,name:"Test2",isSource:false});
				console.log('Success!');
			}
		});
		
	});
	
});