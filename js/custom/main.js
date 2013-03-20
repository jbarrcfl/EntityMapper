
var exampleGreyEndpointOptions = {
		endpoint:["Dot",{ radius:5 }],
		//paintStyle:{ width:15, height:15, fillStyle:'#666' },
		width:10,
		height:10,
		isSource:true,
		connectorStyle : { strokeStyle:"#666" },
		isTarget:true,
		scope:"user"
	};
var sourceGreyEndpointOptions = {
		endpoint:["Dot",{ radius:5 }],
		//paintStyle:{ width:15, height:15, fillStyle:'#666' },
		width:10,
		height:10,
		isSource:true,
		connectorStyle : { strokeStyle:"#666" },
		isTarget:true,
		scope:"source"
	};
var targetGreyEndpointOptions = {
		endpoint:["Dot",{ radius:5 }],
		//paintStyle:{ width:15, height:15, fillStyle:'#666' },
		width:10,
		height:10,
		isSource:true,
		connectorStyle : { strokeStyle:"#666" },
		isTarget:true,
		scope:"target"
	};
var databaseGreyEndpointOptions = {
		endpoint:["Dot",{ radius:5 }],
		//paintStyle:{ width:15, height:15, fillStyle:'#666' },
		width:10,
		height:10,
		isSource:true,
		connectorStyle : { strokeStyle:"#666" },
		isTarget:true,
		scope:"database"
	};

var _sourceEntities,_targetEntities, _connections,_contextMenu;

_contextMenu = "#connectionRightClick";

$( function(){
  //Initialized
	
	//Footer Details
	$('#jsUsedFooter').append(".js Used:");
	$.each($('script'),function(index,value)
	{
		var str = value.src.toString();
		str = str.substring(str.lastIndexOf("/")+1,str.length)
		
		$('#jsUsedFooter').append("<br/>"+str);
		//str.lastIndexOf("/");
	});
	
  //Select2
  $('#sourceSearchField').select2({
    placeholder: "...Search ...Filter",   //Broken in select2 3.3.1 ??Fixed?
    allowClear: true,
    width: "element",
    multiple:true,
    data:{},
	});	
  $('#targetSearchField').select2({
    placeholder: "...Search ...Filter",   //Broken in select2 3.3.1 ??Fixed?
    allowClear: true,
    width: "element",
    multiple:true,
    data: {},
	});	
	
 //createGridder();
  $(_contextMenu).dialog();
  $(_contextMenu).dialog("close");
  
	
  $("#retSoureButton").click( function(){fillSourceEntities();});
  $("#retDestButton").click( function(){fillDestEntities()});
  
  $('#rightClickTest').click(function(){
  	$('#connectionRightClick').dialog({ position: { my: 'left top', at: 'right', of: event } });
  	getDropdownKeyValueFromServer('relDialogDD','GetRelationshipTypes');
  });
  
  // Fill Source System and Entity Type for Source and Destination
  getDropdownKeyValueFromServer('sourceEntityType','GetEntityTypes');
  getDropdownKeyValueFromServer('targetEntityType','GetEntityTypes');
  
  //Input a tag into source2 filter bars // select2('data') doesn't behave correctly!!
  $('#sourceEntityType').change(function() {dropdownChanged(this)});;
  $('#targetEntityType').change(function() {dropdownChanged(this)});;
  
  getDropdownKeyValueFromServer('sourceSystem','GetSourceSystems');
  getDropdownKeyValueFromServer('targetSystem','GetSourceSystems');
  
  //Input a tag into source2 filter bars // select2('data') doesn't behave correctly!!
  $('#sourceSystem').change(function() {dropdownChanged(this)});;
  
  $('#targetSystem').change(function() {dropdownChanged(this)});;
  
  
  //JS Plumb
  jsPlumb.bind("jsPlumbConnection", function(info) { plumbConnectionMade(info) });
	
});

function dropdownChanged(eventObj) {
	var selector = "#"+eventObj.id.toString()+" option:selected";
	var obj = { id:0,text:"",source:"", locked:false};
	
	//alert("data:"+$(dest).select2("data"));
	var regex = /source/g;
	var dest = (regex.test(eventObj.id.toString())==true)? '#sourceSearchField':'#targetSearchField';
	
	//Certain Selections only allow 1 form each source
	var currentData = $(dest).select2("data");
	
	var replaced=0;
	$.each(currentData, function(index,value) {
		
		if(replaced == 0 && value.source!==undefined && value.source ==eventObj.id.toString())
		{
			//Remove current choice
			//alert("Remove Data Source:"+value.source+" Index:"+index+" Value:"+value);
			//console.log("before splice:",currentData)
			currentData.splice(index,1);
			//console.log("after splice:",currentData)
			replaced++;
		}
	});
	
	//alert("currentData:"+currentData+" Length:"+currentData.results.length);
	
	$(selector).each(function () {
		 
		obj.text=$(this).text();
		obj.id=eventObj.id+":"+$(this).val();
		obj.source=eventObj.id;
		obj.locked=true;
		currentData.push(obj);
		//console.log("currentData",currentData);
	});
	
	
	//console.log("resultData:",resultData," Target:",dest);
	
	//console.log("Seach Bar to modify:"+dest);
	//console.log("Length before set data:",beforelen);
  	$(dest).select2("data",currentData);
  	
}

function plumbConnectionMade(info)
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
	else if(info.connection.scope == "user") {
		alert("Plumb Connected: scope:"+info.connection.scope+" connection:"+info.connection+" Source:"+info.sourceId+" Dest:"+info.targetId+" SourceElm:"+$(info.source).text()+" DestElm:"+info.target+ " SourceEP:"+info.sourceEndpoint+" DestEP:"+info.targetEndpoint);
	  //alert("Connected: "+$(info.source).data('detailsdata')+" to "+$(info.target).data('detailsdata'));
	  // Set Dialog source and Target
	  $('#dialogSourceSpan').append(info.source);
	  $('#dialogTargetSpan').append(info.target);
	  //updateRelationship($(info.source).data('detailsdata'),$(info.target).data('detailsdata'));
	}
}

function fillSourceEntities()
{
	var criteria={};
	_connections = undefined;
	// Get filter bar data
	var selections = $('#sourceSearchField').select2('data');
	var splitVar;
	var obj = new Object();
	$.each(selections,function(index,value){
		splitVar = value.id.toString().split(":")
		
		if(criteria[splitVar[0]] ==undefined) {
		 criteria[splitVar[0]]= splitVar[1];
		 }
		//criteria[splitVar[0]].push(splitVar[1]); //Deserializing array of parameters not working yet?
		
	});
	//criteria.push(obj);
	console.log("fillSourceEntities",selections, "Search Criteria:",criteria);
	querySourceEntitiesFromDB(criteria);
}

function fillDestEntities()
{
	var criteria={};
	_connections = undefined;
	// Get filter bar data
	var selections = $('#targetSearchField').select2('data');
	var splitVar;
	var obj = new Object();
	$.each(selections,function(index,value){
		splitVar = value.id.toString().split(":")
		
		if(criteria[splitVar[0]] ==undefined) {
		 criteria[splitVar[0]]= splitVar[1];
		 }
		//criteria[splitVar[0]].push(splitVar[1]); //Deserializing array of parameters not working yet?
	});
	//criteria.push(obj);
	console.log("fillTargetEntities",selections, "Search Criteria:",criteria);
	queryTargetEntitiesFromDB(criteria);
}

function SourceTargetChanged()
{
	//Fire event if both Source and Target have items
	
	if(this._sourceEntities !== undefined && this._targetEntities !== undefined)
	{
		if(this._sourceEntities.length > 0 && this._targetEntities.length > 0)
		{
			SourceTargetFilled();
		}
	}
}

function SourceTargetFilled()
{
	
	/*var srcSystem = $('#sourceSystem').find(':selected').val();
	var srcEntityType = $('#sourceEntityType').find(':selected').val();
	var tarSystem = $('#targetSystem').find(':selected').val();
	var tarEntityType = $('#targetEntityType').find(':selected').val();
	
 	// Query Connections
 	queryRelationshipsFromDB(srcSystem,srcEntityType,tarSystem,tarEntityType);*/
 	console.log("SourceTargetFilled()");
 	
 	var criteria={};
	_connections = undefined;
	// Get filter bar data
	var selections = $('#targetSearchField').select2('data');
	var splitVar;
	$.each(selections,function(index,value){
		splitVar = value.id.toString().split(":")
		
		if(criteria[splitVar[0]] ==undefined) {
		 criteria[splitVar[0]]= splitVar[1];
		 }
		//criteria[splitVar[0]].push(splitVar[1]); //Deserializing array of parameters not working yet?
	});
	
	selections = $('#sourceSearchField').select2('data');
	$.each(selections,function(index,value){
		splitVar = value.id.toString().split(":")
		
		if(criteria[splitVar[0]] ==undefined) {
		 criteria[splitVar[0]]= splitVar[1];
		 }
		//criteria[splitVar[0]].push(splitVar[1]); //Deserializing array of parameters not working yet?
	});
	queryRelationshipsFromDB(criteria);
}

function getDropdownValuesFromServer(ddID,serverFillFunction)
{
	$.when($.ajax({
	      type: "POST",
	      url: "EntityMapper.aspx/"+serverFillFunction,
	      data: "{}",
	      contentType: "application/json; charset=utf-8",
	      dataType: "json",
	      success: function(msg) {
	      	fillDropdownFromJSON(ddID,msg.d);
	      },
	      error: function(){alert("Error: "+this.name);}
	    })
	).done(function(){});
}

function getDropdownKeyValueFromServer(ddID,serverFillFunction)
{
	$.when($.ajax({
	      type: "POST",
	      url: "EntityMapper.aspx/"+serverFillFunction,
	      data: "{}",
	      contentType: "application/json; charset=utf-8",
	      dataType: "json",
	      success: function(msg) {
	      console.log(ddID,JSON.stringify(msg));
	      	fillDropdownFromKeyValue(ddID,msg.d);
	      },
	      error: function(){alert("Error: "+this.name);}
	    })
	).done(function(){});
}

function fillDropdownFromKeyValue(ddID,keyvalues)
{
	var ddSelect = '#'+ddID;
	$(ddSelect).empty();
	//JSON should be a collection of ID and Value
	
	$.each(keyvalues, function(index,value) {
		$(ddSelect)
	     .append($("<option></option>")
	     .attr("value",value.id) // input value
	     .text(value.value)); //input text
    });
    $(ddSelect).change();
}

function fillDropdownFromJSON(ddID,json)
{
	
	var ddSelect = '#'+ddID;
	$(ddSelect).empty();
	//JSON should be a collection of ID and Value
	
	var opts = JSON.parse(json);
	
	for(op in opts)
	{
		$(ddSelect)
	     .append($("<option></option>")
	     .attr("value",opts[op].id) // input value
	     .text(opts[op].value)); //input text
    }
    $(ddSelect).change();
}


function querySourceEntitiesFromDB(criteria)
{
	 var retVals ="";
	 var inputData;
	 
	 
	 inputData= '{"criteria":'+JSON.stringify(criteria)+'}';//'{"queryByCriteriaRequest":{"criteria":'+JSON.stringify(criteria)+',"name":"querySourceEntities"}}';
	 console.log("querySourceEntitiesFromDB(criteria)",criteria, "JSON:",inputData);
	 
	 $.ajax({
	      type: "POST",
	      url: "EntityMapper.aspx/QuerySourceEntitiesCriteria",   //QuerySourceEntitiesCriteria",
	      data: inputData,
	      contentType: "application/json; charset=UTF-8",
	      dataType: "json",
	      processData:true,
	      success: function(msg) {
	      
			//check for collection return
			//alert("Found "+ msg.d.length+" items");
			_sourceEntities = msg.d
			
			if(jsPlumb.selectEndpoints({scope:"source"}) !== undefined)
			{
				jsPlumb.selectEndpoints({scope:"source"}).delete();
			}
	      	createTableFromEntities(msg.d,'sourceentdiv1')
	      	
	      	//Add onclick to row
	      	$('#sourceentdiv1tbl tr:gt(0)').click(function(){clickedCell('source',this);});
	      	
	      	//Add JSPlumb EndPoints
			$('#sourceentdiv1tbl tr:gt(0)').each(function() {
					
					jsPlumb.addEndpoint(this.id, { anchor:"RightMiddle" }, sourceGreyEndpointOptions);
			});
			SourceTargetChanged();
	      },
	      error: function(){alert("Error: "+this.name);}
	    });
	    
	
	return true;
}

function queryTargetEntitiesFromDB(criteria)
{
	 var retVals ="";
	 //var data = '{"sourceSystem":'+sourceSystem+',"entityType":'+entityType+'}';
	 var inputData= '{"criteria":'+JSON.stringify(criteria)+'}';
	 
	 $.ajax({
	      type: "POST",
	      url: "EntityMapper.aspx/QueryTargetEntitiesCriteria",
	      data: inputData,
	      contentType: "application/json; charset=utf-8",
	      dataType: "json",
	      success: function(msg) {
	     
			
			//check for collection return
			//alert("Found "+ msg.d.length+" items");
			_targetEntities = msg.d
	      	if(jsPlumb.selectEndpoints({scope:"target"}) !== undefined)
			{
				jsPlumb.selectEndpoints({scope:"target"}).delete();
			}
	      	createTableFromEntities(msg.d,'destentdiv1')
	      	
	      	$('#destentdiv1tbl tr:gt(0)').click(function(){clickedCell('target',this);});
	      	//Add JSPlumb EndPoints
			$('#destentdiv1tbl tr:gt(0)').each(function() {
					
					jsPlumb.addEndpoint(this.id, { anchor:"RightMiddle" }, targetGreyEndpointOptions);
			});
			
	      	SourceTargetChanged();
	      },
	      error: function(){alert("Error: "+this.name);}
	    });
	return true;
}


//function queryRelationshipsFromDB(_srcSourceSystem,_srcEntityType,_tarSourceSystem,_tarEntityType)
//{
function queryRelationshipsFromDB(criteria)
{
	 var retVals ="";
	  var inputData= '{"criteria":'+JSON.stringify(criteria)+'}';
	  console.log("queryRelationshipsFromDB(criteria)",inputData);
	 //var data = '{"sourceSystem":'+sourceSystem+',"entityType":'+entityType+'}';
	 
	 //var obj =  '{srcSourceSystem: '+_srcSourceSystem+',srcEntityType: '+_srcEntityType+',tarSourceSystem: '+_tarSourceSystem+',tarEntityType: '+_tarEntityType+'}';
	 			
	// alert ("queryRelationshipsFromDB");
	 
	 $.ajax({
	      type: "POST",
	      url: "EntityMapper.aspx/QueryRelationships",
	      data: inputData,
	      contentType: "application/json; charset=utf-8",
	      dataType: "json",
	      success: function(msg) {
	     
			//check for collection return
			//alert("Found "+ msg.d.length+" connections");
			_connections = msg.d
	      	
	      	// Show connections
	      	updateRelationshipsView(msg.d);
	      	
	      },
	      error: function(){alert("Error: "+this.name);}
	    });
	    
	
	return true;
}

function updateRelationshipsView(_conn)
{
	// Update End Points
	
	jsPlumb.detachEveryConnection();
	//alert("updateRelationshipsView: "+_conn.length);
	$.each(_conn, function(index,value){
		
		//Create Connections
		var objconn = {};
		// Check if Source or Target endpoints are available

		objconn.source =jsPlumb.getEndpoints(String("sourceentdiv1"+value.srcID)) == undefined? jsPlumb.getEndpoints(String("destentdiv1"+value.srcID))[0]:jsPlumb.getEndpoints(String("sourceentdiv1"+value.srcID))[0];
		objconn.target = jsPlumb.getEndpoints(String("destentdiv1"+value.targetID)) == undefined?jsPlumb.getEndpoints(String("sourceentdiv1"+value.targetID))[0]:jsPlumb.getEndpoints(String("destentdiv1"+value.targetID))[0];
		
		//alert("Source: "+objconn.source+" Target:"+objconn.target);
		var aConnection = jsPlumb.connect(objconn,databaseGreyEndpointOptions);
		
		aConnection.bind("click", function(conn) {
			connectionRightClick(conn);
		});
	});
	
	jsPlumb.repaintEverything();
}

function connectionRightClick(_conn)
{
	/*connector	The underlying Connector for this Connection (eg.
	sourceId	Id of the source element in the connection.
	targetId	Id of the target element in the connection.
	scope	Optional scope descriptor for the connection.
	endpoints	Array of [source, target] Endpoint objects.
	source	The source element for this Connection.
	target	The target element for this Connection.
	overlays List of Overlays for this component.*/
	
	
	$('#connectionRightClick').dialog({ position: { my: 'left top', at: 'right', of: event } });
	getDropdownKeyValueFromServer('relDialogDD','GetRelationshipTypes');
	
	$('#dialogSourceSpan').empty();
	$('#dialogTargetSpan').empty();
	$('#dialogSourceSpan').append($(_conn.source).data('detailsdata').name);
	$('#dialogTargetSpan').append($(_conn.target).data('detailsdata').name);
	
	$('#saveRelDialog').click(function() {
		updateRelationship(
			$(_conn.source).data('detailsdata'),
			$(_conn.target).data('detailsdata'),
			$('#relDialogDD').find(':selected').val()
		);
		$('#saveRelDialog').click(function(){});
		$('#connectionRightClick').dialog("close");
		});
	//alert("right clicked conncection: source:"+_conn.sourceId+" Target:"+_conn.targetId);
	
}


function clickedCell(sord,aCell)
{
	//alert("clicked: "+sord);
	$('#'+sord+'SelectedItem').empty();
	$('#'+sord+'SelectedItemDetails').empty();
	$('#'+sord+'SelectedItemDetails').data(sord+'detailsdata','');
	
	$('#'+sord+'SelectedItem').append($(aCell).text());
	var img=$('<img height="16" width="16" src="/js/button---delete---blue.png"></img>')
		.click(function(){$('#'+sord+'SelectedItem').empty(); $('#'+sord+'SelectedItemDetails').empty();$('#'+sord+'SelectedItemDetails').data(sord+'detailsdata','');});
	img.appendTo($('#'+sord+'SelectedItem'));
	
	console.log($(aCell).data('detailsdata'));
	
	$('#'+sord+'SelectedItemDetails').append(JSON.stringify($(aCell).data('detailsdata')));
	$('#'+sord+'SelectedItemDetails').data(sord+'detailsdata',JSON.stringify($(aCell).data('detailsdata')));
	
	//check if both items are set
	var source = $('#sourceSelectedItemDetails').data('sourcedetailsdata');
	var dest = $('#targetSelectedItemDetails').data('targetdetailsdata');
	
	if(source !== undefined && dest !== undefined)
	{
		if(source.length>1 && dest.length >1)
		{
			alert("both source:"+source+" and destination:"+dest+" are selected");
			$('<br>Relationship:').appendTo("#targetSelectedItemDetails");
			//$("")
			var relButton = $("<button id='updateRelationship'>Update Relationship</button>");
			relButton.click(function(){updateRelationship($('#sourceSelectedItemDetails').data('sourcedetailsdata'),$('#targetSelectedItemDetails').data('targetdetailsdata'));});
			relButton.appendTo("#targetSelectedItemDetails");
			
		}
	}
	//alert("you clicked on "+sord+": "+$(aCell).text());
}

function updateRelationship(sourceData,destData,relType)
{
	var updateRequestData="";
	var retVals ="";
	
	relType = relType == undefined?1:relType;
	
	updateRequestData ='{"updateRelationship":{';
	updateRequestData =updateRequestData+'"source":'+sourceData;
	updateRequestData =updateRequestData+',"dest":'+destData;
	updateRequestData =updateRequestData+',"relationshipType":'+relType;
	updateRequestData =updateRequestData+'}}';
	var e = updateRequestData;
	
	 $.ajax({
	      type: "POST",
	      url: "EntityMapper.aspx/UpdateRelationship",
	      data: e,
	      contentType: "application/json; charset=UTF-8",
	      dataType: "json",
	      processData: true,
	      success: function(msg) {
	      	alert("successfull relationship update: "+msg.d);
	      },
	      error: function(jqXHR,textStatus,errorThrown){alert("Error: "+errorThrown);}
	    });
	    
	alert("updating source:"+sourceData+" dest:"+destData+"<br> "+e);
	return true;
	
}

function createTableFromEntities(entities,destination)
{
	//Clear jsPlumb endpoints
	jsPlumb.detachEveryConnection(); //Hmm still didn't work
	
	//Clear the table
	$('#'+destination+'tbl').empty();
	
	//Add Headers
	$('#'+destination+'tbl').append($("<tr></tr>")
	.attr("id",destination+'r1'));
	$('#'+destination+'tbl tr:first').append($("<th></th>").append("ID"));
	$('#'+destination+'tbl tr:first').append($("<th></th>").append("NAME"));
	
	$.each(entities, function(index,value){
		

		var ret = $("<tr></tr>").appendTo($('#'+destination+'tbl'));
			ret.attr("id",destination+value.id);
		
		var atdID =$("<td>"+value.id+"</td>")
				atdID.appendTo(ret);
				
		var atdName =$("<td>"+value.name+"</td>")
				atdName.appendTo(ret);
				
			ret.data('detailsdata',value);
	  }); // backbone to store the results and view based on changes to results .. filtering etc.
	 
}