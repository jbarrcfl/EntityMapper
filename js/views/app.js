define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'views/source',
  'views/target',
  'text!templates/layout.html' 
], function($, _, Backbone, Vm, SourceView,TargetView, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: $('#maincontainer'),
    initialize: function () {
      
    },
    render: function () {
			var that = this;
      $(this.el).html(layoutTemplate);
      var _sourceView = new SourceView();
      var _targetView = new TargetView();
      //_sourceView.render();
      //Backbone.history.start();
		} 
	});
  return AppView;
});