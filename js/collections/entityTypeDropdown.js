define([
  'jquery',
  'underscore',
  'backbone',
  'models/dropdownItem'
], function($, _, Backbone,DropdownItem){

	var EntityTypeDropdown = Backbone.Collection.extend({
		url : 'http://localhost:8081/entitytype',
		model: DropdownItem,
		sort_key:"id",
		comparator: function(a, b) {
		    // Assuming that the sort_key values can be compared with '>' and '<',
		    // modifying this to account for extra processing on the sort_key model
		    // attributes is fairly straight forward.
		    a = a.get(this.sort_key);
		    b = b.get(this.sort_key);
		    return a > b ?  1
		         : a < b ? -1
		         :          0;
		}  
	});

	return EntityTypeDropdown;
});