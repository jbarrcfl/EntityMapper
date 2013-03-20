define([
  'jquery',
  'jqJSON',
  'jqueryui',
  'jsplumb',
], function($, jqJSON,jqueryui,_jsPlumb){
	
	$(window).resize(function() {
	  jsPlumb.repaintEverything();
	 });

	jsPlumb.exampleGreyEndpointOptions = {
			endpoint:["Dot",{ radius:5 }],
			//paintStyle:{ width:15, height:15, fillStyle:'#666' },
			width:10,
			height:10,
			isSource:true,
			connectorStyle : { strokeStyle:"#666" },
			isTarget:true,
			scope:"user"
		};
	jsPlumb.sourceGreyEndpointOptions = {
			endpoint:["Dot",{ radius:7 }],
			paintStyle:{ width:15, height:15, fillStyle:'#456' },
			width:10,
			height:10,
			isSource:true,
			connectorStyle : { strokeStyle:"#666" },
			isTarget:true
			//scope:"source"
		};
	jsPlumb.targetGreyEndpointOptions = {
			endpoint:["Dot",{ radius:7 }],
			//paintStyle:{ width:15, height:15, fillStyle:'#666' },
			width:10,
			height:10,
			isSource:true,
			connectorStyle : { strokeStyle:"#666" },
			isTarget:true
			//scope:"target"
		};
	jsPlumb.databaseGreyEndpointOptions = {
			endpoint:["Dot",{ radius:5 }],
			paintStyle:{ fillstyle: "green" },
			width:10,
			height:10,
			isSource:true,
			connectorStyle : { strokeStyle:"#666" },
			isTarget:true,
			scope:"database"
		};

	
	jsPlumb.CustomPlumbConnectionMade = function (info)
	{
		/*
			  connection 		: 	the new Connection.  you can register listeners on this etc.
			  sourceId 		:	id of the source element in the Connection
			  targetId		:	id of the target element in the Connection
			  source		:	the source element in the Connection
			  target		:	the target element in the Connection
			  sourceEndpoint	:	the source Endpoint in the Connection
			  targetEndpoint	:	the targetEndpoint in the Connection
		  */
		  
		if(info.connection.scope == "database") {
			
		}
		else  {
			console.log("Plumb Connected: scope:"+info.connection.scope+" connection:"+info.connection+" Source:"+info.sourceId+" Dest:"+info.targetId+" SourceElm:"+$(info.source).text()+" DestElm:"+info.target+ " SourceEP:"+info.sourceEndpoint+" DestEP:"+info.targetEndpoint);
		  //alert("Connected: "+$(info.source).data('detailsdata')+" to "+$(info.target).data('detailsdata'));
		  // Set Dialog source and Target
		  //$('#dialogSourceSpan').append(info.source);
		  //$('#dialogTargetSpan').append(info.target);
		  //updateRelationship($(info.source).data('detailsdata'),$(info.target).data('detailsdata'));
		}
	}

	jsPlumb.bind('jsPlumbConnection', function(info) {
	  $(info.source).trigger("epConnected", info);
	  $(info.target).trigger("epConnected", info);
	});
});