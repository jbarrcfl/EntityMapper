// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery-1.9.1.min',
    underscore: 'libs/underscore-min',
    backbone: 'libs/backbone-min',
    jsplumb:'libs/jquery.jsPlumb-1.3.16-all',
    jqJSON: 'libs/jquery.json-2.4.min',
    select2: 'libs/select2-3.3.1/select2',
    jqueryui:'libs/jquery-ui-1.10.0.custom',
    //sinon: 'libs/sinon/sinon.js',

    // Require.js plugins
    text: 'libs/require/text',
    //order: 'libs/require/order', //uses shim http://requirejs.org/docs/api.html#config-shim

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: '../templates'
  },
  shim: {
        'jquery':{
          exports: '$'
        },
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
    },
	urlArgs: "bust=" +  (new Date()).getTime()

});

// Let's kick off the application

require([
  'views/app',
  'vm'
], function(AppView, Vm){
  //var appView = Vm.create({}, 'AppView', AppView);
  //Router.initialize({appView: appView});
  var appView = new AppView();
  appView.render(); // render() calls Backbone.history when its ready to start
});