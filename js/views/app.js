define([
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'views/source',
  'views/target',
  'text!templates/layout.html' 
], function($, _, Backbone, Vm, SourceUIView,TargetUIView, layoutTemplate){
  var AppView = Backbone.View.extend({
    _sourceView:{},
    _targetView:{},
    el: '#maincontainer',
    initialize: function () {
      this._sourceView = new SourceUIView();
      this._targetView = new TargetUIView();
      this._targetView.on('searchEntities',this.targetEntitySearch,this);
      this._sourceView.on('searchEntities',this.sourceEntitySearch,this);
    },
    targetEntitySearch: function(){
      console.log('AppView targetEntitySearch');
    },
    sourceEntitySearch: function(){
      console.log('AppView sourceEntitySearch');
    },
    render: function () {

      this.$el.html('');
      this.$el.append(layoutTemplate);

      //this._sourceView.el = '#source';
      //this._sourceView.$el = $('#source');
      this.$el.find('#source').html(this._sourceView.render().el);
      this.$el.find('#target').html(this._targetView.render().el);
      
      //Backbone.history.start();
		}
	});
  return AppView;
});