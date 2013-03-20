define([
  'jquery',
  'underscore',
  'backbone',
  'models/dropdownItem'
], function($, _, Backbone,DropdownItem){

	var SystemDropdown = Backbone.Collection.extend({
		url : 'http://localhost:8081/entitysystem',
		model: DropDownItem
	});

	return SystemDropdown;
});