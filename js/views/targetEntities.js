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
			collection: _targetEntities,
			initialize: function(){

				this.model = _targetEntities.filteredEntities(); // Set = collection of filtered // view manage the filtering
				this.model.on('add', this.render, this);
				this.model.bind('sort',this.render,this);
				var self = this;
				this.initSelect2();
				$('#targetSearchField').on('change',function(e){self.filterChanged(e);});
			},
			events: {
				'click .sortButton':'changeSort'
			},
			render: function(){

				// Reset jsPlumb EndPoints when rendering... old dom elements are gone
				jsPlumb.detachEveryConnection();
				var epToDelete = jsPlumb.selectEndpoints({element:this.$el.find('div')});
				epToDelete.delete(); // Had to "delete" the endpoint from the endpointsByElement collection in jsPlumb

				var self = this;
				self.$el.html(''); // Clear source view 
				
				// Add Header Divs
				var header = self.$el.append('<div id="targetHeader_ID" class="grid_1 alpha">ID</div><div id="targetHeader_Name"  class="grid_5 omega">Name</div>');
				
				// Add sort button
				header.find('#targetHeader_ID').append('<img class="sortButton sortUp" data-field="id" data-direction="1" width="12" height="12" src="images/arrow---up---green.png"/><img class="sortButton sortDown" data-field="id" data-direction="-1"  width="12" height="12" src="images/arrow---down---green.png"/>');
				header.find('#targetHeader_Name').append('<img class="sortButton sortUp" data-field="name" data-direction="1" width="12" height="12" src="images/arrow---up---green.png"/><img  class="sortButton sortDown" data-field="name" data-direction="-1"  width="12" height="12" src="images/arrow---down---green.png"/>');
				
				_.each(self.model.toArray(), function (entity, i){
					var ele = (new EntityView({model: entity})).render().$el;
					self.$el.append(ele);
					ele.attr('data-jsplumbid',entity.toJSON().id);
					jsPlumb.addEndpoint(ele, { anchor:"RightMiddle" }, jsPlumb.targetGreyEndpointOptions);
					
					_.each(entity.toJSON().connections,function(connection,c){
						// Connections defined in the database
						if( $('[data-jsplumbid='+connection+']').length !== 0)
						{
							var conn = {};
							conn.source = jsPlumb.getEndpoints(ele.attr('id'))[0];
							conn.target = jsPlumb.getEndpoints($('[data-jsplumbid='+connection+']').attr('id'))[0];
							var aConnection = jsPlumb.connect(conn,jsPlumb.databaseGreyEndpointOptions);
						}
					});
				});
				return self;
			},
			filterChanged:function(e){
				this.collection.filterText = e.val.toString();
				this.model = this.collection.filteredEntities();
				this.render();
			},
			changeSort: function(e){
				var field     = $(e.target).data('field');
				var direction = $(e.target).data('direction');
				this.collection.changeSort(field,direction);
				this.model = this.collection.filteredEntities();
				this.render();
			},
			searchEntities: function (){
				//Get parameters for search
				var targetSystem = $('#targetSystem option:selected').val();
				var targetEntityType = $('#targetEntityType option:selected').val();
				
				var query ={query:{}};
				query.query['sourceSystem'] = parseInt(targetSystem);
				query.query['entityType'] = parseInt(targetEntityType);
				
				_targetEntities.query = query;
				_targetEntities.fetch({
					success:function(entities){
						_targetEntities.trigger('add');
					}
				});
			},
			initSelect2: function (){

				var self = this;

				$('#targetSearchField').select2({
			    placeholder: "...Search ...Filter",
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
			    
				});	
			}
		});

	return TargetEntityView;
});