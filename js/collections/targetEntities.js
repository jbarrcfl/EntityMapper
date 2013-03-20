define([
  'jquery',
  'underscore',
  'backbone',
  'models/entityItem'
], function($, _, Backbone, EntityItem){
	var TargetEntities = Backbone.Collection.extend({
			url : function(){ 
				console.log('Entities url',JSON.stringify(this.query['query'])); 
				return this.query['query'] === undefined ? 'http://localhost:8081/entityitem':'http://localhost:8081/entityitem?query='+JSON.stringify(this.query['query']); },
			model: EntityItem,
			query: {},
			sort_key:"name",
			sort_direction: 1,
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
				this.sort_key       = newField  == this.sort_key? this.sort_key : newField;
				this.sort_direction = direction == this.sort_direction? this.sort_direction : this.sort_direction*-1;
				this.sort();
				//console.log('TargetEntities changeSort:',this.sort_key,this.sort_direction);
			}
			/*,
			SourceEntities: function(){
				return this.filter(function(ent){
					return ent.get('isSource') == true;
				});
			},
			TargetEntities: function(){
				return this.filter(function(ent){
					return ent.get('isSource') != true;
				});
			}*/
		});
	var _targetEntities = new TargetEntities();
	
	return _targetEntities;
});