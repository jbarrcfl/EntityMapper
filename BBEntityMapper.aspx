<%@ Page Language="C#" Inherits="WebProject.BBEntityMapper" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head runat="server">
	<title>Entity Mapper</title>
	<link rel="stylesheet" type="text/css" media="all" href="css/960/reset.css" />
	<link rel="stylesheet" type="text/css" media="all" href="css/960/text.css" />
	<link rel="stylesheet" type="text/css" media="all" href="css/960/960.css" />
	<link rel="stylesheet" type="text/css" media="all" href="css/entitymapper.css" />
	<!--<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.1/themes/base/jquery-ui.css" />-->
	<link rel="stylesheet" type="text/css" media="all" href="js/select2-3.3.1/select2.css" />
	
	<script scr="/js/underscore-min.js" ></script>
	<script src="/js/jquery-1.9.1.min.js" ></script>
	<script src="/js/jquery-ui-1.10.0.custom.min.js"></script>
	<script src="/js/jquery.json-2.4.min.js"></script>
	<script src="/js/jquery.jsPlumb-1.3.16-all-min.js"></script>
	<script src="/js/jquery.formalize.min.js"></script>
	<script src="/js/select2-3.3.1/select2.js"></script>
	<script scr="/js/backbone-min.js"></script> 
	
	<script type="text/javascript">
		//Model Definitions 
		var Entity = Backbone.Model.extend({
			defaults: function (){
				return {
					id: -1,
					name: 'Default',
					connections:[]
				}
			}
		});

		var SourceEntities = Backbone.Collection.extend({
			model: entity
		});

		var TargetEntities = Backbone.Collection.extend({
			model: entity
		});

		var _sourceEntities = new SourceEntities();
		var _targetEntities = new TargetEntities();

		//<!-- Views -->
		var EntityView = Backbone.View.extend({
			model: new Entity(),
			tagName: "div",
			initialize: function(){
				this.template= _.template($('#entity-template').html());
			},
			render: function(){
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			}
		});

		var SourceEntityView = Backbone.View.extend({
			model: _sourceEntities,
			el:$('#sourceentdiv1'), // Target Element to append the view to
			initialize: function(){
				this.model.on('add', this.render, this);
			},
			render: function(){
				var self = this;
				self.$el.html('');
				_.each(this.model.toArray(), function (entity, i){
					self.$el.append((new EntityView({model: Entity})).render().$el);
				})
				return this;
			}
		});

		var TargetEntityView = Backbone.View.extend({
			model: _targetEntities,
			el:$('#targetentdiv1'), // Target Element to append the view to
			initialize: function(){
				this.model.on('add', this.render, this);
			},
			render: function(){
				var self = this;
				self.$el.html('');
				_.each(this.model.toArray(), function (entity, i){
					self.$el.append((new EntityView({model: Entity})).render().$el);
				})
				return this;
			}
		});
	</script>
	<!-- Templates -->
	<script id="entity-template" type="text/template">
		<span class="id"></span>
		<span class="name"></span>
	</script>

	<script type="text/javascript">
		// Insert optional override object before the function

		createGridder = function() {
		  document.body.appendChild(
		    document.createElement('script'))
		    .src='http://peol.github.com/960gridder/releases/1.3.1/960.gridder.js';
		}
		var _sourceView = new SourceEntityView();
		_sourceEntities.add({id:1,name:"Test1"});
		_sourceEntities.add({id:1,name:"Test2"});
	</script>
</head>
<body>
	<h1>Entity Mapper</h1>
	<div id="maincontainer" class="container_16">
		<div id="source" class="grid_6">
			<h2>Source Entities</h2>
			<div class="grid_3 alpha" style="text-align:center">
				<p>Source System:<br/><select id="sourceSystem"></select></p>
			</div>
			<div class="grid_3 omega" style="text-align:center">
				<p>Entity Type:<br/><select id="sourceEntityType"></select>
					<br/><button id="retSoureButton" type="button">Get Sources!</button>
				</p>
			</div>
			<div id="sourceFilterBar" class="grid_6 alpha" >
				 <!--<select class="grid_6 alpha" id="sourceSearchField">
			    </select>-->
				<input id="sourceSearchField" type="hidden" class="grid_6 alpha" />
				<!--<input style="width:98%" type="text" value="...Filter"/>-->
			</div>
			<div class="grid_6 alpha" id="sourceentdiv1">
				<table id="sourceentdiv1tbl"></table>
			</div>
		</div>
		<div id="dest" class="grid_6">
			<h2>Target Entities</h2>
			<div class="grid_3 alpha" style="text-align:center">
				<p>Source System:
				<br/><select id="targetSystem"></select></p>
			</div>
			<div class="grid_3 omega" style="text-align:center">
				<p>Entity Type:<br/><select id="targetEntityType"></select>
					<br/><button id="retDestButton" type="button">Get Destination!</button>
				</p>
			</div>
			<div id="descFilterBar" class="grid_6 alpha" >
				<!--<select class="grid_6 alpha" id="targetSearchField">
			    </select>-->
			    <input id="targetSearchField" type="hidden" class="grid_6 alpha" />
				<!--<input style="width:98%" type="text" value="...Filter"/>-->
			</div>
			<div class="grid_6 alpha" id="targetentdiv1">
				<table id="destentdiv1tbl"></table>
			</div>
		</div>
		<div id="sourceDetails" class="grid_4">
		<h2>Details</h2>
			<p>Source Selected Item:<br/><span id="sourceSelectedItem"></span>
				<br/>Source Details:<br/><span id="sourceSelectedItemDetails"></span>
				<br/>Dest Selected Item:<br/><span id="targetSelectedItem"></span>
				<br/>Dest Details:<br/><span id="targetSelectedItemDetails"></span>
			</p>
			<h2>Operations</h2>
			<p><a id="rightClickTest" href="#" onclick="">Testing Right Click</a></p>
		</div>
	<div id="footer" class="grid_16"><span id="jsUsedFooter"></span></div>
	</div>
	<div id="connectionRightClick" title="Relationship Properties">
  		<p>Source:<span id="dialogSourceSpan"></span>
  		   <br/>Target:<span id="dialogTargetSpan"></span>
  		   <br/>Relationship Type:
  		   <br/><select id="relDialogDD"></select>
  		   <br/><button id="saveRelDialog" type="button" onclick="">Save</button></p>
	</div>
</body>
</html>
