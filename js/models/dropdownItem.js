define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){

	var DropDownItem = Backbone.Model.extend({
		defaults: function (){
			return {
				ddid: -1,
				value: 'Select One'
			};
		}
	});

	return DropDownItem;
});