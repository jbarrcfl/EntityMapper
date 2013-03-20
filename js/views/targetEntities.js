define([
  'jquery',
  'underscore',
  'backbone', 
  'collections/targetEntities',
  'views/entity',
  'jqJSON',
  'jqueryui',
  'jsplumb',
  'utils/plumbJSInit',
  'select2'
], function($, _, Backbone, _targetEntities,EntityView,jqJSON,jqueryui,_jsPlumb,plumbJSInit,select2){

	var TargetEntityView = Backbone.View.extend({
			model: _targetEntities,
			el:'#targetentdiv1', // Target Element to append the view to
			initialize: function(){

				this.model.on('add', this.render, this);
				this.model.bind('sort',this.render,this);
			},
			events: {
				'click .sortButton':'changeSort'
			},
			render: function(){
				
				$('#targetSearchField').select2({
			    placeholder: "...Search ...Filter",   //Broken in select2 3.3.1 ??Fixed?
			    allowClear: true,
			    width: "element",
			    multiple:true,
			    data: {results:[]},
				});	

				
				// Reset jsPlumb EndPoints when rendering... old dom elements are gone
				jsPlumb.detachEveryConnection();
				var epToDelete = jsPlumb.selectEndpoints({element:this.$el.find('div')});
				//console.log('source epToDelete',epToDelete.length);
				epToDelete.delete(); // Had to "delete" the endpoint from the endpointsByElement collection in jsPlumb


				//console.log("TargetEntityView, Render");
				var self = this;
				self.$el.html(''); // Clear source view 
				
				// Add Header Divs
				var header = self.$el.append('<div id="targetHeader_ID" class="grid_1 alpha">ID</div><div id="targetHeader_Name"  class="grid_5 omega">Name</div>');
				
				// Add sort button
				header.find('#targetHeader_ID').append('<img class="sortButton sortUp" data-field="id" data-direction="1" width="12" height="12" src="images/arrow---up---green.png"/><img class="sortButton sortDown" data-field="id" data-direction="-1"  width="12" height="12" src="images/arrow---down---green.png"/>');
				header.find('#targetHeader_Name').append('<img class="sortButton sortUp" data-field="name" data-direction="1" width="12" height="12" src="images/arrow---up---green.png"/><img  class="sortButton sortDown" data-field="name" data-direction="-1"  width="12" height="12" src="images/arrow---down---green.png"/>');
				
				_.each(self.model.toArray(), function (entity, i){
					var ele = (new EntityView({model: entity,parent:this})).render().$el;
					self.$el.append(ele);
					ele.attr('data-jsplumbid',entity.toJSON().id);
					jsPlumb.addEndpoint(ele, { anchor:"RightMiddle" }, jsPlumb.targetGreyEndpointOptions);
					
					//console.log('Connections #:',entity.toJSON().connections.length);
					_.each(entity.toJSON().connections,function(connection,c){
						// Connections defined in the database
						if( $('[data-jsplumbid='+connection+']').length !== 0)
						{
							//console.log($('[data-jsplumbid='+connection+']'));
							//console.log('Source:',ele.attr('id'),ele,' Target:',$('[data-jsplumbid='+connection+']').attr('id'));

							var conn = {};
							conn.source = jsPlumb.getEndpoints(ele.attr('id'))[0];

							//console.log('getEndpoints ',jsPlumb.getEndpoints($('[data-jsplumbid='+connection+']')));
							conn.target = jsPlumb.getEndpoints($('[data-jsplumbid='+connection+']').attr('id'))[0];
							//console.log('Creating connection:',conn);
							var aConnection = jsPlumb.connect(conn,jsPlumb.databaseGreyEndpointOptions);
							//console.log('Created connection:',aConnection);
							//alert('connection found!');
						}
						//console.log('Connections from database:',connection);
					});
				});
				return self;
			},
			changeSort: function(e){
				var field     = $(e.target).data('field');
				var direction = $(e.target).data('direction');
				//console.log('Sorting field:',field,' direction:',direction);
				this.model.changeSort(field,direction);
			},
			searchEntities: function (){
				//Get parameters for search
				//var sourceSystem = $('#sourceSystem option:selected').val();
				var targetSystem = $('#targetSystem option:selected').val();
				//var sourceEntityType = $('#sourceEntityType option:selected').val();
				var targetEntityType = $('#targetEntityType option:selected').val();

				var query ={query:{}};
				//query.query['sourceSystem'] = sourceSystem;
				query.query['sourceSystem'] = parseInt(targetSystem);
				//query.query['sourceEntityType'] = sourceEntityType;
				query.query['entityType'] = parseInt(targetEntityType);


				//console.log(targetSystem,targetEntityType,query);
				
				_targetEntities.query = query;
				_targetEntities.fetch({
					success:function(entities){
						_targetEntities.trigger('add');
						//console.log('Success! TargetEntityView searchEntities');
					}
				});
			}
		});

	return TargetEntityView;
});