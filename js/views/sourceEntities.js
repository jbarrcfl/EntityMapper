define([
  'jquery',
  'underscore',
  'backbone',
  'collections/sourceEntities',
  'views/entity',
  'jqJSON',
  'jqueryui',
  'jsplumb',
  'utils/plumbJSInit',
  'select2'
], function($, _, Backbone, _sourceEntities,EntityView,jqJSON,jqueryui,_jsPlumb,plumbJSInit,_select2){

  
	var SourceEntityView = Backbone.View.extend({ 
			model: _sourceEntities,
			el:'#sourceentdiv1', // Target Element to append the view to
			initialize: function(){

				//this.render = _.bind(this.render,this);
				this.model.on('add', this.render, this);
				this.model.bind('sort',this.render,this);
				var self = this;
$('#sourceSearchField').select2({
			    placeholder: "...Search ...Filter",   //Broken in select2 3.3.1 ??Fixed?
			    allowClear: true,
			    width: "element",
			    multiple:true,
			    //data:{results:[]},
			    minimumInputLength: 1,
			    createSearchChoice:function(term, data) { if ($(data).filter(function() { return this.text.localeCompare(term)===0; }).length===0) {return {id:term, text:term};} },
			    query: function(query){
			    	var data={results:[]};
			    	//console.log(query.term);
			    	var x = function(a,b){return (a.toString().toLowerCase().indexOf(b.toString().toLowerCase())!== -1);}

			    	if(query.term.toString().indexOf(':') !== -1)
			    	{
			    		//check for property query
			    		var check = self.model.toArray();
			    		var parameters = query.term.toString().toLowerCase().split(':');
			    		var indexProp = 0;
			    		var indexVal = 1;
			    		var skipchar = 0;
			    		//console.log('parameter query:',query.term);
			    		if(check[0].attributes[parameters[0]])
			    		{
			    			
			    			if(parameters[1])
			    			{
			    				//Compare operator < > = <=
			    				if(parameters[1].charAt(0) =="<")
			    				{ 
			    					skipchar++;
			    					x = parameters[1].charAt(1) == "="? function(a,b){return a<=b}:function(a,b){return a<b};
			    					skipchar = parameters[1].charAt(1) == "="?++skipchar:skipchar; 
			    				}
			    				else if(parameters[1].charAt(0) ==">")
			    				{
			    					skipchar++;
			    					x = parameters[1].charAt(1) == "="? function(a,b){return a>=b}:function(a,b){return a>=b};
			    					skipchar = parameters[1].charAt(1) == "="?++skipchar:skipchar;
			    				}
			    				else if(parameters[1].charAt(0) =="=")
			    					{skipchar++; x = function(a,b){return a==b};}
			    			}

			    			// search
			    			_.each(check, function(entity,i){
			    				
			    				if(x(entity.attributes[parameters[indexProp]],parameters[1].substr(skipchar,parameters[1].length)))
			    				{
			    					var obj ={};
						    		obj.id = entity.attributes.id.toString();
						    		obj.text = entity.attributes.name.toString();
			    					data.results.push(obj);

			    				}
			    			});
			    		}
			    	}
			    	else
			    	{
			    		_.each(self.model.toArray(), function (entity, i){
			    		var obj ={};
			    		obj.id = entity.attributes.id.toString();
			    		obj.text = entity.attributes.name.toString();
			    		//console.log(obj,query.term);
			    		if(x(obj.text,query.term)){data.results.push(obj);}
			    		});
			    	}
			    	
			    	query.callback(data);
			    }
			    //data:{results:[]}
				});	
				
				$('#sourceSearchField').on('change',function(e){self.filterChanged(e);});
			},
			events: {
				'click .sortButton':'changeSort',
			},
			render: function(){
				

				jsPlumb.detachEveryConnection();
				var epToDelete = jsPlumb.selectEndpoints({element:this.$el.find('div')});
				//console.log('source epToDelete',epToDelete.length);
				epToDelete.delete(); // Had to "delete" the endpoint from the endpointsByElement collection in jsPlumb

				//console.log("SourceEntityView, Render");
				var self = this;
				self.$el.html(''); // Clear source view 
				
				// Add Header Divs
				var header = self.$el.append('<div id="sourceHeader_ID" class="grid_1 alpha">ID</div><div id="sourceHeader_Name"  class="grid_5 omega">Name</div>');
	
				// Add sort button
				header.find('#sourceHeader_ID').append('<img class="sortButton sortUp" data-field="id" data-direction="1" width="12" height="12" src="images/arrow---up---green.png"/><img class="sortButton sortDown" data-field="id" data-direction="-1"  width="12" height="12" src="images/arrow---down---green.png"/>');
				header.find('#sourceHeader_Name').append('<img class="sortButton sortUp" data-field="name" data-direction="1" width="12" height="12" src="images/arrow---up---green.png"/><img  class="sortButton sortDown" data-field="name" data-direction="-1"  width="12" height="12" src="images/arrow---down---green.png"/>');
				
				//header.find('#sourceHeader_Name').append('<img width="12" height="12" src="images/arrow---up---green.png"/><img width="12" height="12" src="images/arrow---down---green.png"/>');
				

				_.each(self.model.toArray(), function (entity, i){
					var ele = (new EntityView({model: entity})).render().$el;
					self.$el.append(ele);
					ele.attr('data-jsplumbid',entity.toJSON().id);
					//console.log('sourceEntities ele has already selectEndpoints',jsPlumb.selectEndpoints({element:$(ele)}).length);
					jsPlumb.addEndpoint(ele, { anchor:"RightMiddle" }, jsPlumb.sourceGreyEndpointOptions);
					
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
							//conn.source.setPaintStyle({paintSytle:{fillStyle:"green"}});
							//conn.target.setPaintStyle({paintSytle:{fillStyle:"green"}});

						//	console.log('Created connection:',aConnection);
							//alert('connection found!');
						}
						//console.log('Connections from database:',connection);
					});
				});
				return self;
			},
			filterChanged:function(e){
				this.model.filterText = e.val.toString();
				//this.model = this.model.filteredEntities;
				//this.render();	
				console.log('this.model.filterText',this.model.filterText);
			},
			changeSort: function(e){
				var field     = $(e.target).data('field');
				var direction = $(e.target).data('direction');
				//console.log('Sorting field:',field,' direction:',direction);
				this.model.changeSort(field,direction);
			},
			searchEntities: function (){
				//Get parameters for search
				var sourceSystem = $('#sourceSystem option:selected').val();
				//var targetSystem = $('#targetSystem option:selected').val();
				var sourceEntityType = $('#sourceEntityType option:selected').val();
				//var targetEntityType = $('#targetEntityType option:selected').val();

				var query ={query:{}};
				query.query['sourceSystem'] = parseInt(sourceSystem);
				//query.query['targetSystem'] = targetSystem;
				query.query['entityType'] = parseInt(sourceEntityType);
				//query.query['targetEntityType'] = targetEntityType;


				//console.log(sourceSystem,sourceEntityType,query);
				
				_sourceEntities.query = query;
				_sourceEntities.fetch({
					success:function(entities){
						_sourceEntities.trigger('add');
						console.log('Success! SourceEntityView searchEntities:',_sourceEntities.length);
					}
				});
			}
		});

	return SourceEntityView;
});