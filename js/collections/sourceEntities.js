define([
  'jquery',
  'underscore',
  'backbone',
  'models/entityItem'
], function($, _, Backbone, EntityItem){
	var SourceEntities = Backbone.Collection.extend({
			url : function(){ 
				console.log('Entities url',JSON.stringify(this.query['query'])); 
				return this.query['query'] === undefined ? 'http://localhost:8081/entityitem':'http://localhost:8081/entityitem?query='+JSON.stringify(this.query['query']); },
			model: EntityItem,
			query: {},
			sort_key:"name",
			sort_direction: 1,
			filterText: '',
			comparator: function(a, b) {
			    // Assuming that the sort_key values can be compared with '>' and '<',
			    // modifying this to account for extra processing on the sort_key model
			    // attributes is fairly straight forward.
			    a = a.get(this.sort_key);
			    b = b.get(this.sort_key);
			    return a > b ?  (1 * this.sort_direction)
			         : a < b ? (-1 * this.sort_direction)
			         :          0;
			},
			changeSort: function(newField,direction){
				console.log('SourceEntities chagneSort');
				this.sort_key       = newField  == this.sort_key? this.sort_key : newField;
				this.sort_direction = direction == this.sort_direction? this.sort_direction : this.sort_direction*-1;
				this.sort();
				//console.log('SourceEntities changeSort:',this.sort_key,this.sort_direction);
			},
			filteredEntities: function(){
				var self = this;
				retVal = new SourceEntities();
				console.log('filteredEntities');
				//1. Filtered Entities should be all if no filterText
				if(this.filterText == ''){console.log('filteredEntities no filter!');return self};
				
				console.log('filter found!');
				retVal.models =  _.filter(this.models,function(ent){

					var x = function(a,b){return (a.toString().toLowerCase().indexOf(b.toString().toLowerCase())!== -1);}

					var parameters = self.filterText.toLowerCase().split(':');
		    		var indexProp = 0;
		    		var indexVal = 1;
		    		var skipchar = 0;
					//console.log('parameter query:',query.term);
					if(ent.attributes[parameters[0]])
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
					}

					if(!parameters[1])
					{
						var b = parameters[0] === undefined?'':parameters[0];
						var a = ent.attributes[parameters[indexProp]] === undefined?'':ent.attributes[parameters[indexProp]];
						return x(a,b);
					}
					// search
					if(x(ent.attributes[parameters[indexProp]],parameters[1].substr(skipchar,parameters[1].length)))
					{
						return true;
					}
					

					return false;
				});

				return retVal;
			}
		});

	var _sourceEntities = new SourceEntities();
	return _sourceEntities;
});